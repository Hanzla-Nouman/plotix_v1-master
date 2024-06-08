"use client";

import React, { useState } from "react";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Coach } from "@/TSChema";
import { useStripeConnectContext } from "@/components/Stripe/StripeConnectProvider";
import { redirect, useRouter } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

interface OnboardingFormProps {
  coach: Coach;
}

const countryOptions = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
  { value: "DE", label: "Germany" },
];

export const OnboardingForm = (props: OnboardingFormProps) => {
  const { coach } = props;
  const router = useRouter();
  const [country, setCountry] = useState<string | undefined>("GB");
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const { connectedAccountId, setConnectedAccountId, stripeConnectInstance } =
    useStripeConnectContext();
  const createStripeAccount = trpc.stripe.createAccount.useMutation();
  const updateCoach = trpc.coach.update.useMutation();

  const handleSignupClick = async () => {
    setAccountCreatePending(true);
    setError(false);
    if (!country) {
      toast.error("Please select a country");
      return;
    }
    const { accountId, error } = await createStripeAccount.mutateAsync({
      country,
    });
    setAccountCreatePending(false);

    if (accountId) {
      await updateCoach.mutateAsync({
        where: { id: coach?.id },
        data: { stripeAccountId: accountId },
      });
      setConnectedAccountId(accountId);
    }

    if (error) {
      setError(true);
    }
  };

  const paymentManagementPath = "/coaches/payment-management";
  if (coach.stripeDetailsSubmitted) {
    redirect(paymentManagementPath);
  }
  const onSubmitSuccess = () => router.push(paymentManagementPath);

  return (
    <MaxWidthWrapper>
      {!connectedAccountId && (
        <h2 className="text-center mb-2 font-black text-4xl">
          Get ready for take off!
        </h2>
      )}
      {connectedAccountId && !stripeConnectInstance && (
        <h2>Add information to start accepting money</h2>
      )}
      {!accountCreatePending && !connectedAccountId && (
        <div className="max-w-md mx-auto mt-4">
          <p className="text-center">Where is your bank account based?</p>
          <Combobox
            skipForm
            value={country as any}
            onChange={(opt) => setCountry(opt as string)}
            mode="single"
            options={countryOptions}
          />
          <Button
            className="mt-5"
            disabled={!country}
            onClick={handleSignupClick}
          >
            Start
          </Button>
        </div>
      )}
      {stripeConnectInstance && (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectAccountOnboarding onExit={onSubmitSuccess} />
        </ConnectComponentsProvider>
      )}
      {error && <p className="error">Something went wrong!</p>}
      {(connectedAccountId || accountCreatePending) && (
        <div className="dev-callout">
          {accountCreatePending && <p>Creating a connected account...</p>}
        </div>
      )}
    </MaxWidthWrapper>
  );
};
