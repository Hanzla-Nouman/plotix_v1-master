"use client";
import { PurchaseWithRelations } from "@/TSChema";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import getFirstLettersOfName from "@/helpers/getFirstLettersOfName";
import { Pencil } from "lucide-react";
import DashboardCard from "./DasboardCard";
import LoadingDashBoard from "./LoadingDashBoard";
import UpcomingSessions from "./UpcomingSessions";
import RecentActivity from "./RecentActivity";
import ProfileOverview from "./ProfileOverview";
import { DashBoardProps } from "../typedefs/dashBoardTypes";

function CoachFeedback({ purchases }: { purchases: PurchaseWithRelations[] }) {
  return (
    <DashboardCard
      title="Coach Feedback"
      subtitle="View feedback and notes from your coach."
      className="items-center text-center gap-16"
    >
      {purchases.length > 0 && purchases.some(purchase => purchase.bookings.length > 0) ? (
        <div className="flex flex-col gap-4 max-w-full overflow-auto 2xl:max-h-48">
          {purchases.map(purchase => (
            <div className="flex xl:justify-center sm:mt-8 gap-20 md:gap-44 xl:gap-80 items-center w-full" key={purchase.id}>
              <div className="flex items-center gap-2">
                <Avatar className="w-12 h-12 flex items-center justify-center text-primary font-bold rounded-full bg-violet-200">
                  {purchase.coach.name && <p>{getFirstLettersOfName(purchase.coach.name)}</p>}
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="block w-max font-bold text-[16px] text-left">{purchase.coach.name}</p>
                  <p className="block w-max text-slate-500 text-[16px]">Coaching Session</p>
                </div>
              </div>
              <Button variant="outline">Profile</Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center sm:mt-8 gap-2">
          <Pencil className="text-black" />
          <p className="text-[14px] text-black">No upcoming sessions</p>
        </div>
      )}
    </DashboardCard>
  );
}

export default function UserDashboard({ user, purchases, isLoading, bookings }: DashBoardProps) {
  if (isLoading) {
    return <LoadingDashBoard />;
  }

  return (
    <div className="p-6 lg:px-16 lg:py-8 xl:px-36 xl:py-10">
      {user && <ProfileOverview user={user} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-12 items-center mt-10">
        <UpcomingSessions bookings={bookings} />
        <RecentActivity purchases={purchases} />
      </div>

      <div className="grid grid-cols-1 items-center mt-10">
        <CoachFeedback purchases={purchases} />
      </div>
    </div>
  );
}

