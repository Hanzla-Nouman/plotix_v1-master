"use client";

// CoachListing.tsx
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CoachWithRelations } from "@/TSChema";
import truncateText from "@/helpers/truncateText";
import getCategoryIcon, { CoachCategoryName } from "@/helpers/getCategoryIcon";

interface CoachListingProps {
  coach: CoachWithRelations | null;
  index: number;
  className?: string;
}

const CoachListing: React.FC<CoachListingProps> = ({
  coach,
  index,
  className,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Reverse the order of rendering coach
  const reversedIndex = 1 - index; // Assuming you have a fixed number of coach (5 in this case)

  // Show coach card in order of index (loading up)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, reversedIndex * 75);

    return () => clearTimeout(timer);
  }, [reversedIndex]);

  if (!coach || !isVisible) return <CoachPlaceholder className={className} />;

  const validUrls = coach?.user?.avatar ? [coach.user.avatar.url] : [];

  const CategoryIcon = getCategoryIcon(
    coach?.categories[0]?.name as CoachCategoryName
  );

  if (isVisible && coach) {
    //URL
    // Coach link to detail page
    return (
      <Link
        className={cn(
          "invisible h-full w-full cursor-pointer group/main",
          className,
          {
            "visible animate-in fade-in-5": isVisible,
          }
        )}
        href={`/coaches/${coach.id}`}
      >
        <div
          className="max-h-full h-full flex flex-col justify-between rounded-2xl h-full py-5 mt-1.5 first:ml-1 last:mr-1 border"
          style={{
            boxShadow:
              "0 4px 4px 0 rgba(0,0,0,.25),0-2px 7px 0 rgba(0,0,0,.06)",
          }}
        >
          {/* Coach IMAGE*/}
          <div className="relative">
            <ImageSlider urls={validUrls} coachName={coach.name} />

            <div className="flex flex-col gap-2 absolute top-0 left-0">
              {coach.categories && coach.categories.length > 0 && (
                <Badge className="flex justify-center items-center gap-2 ml-3 mr-2 bg-black opacity-40 p-1 hover:bg-black">
                  {CategoryIcon && (
                    <div className="flex justify-center items-center p-1 bg-white rounded-full">
                      <CategoryIcon
                        width={20}
                        height={20}
                        color="black"
                        className="w-4 h-4 xl:w-5 xl:h-5"
                      />
                    </div>
                  )}
                  <p className="white text-[10px] xl:text-[12px] pr-1">
                    {coach.categories[0]?.name}
                  </p>
                </Badge>
              )}

              {coach.freeIntroductionOption && (
                <Badge className="ml-3 w-fit">
                  <p className="uppercase font-bold mb-0 text-[10px]">
                    Free Intro
                  </p>
                </Badge>
              )}
            </div>
          </div>

          <div className="h-full flex flex-col justify-between px-6 gap-6">
            <div className="flex flex-col items-center w-full gap-2">
              <div className="flex items-center justify-center gap-5">
                <h3 className="text-[18px] text-gray-700 font-bold">
                  {coach.name}
                </h3>

                <p className="text-[12px] font-medium text-neutral-400">
                  {` ${formatPrice(coach.hourlyRate, {
                    currency: (coach.user?.preferedCurrency as any) || "USD",
                  })}/hr`}
                </p>
              </div>

              {coach.location && (
                <p className="flex justify-center text-[12px] font-medium text-neutral-400">
                  {coach.location}
                </p>
              )}

              <h3 className="flex justify-center font-semibold text-[14px]">
                {coach.headline}
              </h3>
            </div>

            {/* About Me */}
            <div className="flex w-full">
              {coach.aboutMe && (
                <div className="text-gray-500 text-[12px]">
                  {truncateText(coach.aboutMe, 11)}
                </div>
              )}
            </div>

            {/* FOCUS AREA */}
            <div className="flex flex-wrap gap-2 xl:gap-4">
              {coach.focusAreas &&
                coach.focusAreas.slice(0, 4).map((focusArea) => (
                  <div key={`${coach.id}_${focusArea.id}`}>
                    <Badge className="bg-purple-200 rounded-sm p-1 hover:bg-purple-200">
                      <div className="text-purple-800 text-[10px] font-semibold text-center">
                        {focusArea.name}
                      </div>
                    </Badge>
                  </div>
                ))}

              {/* Displaying free session duration */}
            </div>
          </div>
        </div>
      </Link>
    );
  }
};

type Props = { className?: string };

const CoachPlaceholder: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={`flex flex-col max-h-full h-full w-[316px] mx-auto mb-8 ${className}`}
    >
      {/* Card container without border */}
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};

export default CoachListing;
