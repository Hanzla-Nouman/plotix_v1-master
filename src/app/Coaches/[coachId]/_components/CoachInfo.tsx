import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { CoachWithRelations } from "@/TSChema";

interface TCoachInfoProps {
  coach: CoachWithRelations;
}
const CoachInfo = (props: TCoachInfoProps) => {
  const { coach } = props;
  return (
    <>
      <div className=" mt-2 inline-flex items-center justify-center text-neutral-900 px-2.5 py-1.5 text-sm font-medium">
        Hourly rate
      </div>
      <Badge className=" w-16 bg-purple-300 text-neutral-600 rounded-md">{` ${formatPrice(
        coach.hourlyRate,
        { currency: (coach.user?.preferedCurrency as any) || "USD" }
      )}/hr`}</Badge>
    </>
  );
};

export default CoachInfo;
