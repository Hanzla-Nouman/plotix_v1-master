"use client";
import { Coach } from "@/TSChema";
import {
  StripeConnectProvider,
  useStripeConnectContext,
} from "./StripeConnectProvider";
import {
  ConnectComponentsProvider,
  ConnectNotificationBanner,
} from "@stripe/react-connect-js";

interface StripeNotificationBannerProps {
  coach: Coach;
}

const StripeNotificationBannerBase = () => {
  const { stripeConnectInstance } = useStripeConnectContext();

  return stripeConnectInstance ? (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectNotificationBanner />
    </ConnectComponentsProvider>
  ) : null;
};

export const StripeNotificationBanner = (
  props: StripeNotificationBannerProps
) => {
  const { coach } = props;

  return coach ? (
    <StripeConnectProvider coach={coach}>
      <StripeNotificationBannerBase />
    </StripeConnectProvider>
  ) : null;
};
