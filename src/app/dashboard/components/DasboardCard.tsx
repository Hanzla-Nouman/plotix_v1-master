import { ReactNode } from "react";
import { cn } from '@/lib/utils';
import { Card, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode,
  className?: string
  title: string,
  subtitle: string
}

export default function DashboardCard({ children, className, title, subtitle }: Props) {
  return (
    <Card
      className={cn("col-span-1 min-h-64 max-h-64 sm:min-h-80 sm:max-h-80 h-full p-4 sm:p-9 flex flex-col gap-5 rounded-lg", className)}
      style={{
        boxShadow:
          "0 4px 4px 0 rgba(0,0,0,.25),0-2px 7px 0 rgba(0,0,0,.06)",
      }}>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-[24px]">{title}</h3>
        <p className="text-[14px] text-slate-400">{subtitle}</p>
      </div>

      {children}
    </Card>
  );
}
