"use client";

import React, { PropsWithChildren, useMemo, useState } from "react";
import { useStripeConnect } from "@/hooks/use-stripe-connect";
import { Coach } from "@/TSChema";
import { StripeConnectInstance } from "@stripe/connect-js";

interface StripeConnectProviderProps extends PropsWithChildren {
  coach: Coach;
}

interface StripeConnectContextValue {
  connectedAccountId?: string;
  setConnectedAccountId: (accountId: string) => void;
  stripeConnectInstance: StripeConnectInstance | null;
}

const StripeConnectContext = React.createContext<StripeConnectContextValue>({
  connectedAccountId: undefined,
  setConnectedAccountId: () => {},
  stripeConnectInstance: null,
});

export const useStripeConnectContext = () =>
  React.useContext(StripeConnectContext);

export const StripeConnectProvider = (props: StripeConnectProviderProps) => {
  const { coach, children } = props;
  const [connectedAccountId, setConnectedAccountId] = useState<
    string | undefined
  >(coach?.stripeAccountId || undefined);
  const stripeConnectInstance = useStripeConnect(connectedAccountId);

  const contextValue = useMemo(() => {
    return {
      connectedAccountId,
      setConnectedAccountId,
      stripeConnectInstance,
    };
  }, [connectedAccountId, stripeConnectInstance]);

  return coach ? (
    <StripeConnectContext.Provider value={contextValue}>
      {children}
    </StripeConnectContext.Provider>
  ) : null;
};
