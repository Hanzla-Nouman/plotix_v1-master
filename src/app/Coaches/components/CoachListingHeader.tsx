import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { StarCombo } from "@/components/StarCombo";
import CoachListingSearch from "./CoachListingSearch";

export default function CoachListingHeader() {
  return (
    <>
      <MaxWidthWrapper className="mt-4">
        <div className="relative bg-stone-100 rounded-3xl overflow-hidden">
          <div className="absolute -left-20 sm:-bottom-80 sm:-left-40 z-0">
            <StarCombo />
          </div>


          <div className="relative z-10 py-16 sm:py-24 mx-auto text-center flex flex-col items-center max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Creative Coaches
            </h1>

            <p className="mt-6 text-lg max-w-prose text-muted-foreground">
              Find creative coaches to accelerate your growth.
            </p>
          </div>
        </div>
      </MaxWidthWrapper>

      <CoachListingSearch />
    </>
  );
}
