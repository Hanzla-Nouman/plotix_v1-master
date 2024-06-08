'use client';
import CoachDashboard from "./components/CoachDashboard";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/trpc/client";
import UserDashboard from "./components/UserDashboard";
import { BookingWithUserAndCoach } from "./typedefs/dashBoardTypes";

export default function Page() {
  const { user } = useAuth();
  const isCoach = user?.role === 'coach';

  const where = isCoach ? {
    coachId: user?.coachId
  } : {
    userId: user?.id
  };

  const { data: purchasesQueryResults, isLoading } = trpc.purchase.list.useQuery(
    {
      where,
      include: {
        coach: true,
        user: true,
        bookings: true
      }
    },
    {
      enabled: !!user
    }
  );

  const { data: bookingQueryResults } = trpc.booking.list.useQuery({
    where,
    orderBy: {
      startDate: 'asc'
    },
    include: {
      coach: true,
      user: true
    }
  });

  const purchases = purchasesQueryResults ? purchasesQueryResults : [];
  const bookings = bookingQueryResults ? bookingQueryResults : [];

  if (isCoach) {
    return (
      <CoachDashboard
        isLoading={isLoading}
        user={user ? user : null}
        purchases={purchases}
        bookings={(bookings as BookingWithUserAndCoach[])}
      />
    );
  }

  return (
    <UserDashboard
      isLoading={isLoading}
      user={user ? user : null}
      purchases={purchases}
      bookings={(bookings as BookingWithUserAndCoach[])}
    />
  );
}
