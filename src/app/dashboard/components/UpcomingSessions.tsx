import { Avatar } from "@/components/ui/avatar";
import getFirstLettersOfName from "@/helpers/getFirstLettersOfName";
import dayjs from "dayjs";
import { CalendarX } from "lucide-react";
import DashboardCard from "./DasboardCard";
import { Booking, Coach, User } from "@/TSChema";
import { Button } from "@/components/ui/button";

interface Props {
  bookings: (Booking & { coach: Coach, user: User })[],
  isCoach?: boolean
}

export default function UpcomingSessions({ bookings, isCoach }: Props) {
  if (isCoach) {
    return (
      <DashboardCard
        title="Upcoming Sessions"
        subtitle="Join or manage your upcoming coaching sessions."
        className="gap-12"
      >
        <div className="flex flex-col gap-6 overflow-auto max-w-full 2xl:max-h-48">
          {bookings && bookings.length < 1 ? (
            <div className="flex flex-col items-center justify-center sm:mt-8 gap-2">
              <CalendarX className="text-slate-500" />
              <p className="text-[14px] text-slate-400">No upcoming sessions</p>
            </div>
          ) : (
            bookings.map(booking => {
              const date = dayjs(booking.startDate);
              const formatPattern = 'MMMM D, YYYY [at] h:mma';
              const dateToSet = date.format(formatPattern);

              return (
                <div className="flex flex-col sm:flex-row md:flex-col 2xl:flex-row gap-4 justify-between items-center w-full" key={booking.id}>
                  <div className="w-full flex items-center gap-2">
                    <Avatar className="w-12 h-12 flex items-center justify-center text-primary font-bold rounded-full bg-violet-200">
                      {booking.user.name && <p>{getFirstLettersOfName(booking.user.name)}</p>}
                    </Avatar>

                    <div className="flex flex-col gap-1">
                      <p className="block w-max font-bold text-[16px]">{booking.user.name}</p>
                      <p className="block w-max text-slate-500 text-[16px]">Coaching Session</p>
                      <p className="block w-max text-slate-500 text-[16px]">{dateToSet}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-fit md:w-full 2xl:w-fit flex items-center gap-2">
                    <Button>Join</Button>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Upcoming Sessions"
      subtitle="View your upcoming  coaching sessions."
      className="gap-12"
    >
      <div className="flex flex-col gap-6 overflow-y-auto 2xl:max-h-48">
        {bookings.length < 1 ? (
          <div className="flex flex-col items-center justify-center sm:mt-8 gap-2">
            <CalendarX className="text-slate-500" />
            <p className="text-[14px] text-slate-400">No upcoming sessions</p>
          </div>
        ) : (
          bookings.slice(0, 2).map(booking => {
            const date = dayjs(booking.startDate);
            const formatPattern = 'MMMM D, YYYY [at] h:mma';
            const dateToSet = date.format(formatPattern);

            return (
              <div className="flex flex-col gap-4 xl:flex-row justify-between xl:items-center w-full" key={booking.id}>
                <div className="flex items-center gap-2">
                  <Avatar className="w-12 h-12 flex items-center justify-center text-primary font-bold rounded-full bg-violet-200">
                    {booking.coach.name && <p>{getFirstLettersOfName(booking.coach.name)}</p>}
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-[16px]">{booking.coach.name}</p>
                    <p className="block w-max text-slate-500 text-[16px]">{booking.coach.headline}</p>
                    <p className="block w-max text-slate-500 text-[16px]">{dateToSet}</p>
                  </div>
                </div>
                <Button>Join</Button>
              </div>
            );
          })
        )}
      </div>
    </DashboardCard>
  );
}
