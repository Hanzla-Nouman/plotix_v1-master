import { CoachWithRelations } from "@/TSChema";
import CoachReel from "@/components/CoachReel";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";

interface Props {
  coachesList: (CoachWithRelations | null)[][]
}

export default function CoachesPageListing({ coachesList }: Props) {
  return (
    <MaxWidthWrapper className="relative">
      {coachesList.map((coachData, i) => (
        <div className="w-full" key={i}>
          <CoachReel
            title={coachData && coachData[0]?.categories[0]?.name || ''}
            subtitle="Easy access to the best expert you can ever found"
            linkTitle="View All"
            filteredCoachesData={coachData}
            withPagination
            href="/"
          />
        </div>
      ))}

      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{
          background: 'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
          width: '100%',
          height: '370px'
        }}
      >
        <div className="w-full absolute bottom-2 z-1 h-1/3 flex justify-center items center">
          <Button
            variant="outline"
            className="rounded-full border-purple-800 text-purple-800"
          >
            Load more expert
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
