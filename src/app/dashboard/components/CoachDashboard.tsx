"use client";
import { PurchaseWithRelations } from "@/TSChema";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import getFirstLettersOfName from "@/helpers/getFirstLettersOfName";
import { UsersRound, Wallet } from "lucide-react";
import DashboardCard from "./DasboardCard";
import ProfileOverview from "./ProfileOverview";
import UpcomingSessions from "./UpcomingSessions";
import RecentActivity from "./RecentActivity";
import LoadingDashBoard from "./LoadingDashBoard";
import { DashBoardProps } from "../typedefs/dashBoardTypes";

function RevenueOverview({
  purchases,
}: {
  purchases: PurchaseWithRelations[];
}) {
  const totalRevenue = purchases.reduce(
    (total, purchase) => total + purchase.price,
    0
  );

  return (
    <DashboardCard
      title="Revenue Overview"
      subtitle="Track your coaching earnings and income sources."
      className="gap-12"
    >
      {purchases.length > 0 ? (
        <div className="flex flex-col w-full h-full justify-between items-center">
          <div className="flex justify-between w-full items-center">
            <h3 className="font-bold text-[20px]">Current Wallet</h3>
            <h3 className="font-bold text-[20px]">{`$${totalRevenue}`}</h3>
          </div>
          <Button className="w-[40%]">Manage Payouts</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center sm:mt-8 gap-2">
          <Wallet className="text-slate-500" />
          <p className="text-[14px] text-slate-400">No income available yet!</p>
        </div>
      )}
    </DashboardCard>
  );
}

function ClientManagement({
  purchases,
}: {
  purchases: PurchaseWithRelations[];
}) {
  return (
    <DashboardCard
      title="Client Management"
      subtitle="View and manage your active clients."
      className="gap-12"
    >
      {purchases.length > 0 ? (
        <div className="flex flex-col gap-4 overflow-auto max-w-full 2xl:max-h-48">
          {purchases.map((purchase) => (
            <div
              className="flex gap-20 justify-between items-center w-full"
              key={purchase.id}
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-12 h-12 flex items-center justify-center text-primary font-bold rounded-full bg-violet-200">
                  {purchase.user.name && (
                    <p>{getFirstLettersOfName(purchase.user.name)}</p>
                  )}
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="block w-max font-bold text-[16px]">
                    {purchase.user.name}
                  </p>
                  <p className="block w-max text-slate-500 text-[16px]">
                    Coaching Session
                  </p>
                </div>
              </div>
              <Button variant="outline">Profile</Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center sm:mt-8 gap-2">
          <UsersRound className="text-slate-500" />
          <p className="text-[14px] text-slate-400">No active clients</p>
        </div>
      )}
    </DashboardCard>
  );
}

export default function CoachDashboard({
  user,
  purchases,
  isLoading,
  bookings,
}: DashBoardProps) {
  if (isLoading) {
    return <LoadingDashBoard isCoach />;
  }

  return (
    <div className="p-6 lg:px-16 lg:py-8 xl:px-36 xl:py-10">
      {user && <ProfileOverview user={user} isCoach />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-12 items-center mt-10">
        <UpcomingSessions bookings={bookings} isCoach />
        <RevenueOverview purchases={purchases} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-12 items-center mt-10">
        <RecentActivity purchases={purchases} />
        <ClientManagement purchases={purchases} />
      </div>
    </div>
  );
}
