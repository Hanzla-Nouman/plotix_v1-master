import { Avatar } from "@/components/ui/avatar";
import { useMemo } from "react";
import Image from "next/image";
import { AlertCircle, CalendarClock, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PurchaseWithRelations } from "@/TSChema";
import Link from "next/link";
import { Session } from "next-auth";
import { PaymentStatusSchema } from "@/TSChema";

interface PurchaseListItemProps {
  purchase: PurchaseWithRelations;
  currentUser: Session["user"];
}

export const PurchaseListItem = (props: PurchaseListItemProps) => {
  const { currentUser, purchase } = props;
  const {
    coach,
    coachingPackage,
    bookings,
    hasPendingBookings,
    eventSlug,
    id: purchaseId,
    paymentStatus,
  } = purchase;

  const isPaid = paymentStatus === "success";
  const isPaymentInfoFilled = paymentStatus !== "notStarted";
  const isPaymentFailed = paymentStatus === "failed";
  const closestBooking = useMemo(
    () =>
      bookings.find((booking) => {
        return (
          hasPendingBookings &&
          new Date(booking.startDate) > new Date() &&
          !booking.isCanceled
        );
      }),
    [bookings, hasPendingBookings]
  );
  const bookingsCount = bookings.length;
  const totalAvailableSessions = coachingPackage?.numberOfSessions || 1;

  const purchaseTitle = coachingPackage?.title || "Individual Session";

  return (
    <div
      className={cn(
        `relative w-max lg:w-full flex gap-4 justify-between items-center 
      py-3 px-5 lg:py-5 lg:px-8 border border-slate-300 rounded-md`,
        {
          "bg-zinc-100": !closestBooking && hasPendingBookings,
        }
      )}
      style={{ boxShadow: "0 4px 6px 0 rgba(0,0,0, 0.15)" }}
    >
      <div className="flex items-center justify-center gap-2">
        <Avatar className="w-12 h-12 overflow-auto">
          <Image
            width={48}
            height={48}
            src={coach.user.avatar?.url || ""}
            alt="Coach"
            className="w-full h-full"
            sizes="contain"
          />
        </Avatar>

        <p className="text-slate-500 text-[16px] lg:text-[20px] text-center">
          {coach.name}
        </p>
      </div>

      <div style={{ width: "2px" }} className="h-12 bg-slate-400" />

      <div className="flex items-center gap-4">
        {coachingPackage && (
          <Avatar className="w-24 h-16 rounded-sm overflow-auto">
            <Image src={coachingPackage.image?.url} fill alt={purchaseTitle} />
          </Avatar>
        )}

        <p className="text-slate-500 text-[20px] lg:text-[24px] text-center">
          {purchaseTitle}
        </p>
      </div>

      <div style={{ width: "2px" }} className="h-12 bg-slate-400" />

      <div className="flex flex-col gap-1 items-center">
        <div className="flex justify-center px-3 bg-purple-200 text-[11px] w-max lg:text-[14px] text-slate-400 rounded-sm">
          {coachingPackage ? "Package" : "1:1"}
        </div>
        {totalAvailableSessions > 1 ? (
          <div className="flex justify-center px-3 bg-purple-800 text-[11px] w-max lg:text-[14px] text-white rounded-sm">
            Sessions Booked {bookingsCount}/{totalAvailableSessions}
          </div>
        ) : (
          <div className="flex justify-center px-3 bg-purple-800 text-[11px] w-max lg:text-[14px] text-white rounded-sm">
            {bookingsCount > 0 ? "Session Booked" : "Booking Pending"}
          </div>
        )}
      </div>

      <div style={{ width: "2px" }} className="h-12 bg-slate-400" />

      {closestBooking && (
        <div className="flex items-center gap-2 w-32 lg:w-36">
          <Timer className="text-slate-500 w-7 h-7 lg:w-10 lg:h-10" />
          <div className="flex flex-col">
            <p className="text-slate-300 text-[14px] lg:text-[20px]">
              {closestBooking.startDate.toDateString()}
            </p>
            <p className="text-slate-300 text-[14px] lg:text-[20px]">
              {closestBooking.endDate.toDateString()}
            </p>
          </div>
        </div>
      )}
      {!hasPendingBookings && !closestBooking && (
        <div className="flex items-center gap-2 w-32 lg:w-36">
          <p>Completed</p>
        </div>
      )}
      {!isPaid && !isPaymentInfoFilled && (
        <Button className="hover:bg-zinc-300 hover:border-zinc-400 lg:w-10 lg:h-10 p-2 bg-zinc-300 border border-zinc-300 rounded-sm">
          <Link
            href={{
              pathname: `/checkout/${coach.id}`,
              query: {
                coachingPackageId: coachingPackage?.id,
                purchaseId: purchase.id,
              },
            }}
          >
            Pay
          </Link>
        </Button>
      )}
      {isPaymentFailed && <p>Payment failed</p>}
      {!isPaid && isPaymentInfoFilled && <p>Payment Confirmation Pending</p>}
      {isPaid && hasPendingBookings && !closestBooking && (
        <div className="flex items-center gap-4 w-32 lg:w-36">
          <div className="flex justify-center px-3 bg-yellow-700 text-[11px] w-max lg:text-[14px] text-white rounded-sm">
            Book Now
          </div>

          <Button className="hover:bg-zinc-300 hover:border-zinc-400 lg:w-10 lg:h-10 p-2 bg-zinc-300 border border-zinc-300 rounded-sm">
            <Link
              href={{
                pathname: "/bookings/schedule",
                query: {
                  eventSlug,
                  purchaseId,
                  bookWithId: coach.userId,
                },
              }}
            >
              <CalendarClock className="text-slate-700" />
            </Link>
          </Button>

          <Button
            variant="icon"
            className="hover:bg-transparent absolute -right-1 -top-1"
          >
            <AlertCircle
              width={20}
              height={20}
              className="text-red-700 hover:text-red-900"
            />
          </Button>
        </div>
      )}
    </div>
  );
};
