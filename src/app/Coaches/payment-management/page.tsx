import { getCurrentUser } from "@/actions/getCurrentUser";
import { getTrpcCaller } from "@/trpc";
import { notFound } from "next/navigation";
import { PaymentManagementForm } from "./components/PaymentManagementForm";
import { StripeConnectProvider } from "@/components/Stripe/StripeConnectProvider";

export default async function PaymentManagementPage() {
  // TO DO: move this to a shared payment layout
  const user = await getCurrentUser();
  const trpcCaller = await getTrpcCaller();

  if (!user?.coachId) {
    return notFound();
  }

  const coach = await trpcCaller.coach.get({
    where: {
      id: user?.coachId,
    },
    select: {
      id: true,
      stripeAccountId: true,
      stripeDetailsSubmitted: true,
    },
  });

  return (
    <StripeConnectProvider coach={coach}>
      <PaymentManagementForm coach={coach} />
    </StripeConnectProvider>
  );
}
