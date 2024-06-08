"use client";
import React from "react";
import { TGetInfiniteCoachesInputValidator } from "@/trpc/coachRouter/schema";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import CoachListing from "./CoachListing";
import { CoachWithRelations } from "@/TSChema";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { ArrowRight } from "lucide-react";
import prepareDataForMapping from "@/helpers/prepareDataForMapping";

interface CoachReelProps extends TGetInfiniteCoachesInputValidator {
  title: string;
  subtitle?: string;
  href?: string;
  className?: string,
  filteredCoachesData?: (CoachWithRelations | null)[],
  linkTitle?: string
  withPagination?: boolean
}

const CoachReel: React.FC<CoachReelProps> = (props) => {
  const {
    title,
    take = 15,
    subtitle,
    href,
    query,
    className,
    filteredCoachesData,
    linkTitle,
    withPagination = false
  } = props;

  const { data: queryResults, isLoading } =
    trpc.coach.getInfiniteCoaches.useInfiniteQuery(
      {
        take,
        query,
        sort: "desc",
      },
      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
      }
    );

  const usersData = queryResults?.pages.flatMap((page) => page.items) || [];
  let coachesData: (CoachWithRelations | null)[]
    = prepareDataForMapping({ data: usersData, isLoading });

  if (filteredCoachesData) {
    coachesData = filteredCoachesData;
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="flex flex-col gap-4 md:flex md:flex-row md:items-center md:justify-between mb-4">
        <div className="max-w-2xl lg:max-2-4xl">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <div className="flex gap-2 text-sm font-medium text-purple-600 hover:text-purple-500 md:w-fit">
            <div className="flex gap-6 justify-end md:gap-12 items-center w-full">
              <div className="flex gap-4 md:w-full">
                <Link href={href} className="block w-max">
                  {linkTitle || "Check out more"}
                </Link>
                <span aria-hidden="true"><ArrowRight /></span>
              </div>

              {withPagination && (
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="/" className="rounded-full p-3 border" />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext href="/" className="rounded-full p-3 border" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Card divs */}
      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full flex flex-col sm:grid grid-cols-6 sm:gap-x-4 lg:flex lg:flex-row lg:overflow-x-auto 2xl:grid 2xl:grid-cols-12">
            {coachesData
              .slice()
              .reverse()
              .map((coach, i) => (
                <div key={i} className="mb-6 col-span-3 lg:min-w-80 2xl:col-span-3">
                  <CoachListing coach={coach} index={i} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachReel;
