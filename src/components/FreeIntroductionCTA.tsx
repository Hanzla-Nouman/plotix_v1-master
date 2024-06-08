"use client";

import { CoachWithRelations } from "@/TSChema";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";
import { trpc } from "@/trpc/client";

interface FreeIntroductionCTAProps {
  coach: CoachWithRelations;
  currentUser?: Session["user"];
}

const options = [
  { label: "15 minutes", value: "FifteenMinutes", duration: 15 },
  { label: "30 minutes", value: "ThirtyMinutes", duration: 30 },
  // Add other options as needed
];

const FreeIntroductionCTA: React.FC<FreeIntroductionCTAProps> = (props) => {
  const { coach, currentUser } = props;
  const {
    freeIntroductionOption,
    name: coachName,
    userId: coachUserId,
  } = coach;

  const existingFreeSessionWithCoach = trpc.booking.get.useQuery(
    {
      where: {
        userId: currentUser?.id,
        coachId: coach.id,
        isCanceled: false,
      },
    },
    {
      enabled: Boolean(currentUser?.id),
    }
  );

  if (!freeIntroductionOption || !coach || !existingFreeSessionWithCoach) {
    return null; // Do not render anything if free introduction is not available
  }

  const selectedOption = options.find(
    (option) => option.value === freeIntroductionOption
  );

  const selectedLabel = selectedOption?.label || "Unknown";

  return (
    <div className="mb-10 w-full h-full md:h-[99px] relative bg-stone-100 rounded-2xl flex flex-col md:flex-row md:items-center">
      <div className="ml-4 flex-auto flex items-center md:mr-8">
        <div className="">
          <div className="">
            <div className="text-neutral-950 text-base font-semibold  ">
              Free Introduction Session with {coachName.split(" ")[0]}
            </div>

            <div className="w-0.5 h-0.5 bg-stone-400 rounded-full mt-1.5" />
          </div>
          <div className="text-stone-400 text-sm font-medium leading-tight">
            Kickstart Your Journey with a Free {selectedLabel} Session
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 mt-4 md:mt-0 mr-6">
        <button className="w-full md:w-[156px] h-10 px-4 py-3 rounded-[300px] border border-purple-700 flex items-center justify-center gap-2.5 mb-4 ml-2">
          <Link
            href={
              currentUser
                ? {
                    pathname: "/bookings/schedule",
                    query: {
                      eventSlug: `free-intro-${selectedOption?.value}`,
                      eventDuration: selectedOption?.duration,
                      bookWithId: coachUserId,
                    },
                  }
                : "/sign-in"
            }
            className="text-purple-700 text-sm font-semibold  leading-none"
          >
            {currentUser ? "Reserve Now" : "Sign in to Book"}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FreeIntroductionCTA;
