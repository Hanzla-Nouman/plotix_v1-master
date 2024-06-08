"use client";
import { useState, useEffect } from "react";
import {
  loadConnectAndInitialize,
  StripeConnectInstance,
} from "@stripe/connect-js";
import { trpc } from "@/trpc/client";

export const useStripeConnect = (connectedAccountId?: string) => {
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance | null>(null);

  const createStripeAccountSession =
    trpc.stripe.createAccountSession.useMutation();

  const fetchClientSecret = async () => {
    if (!connectedAccountId) {
      throw "No connected account id provided.";
    }
    const data = await createStripeAccountSession.mutateAsync({
      accountId: connectedAccountId,
    });

    if (data.error) {
      throw data.error;
    }

    return data.client_secret || "";
  };

  useEffect(() => {
    if (
      !connectedAccountId ||
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ) {
      return;
    }

    setStripeConnectInstance(
      loadConnectAndInitialize({
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        fetchClientSecret,
        appearance: {
          variables: {
            colorPrimary: "#ffffff",
          },
        },
      })
    );
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;
