"use client";

import React from "react";
import {
  ConnectComponentsProvider,
  ConnectPayments,
  ConnectPayouts,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import { Button } from "@/components/ui/button";
import { useStripeConnectContext } from "@/components/Stripe/StripeConnectProvider";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect, useSearchParams } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Coach } from "@/TSChema";

const PaymentTabs = [
  { title: "Account Management", key: "account-management" },
  { title: "Payments", key: "Payments" },
  {
    title: "Payouts",
    key: "payouts",
  },
];

interface PaymentManagementFormProps {
  coach: Coach;
}

export const PaymentManagementForm = (props: PaymentManagementFormProps) => {
  const { coach } = props;
  const { stripeConnectInstance } = useStripeConnectContext();
  const query = useSearchParams();
  const defaultTab = query.get("activeTab") || PaymentTabs[0].key;
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  if (coach && !coach.stripeDetailsSubmitted) {
    redirect("/coaches/onboarding");
  }

  return (
    <MaxWidthWrapper>
      {stripeConnectInstance && (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <h1 className="text-center my-5 font-black text-4xl">
            Payment Management
          </h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-fit mx-auto block">
              {PaymentTabs.map((tab) => (
                <TabsTrigger
                  className="py-2 px-4"
                  key={tab.key}
                  value={tab.key}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            <Card className="py-5 mb-5">
              <CardContent>
                <TabsContent value={PaymentTabs[0].key}>
                  <CardTitle className="mb-3">{PaymentTabs[0].title}</CardTitle>
                  <ConnectAccountManagement />
                </TabsContent>
                <TabsContent value={PaymentTabs[1].key}>
                  <CardTitle className="mb-3">{PaymentTabs[1].title}</CardTitle>
                  <ConnectPayments />
                </TabsContent>
                <TabsContent value={PaymentTabs[2].key}>
                  <CardTitle className="mb-3">{PaymentTabs[2].title}</CardTitle>
                  <ConnectPayouts />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </ConnectComponentsProvider>
      )}
    </MaxWidthWrapper>
  );
};
