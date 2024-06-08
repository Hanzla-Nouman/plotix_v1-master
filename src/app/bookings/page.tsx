"use client";
import { useRouter } from "next/navigation";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import uniqBy from "lodash/uniqBy";
import BookingSession from "@/components/BookingSession";
import { useAuth } from "@/hooks/use-auth";
import { useBookingCancel } from "@/hooks/use-booking-cancel";
import { TabsContent } from "@radix-ui/react-tabs";

export default function Bookings() {
  const { user } = useAuth();

  const { isLoading, data: bookings } = trpc.booking.list.useQuery({
    take: 50,
    where: {
      OR: [{ userId: user?.id }, { coachId: user?.coachId }],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const { handleBookingCancel } = useBookingCancel();
  const router = useRouter();

  const [activeBtn, setActiveBtn] = useState("Upcoming");

  const canceledBookings = bookings?.filter((booking) => booking.isCanceled);
  const pastBookings = bookings?.filter(
    (booking) => booking.startDate.getTime() < Date.now()
  );
  const upcomingBookings = bookings?.filter(
    (booking) => booking.endDate.getTime() > Date.now()
  );
  const tabsContent = [upcomingBookings, pastBookings, canceledBookings];
  const tabTriggers = ["Upcoming", "Past", "Cancelled"];
  return (
    <MaxWidthWrapper>
      <h1 className="my-4 text-2xl font-semibold">Your Bookings</h1>
      <p className="text-slate-500 text-[14px]">
        See your scheduled bookings here
      </p>

      <Tabs className="mt-4" value={activeBtn} onValueChange={setActiveBtn}>
        <TabsList className="w-fit mx-auto block p-2 gap-4">
          {tabTriggers.map((bookingType) => (
            <TabsTrigger
              value={bookingType}
              className={cn(
                "py-2 px-4 text-slate-400 rounded-sm transition-colors duration-150 bg-transparent hover:bg-white",
                {
                  "bg-white": bookingType === activeBtn,
                }
              )}
              key={bookingType}
            >
              {bookingType}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsContent.map((tabContent, index) => (
          <TabsContent
            key={`tab-content-${tabTriggers[index]}`}
            value={tabTriggers[index]}
          >
            <div className="mt-10 pb-1 flex flex-col gap-6 2xl:px-36 overflow-x-auto">
              {!isLoading &&
                uniqBy(tabContent || [], "id").map((booking) => (
                  <BookingSession
                    booking={booking}
                    key={booking.id}
                    onCancel={() =>
                      handleBookingCancel(
                        parseInt(booking.bookingId),
                        booking.bookingUid
                      )
                    }
                    onView={() => {
                      router.push(`/bookings/${booking.bookingUid}`);
                    }}
                    onReschedule={() => {
                      router.push(
                        `/bookings/schedule?rescheduleUid=${booking?.bookingUid}&eventSlug=${booking?.eventSlug}`
                      );
                    }}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </MaxWidthWrapper>
  );
}
