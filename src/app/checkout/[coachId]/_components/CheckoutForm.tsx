"use client";

import * as React from "react";
import { v4 as uuid } from "uuid";
import { loadStripe, Stripe as StripeInstance } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { trpc } from "@/trpc/client";
import { CoachWithRelations } from "@/TSChema";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import type Stripe from "stripe";

const useStripePromise = (coachStripeAccoundId?: string | null) => {
  const [promiseOrStripe, setPromiseOrStripe] =
    React.useState<PromiseLike<StripeInstance | null> | null>(null);
  const [activeAccountId, setActiveAccountId] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (!coachStripeAccoundId) {
      return;
    }

    if (coachStripeAccoundId === activeAccountId) {
      return;
    }
    const promise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      { stripeAccount: coachStripeAccoundId }
    );
    setPromiseOrStripe(promise);
    setActiveAccountId(coachStripeAccoundId);
  }, [coachStripeAccoundId]);

  return promiseOrStripe;
};

interface CheckoutFormProps {
  coach: CoachWithRelations;
  currentUser: Session["user"];
}

export const CheckoutForm = (props: CheckoutFormProps) => {
  const { coach, currentUser } = props;
  const query = useSearchParams();
  const router = useRouter();
  const coachingPackageId = query.get("coachingPackageId");
  const purchaseId = query.get("purchaseId");
  const coachingPackage = coach.coachingPackages.find(
    (cp) => cp.id === coachingPackageId
  );
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);

  const productTitle = coachingPackage
    ? `${coachingPackage.title} package with ${coach.name}`
    : `60 minutes Individual session with ${coach.name}`;
  const productPrice = coachingPackage
    ? coachingPackage.price
    : coach.hourlyRate;

  const upsertPurchaseMutation = trpc.purchase.upsert.useMutation();

  const createPurchase = async (session: Stripe.Checkout.Session) => {
    const updatedPurchase = await upsertPurchaseMutation.mutateAsync({
      where: {
        id: purchaseId || uuid(),
      },
      create: {
        price: productPrice,
        currency: coach?.user?.preferedCurrency || "USD",
        user: {
          connect: { id: currentUser.id },
        },
        coach: { connect: { id: coach.id } },
        eventSlug: coachingPackage?.id || "sixty-minutes-session",
        coachingPackage: coachingPackage
          ? {
              connect: { id: coachingPackage.id },
            }
          : undefined,
        checkoutSessionId: session?.id,
      },
      update: {
        checkoutSessionId: session?.id,
      },
    });

    if (!purchaseId) {
      let url = `/checkout/${coach.id}?purchaseId=${updatedPurchase.id}`;
      if (coachingPackageId) {
        url += `&coachingPackageId=${coachingPackageId}`;
      }
      router.push(url, {
        scroll: false,
      });
    }
  };

  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const fetchClientSecret = React.useCallback(async () => {
    if (!coach?.stripeAccountId || clientSecret) {
      return clientSecret || "";
    }

    const newSession = await createCheckoutSession.mutateAsync({
      product: {
        price_data: {
          currency: coach.user?.preferedCurrency || "USD",
          product_data: {
            name: productTitle,
            images: coachingPackage?.image?.url
              ? [coachingPackage?.image?.url]
              : [],
          },
          unit_amount: productPrice,
        },
        quantity: 1,
      },
      stripeCoachAccountId: coach.stripeAccountId,
    });

    if (!newSession.client_secret) {
      toast.error("Failed to create checkout session");
      return "";
    }
    createPurchase(newSession);
    setClientSecret(newSession.client_secret);

    return newSession.client_secret;
  }, [coach]);

  const options = React.useMemo(
    () => ({
      fetchClientSecret,
    }),
    [fetchClientSecret]
  );

  const stripePromise = useStripePromise(coach.stripeAccountId);

  return (
    <EmbeddedCheckoutProvider options={options} stripe={stripePromise}>
      {!clientSecret && <p>Loading...</p>}
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};
