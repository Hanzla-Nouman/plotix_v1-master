import { getCurrentUser } from "@/actions/getCurrentUser";
import { notFound } from "next/navigation";
import { OnboardingForm } from "./components/OnboardingForm";
import { getTrpcCaller } from "@/trpc";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { StripeConnectProvider } from "@/components/Stripe/StripeConnectProvider";

export default async function CoachOnboardingPage() {
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
    <MaxWidthWrapper className="text-center">
      <div className="banner">
        <h1 className="font-black text-5xl text-center mt-5 mb-5">
          Coach Onboarding
        </h1>
      </div>
      <div className="content">
        {!coach ? (
          "Loading..."
        ) : (
          <StripeConnectProvider coach={coach}>
            <OnboardingForm coach={coach} />
          </StripeConnectProvider>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
