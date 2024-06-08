import { Activity } from "lucide-react";
import DashboardCard from "./DasboardCard";
import { PurchaseWithRelations } from "@/TSChema";

export default function RecentActivity({ purchases }: { purchases: PurchaseWithRelations[] }) {
  return (
    <DashboardCard
      title="Recent Activity"
      subtitle="Stay up-to-date with your recent coaching activities."
      className="gap-12"
    >
      {purchases.length > 0 ? (
        <div className="flex flex-col gap-6 overflow-y-auto 2xl:max-h-48">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[15px]">New Session Scheduled</h3>
            <p className="text-slate-500 text-[12px]">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[15px]">New Session Scheduled</h3>
            <p className="text-slate-500 text-[12px]">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[15px]">New Session Scheduled</h3>
            <p className="text-slate-500 text-[12px]">2 hours ago</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center sm:mt-8 gap-2">
          <Activity className="text-slate-500" />
          <p className="text-[14px] text-slate-400">No recent activity</p>
        </div>
      )}
    </DashboardCard>
  );
}
