import React from "react";
import { getTrpcCaller } from "@/trpc";
import { CoachWithRelations } from "@/TSChema";
import prepareDataForMapping from "@/helpers/prepareDataForMapping";
import CoachesListingPage from "./components/CoachesListingPage";

const Page = async () => {
  const trpcCaller = await getTrpcCaller();
  const coachList = await trpcCaller.coach.getCoachList({
    categories: [
      { name: "Top expert" },
      { name: "Comic" },
      { name: "Journalist" },
      { name: "Games" },
      { name: "Podcast" },
    ],
    take: 4,
  });

  const coachesData = coachList || [];
  const filteredCoachesData: (CoachWithRelations | null)[][] =
    prepareDataForMapping({ data: coachesData });

  return <CoachesListingPage filteredCoachesData={filteredCoachesData} />;
};

export default Page;
