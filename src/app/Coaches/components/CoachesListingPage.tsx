"use client";

import Footer from "@/components/ui/footer";
import CoachesPageListing from "./CoachesPageListing";
import CoachListingFilters from "./CoachListingFilters";
import CoachListingHeader from "./CoachListingHeader";
import { CoachWithRelations } from "@/TSChema";

interface Props {
  filteredCoachesData: (CoachWithRelations | null)[][]
}

export default function CoachesListingPage({ filteredCoachesData }: Props) {
  return <>
    <CoachListingHeader />

    <CoachListingFilters />

    <CoachesPageListing coachesList={filteredCoachesData} />

    <Footer />
  </>;
}
