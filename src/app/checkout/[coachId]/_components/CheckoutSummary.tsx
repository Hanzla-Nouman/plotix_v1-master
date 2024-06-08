"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { CoachWithRelations } from "@/TSChema";
import Image from "next/image";

interface CheckoutSummaryProps {
  coach: CoachWithRelations;
}
export const CheckoutSummary: React.FC<CheckoutSummaryProps> = (props) => {
  const { coach } = props;
  const query = useSearchParams();
  const coachingPackageId = query.get("coachingPackageId");

  const coachingPackage = coach.coachingPackages.find(
    (cp) => cp.id === coachingPackageId
  );
  return (
    <div className="px-4 pt-8">
      <p className="text-xl font-medium">Checkout Sumamry</p>
      <p className="text-gray-400">Items you are about to buy:</p>
      <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
        <div className="flex flex-col rounded-lg bg-white sm:flex-row">
          {coachingPackage ? (
            <>
              {coachingPackage.image?.url && (
                <Image
                  className="m-2 h-28 w-28 rounded-md border object-cover object-center"
                  src={coachingPackage.image.url}
                  width={112}
                  height={112}
                  alt={coachingPackage.title}
                />
              )}
              <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold">
                  {coachingPackage.title} package with {coach.name}
                </span>
                <span className="float-right text-gray-400">
                  {coachingPackage.description}
                </span>
                <p className="text-lg font-bold">${coachingPackage.price}</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold">
                  60 minutes Individual session with {coach.name}
                </span>
                <p className="text-lg font-bold">${coach.hourlyRate}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
