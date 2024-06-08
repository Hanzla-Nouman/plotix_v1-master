import { getCurrentUser } from "@/actions/getCurrentUser";
import { getTrpcCaller } from "@/trpc";
import { notFound } from "next/navigation";

import { CheckoutSummary } from "./_components/CheckoutSummary";
import { CheckoutForm } from "./_components/CheckoutForm";

interface PageProps {
  params: {
    coachId: string;
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { coachId } = params;
  const trpcCaller = await getTrpcCaller();
  const user = await getCurrentUser();
  const coach = await trpcCaller.coach.get({
    include: {
      user: {
        include: {
          avatar: true,
        },
      },
      coachingPackages: {
        include: {
          image: true,
          focusAreas: true,
        },
      },
    },
    where: {
      id: coachId,
    },
  });

  if (!coach || !user) {
    return notFound();
  }

  return (
    <section>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <CheckoutSummary coach={coach} />
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>
          <CheckoutForm currentUser={user} coach={coach} />
        </div>
      </div>
    </section>
  );
}
