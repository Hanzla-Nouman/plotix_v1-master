import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CurrentUser } from "../typedefs/dashBoardTypes";
import getFirstLettersOfName from "@/helpers/getFirstLettersOfName";
import { trpc } from "@/trpc/client";

export default function ProfileOverview({ user, isCoach }: { user: CurrentUser, isCoach?: boolean }) {
  let profileCompletePercent = 5;

  if (isCoach) {
    const { data: coach, isLoading } = trpc.coach.get.useQuery({ where: { id: user.coachId } });

    if (!isLoading && coach) {
      const totalFields = Object.keys(coach).length;
      let nonNullFields = 0;

      for (const key in coach) {
        if (coach[key as keyof typeof coach]) {
          nonNullFields++;
        }
      }

      profileCompletePercent = Math.floor((nonNullFields / totalFields) * 100);
    }
  }

  return (
    <Card
      className="w-full flex flex-col gap-8 md:flex-row items-center justify-between p-5 md:p-8 xl:px-20 xl:py-12 rounded-lg"
      style={{
        boxShadow:
          "0 4px 4px 0 rgba(0,0,0,.25),0-2px 7px 0 rgba(0,0,0,.06)",
      }}
    >
      <div className="flex items-center gap-4">
        <Avatar className="flex shrink-0 overflow-hidden rounded-full h-12 w-12 xl:h-16 xl:w-16">
          {user.avatar ? (
            <AvatarImage src={user.avatar} className="w-auto h-auto aspect-square object-cover" />
          ) : (
            <div className="flex items-center justify-center text-[36px] w-full h-full bg-violet-200 font-bold text-primary">
              {getFirstLettersOfName(user.name)}
            </div>
          )}
        </Avatar>
        <div className="flex flex-col gap-2">
          <h3 className="block w-max font-bold xl:text-[24px]">Welcome, {user.name.toUpperCase()}</h3>
          <p className="block w-max text-[12px] xl:text-[14px]">Your profile is {profileCompletePercent}% complete.</p>
        </div>
      </div>
      <Progress value={profileCompletePercent} className="md:w-[25%]" />
    </Card>
  );
}
