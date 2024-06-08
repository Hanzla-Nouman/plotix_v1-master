import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarPicker, UserAvatar } from "@/components/AvatarPicker";
import { CoachWithRelations } from "@/TSChema";
import CoachDetailsForm from "./CoachDetailsForm";

interface TCoachSidebarProps {
  coach: CoachWithRelations;
  isEditable: boolean;
}

export default function CoachSidebar({ coach, isEditable }: TCoachSidebarProps) {
  return (
    <aside className="w-full lg:w-1/3 p-8 lg:p-4 xl:p-8 border-r">
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center space-y-4 cursor-pointer">
            {isEditable ? (
              <AvatarPicker
                media={coach.user?.avatar}
                name={coach.name}
                userId={coach.userId}
              />
            ) : (
              <UserAvatar media={coach.user.avatar} name={coach.name} />
            )}
          </div>

          {isEditable && <CoachDetailsForm coach={coach} />}

          <div className="text-center">
            <h1 className="text-2xl font-semibold">{coach.name}</h1>
            <div className="flex items-center justify-center gap-2">
              <p className="flex justify-center text-sm text-gray-500">
                {coach.headline}
              </p>
            </div>
          </div>
        </div>

        {!isEditable && (
          <div className="flex gap-2 justify-center">
            {coach.categories  && (
              <Badge variant="secondary">
                {coach.categories[0]?.name}
              </Badge>
            )}

            <Badge className="cursor-pointer" variant="secondary">
              52 Reviews
            </Badge>
          </div>
        )}

        <div className="border rounded-md p-4">
          <p className="text-sm">
            Meet Lako, a seasoned screenwriter with a rich background,
            including work at Netflix. Sarah&apos;s journey into storytelling
            began in college, where she discovered her passion...
          </p>

          {!isEditable && (
            <>
              <Button className="bg-primary hover:bg-orange-600 mt-4 w-full">Book a Session</Button>
              <Button className="mt-2 w-full" variant="outline">
                Message
              </Button>
            </>
          )}
        </div>

        <div className="space-y-2 ">
          <h2 className="text-lg font-semibold">Focus Areas</h2>

          <div className="flex flex-wrap gap-2 w-full">
            {coach.focusAreas.map(focusArea => (
              <Badge key={focusArea.id}>{focusArea.name}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Rate</h2>
          <p>${coach.hourlyRate}/hr</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Location</h2>
          <p>{coach.location}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Languages</h2>

          <div className="flex flex-wrap gap-2 w-full">
            {coach.language.map(language => (
              <p key={language}>{language}</p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
