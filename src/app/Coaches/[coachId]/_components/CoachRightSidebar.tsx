import CoachCTACard from "@/components/CoachCTACard";
import { Badge } from "@/components/ui/badge";
import { CoachWithRelations } from "@/TSChema";
import { IntroVideoPicker, VideoWithPreview } from "./IntroVideoPicker";
import { CoachConnectCalendarWithProvider } from "./CoachConnectCalendar";
import { Session } from "next-auth";

interface TCoachRightSidebarProps {
  coach: CoachWithRelations;
  currentUser?: Session["user"];
  isEditable?: boolean;
}
const CoachRightSidebar = (props: TCoachRightSidebarProps) => {
  const { coach, isEditable, currentUser } = props;

  return (
    <div className="lg:border rounded-lg static flex lg:flex-col items-center flex-wrap gap-2 lg:gap-0 justify-center lg:items-end lg:fixed lg:max-w-[25%] lg:top-[80px] sm:right-8 p-4">
      {isEditable ? (
        <IntroVideoPicker coach={coach} />
      ) : (
        <VideoWithPreview
          video={coach.introVideo}
          thumbnail={coach.introVideo?.thumbnail}
        />
      )}
      {isEditable ? (
        <CoachConnectCalendarWithProvider userId={coach.userId} />
      ) : (
        <CoachCTACard currentUser={currentUser} coach={coach} />
      )}
      <div>
        <div className="ml-4 mt-6 font-semibold text-[8px]">
          {coach.name} can help with:
        </div>
        <div className="flex mt-2 flex-wrap gap-2 p-2 ">
          {coach.focusAreas.map((area) => (
            <Badge
              className="items-centerml-2 font-normal text-[10px] text-nowrap"
              key={area.id}
            >
              {area.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachRightSidebar;
