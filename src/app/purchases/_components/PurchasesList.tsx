"use client";

import { Session } from "next-auth";
import { PurchaseListItem } from "./PurchaseListItem";
import { trpc } from "@/trpc/client";

interface PurchasesListProps {
  currentUser: Session["user"];
}

export const PurchasesList = (props: PurchasesListProps) => {
  const { currentUser } = props;
  const { data } = trpc.purchase.list.useQuery({
    where: {
      userId: currentUser?.id,
      paymentStatus: {
        not: "notStarted",
      },
    },
    include: {
      coachingPackage: {
        include: {
          image: true,
        },
      },
      bookings: true,
      user: true,
      coach: {
        include: {
          user: {
            include: {
              avatar: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="mt-10 pb-1 flex flex-col gap-6 2xl:px-36 overflow-x-auto">
      {data?.map((purchase) => (
        <PurchaseListItem
          key={purchase.id}
          currentUser={currentUser}
          purchase={purchase}
        />
      ))}
    </div>
  );
};
