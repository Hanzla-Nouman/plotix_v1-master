"use client";

import React from "react";
import { Booker, useMe } from "@calcom/atoms";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { generateRoomToken } from "@/lib/tokens";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/trpc/client";

export default function ScheduleBookingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const query = useSearchParams();
  const { data: calCoachData, isLoading } = useMe();
  const upsertBookingMutation = trpc.booking.upsert.useMutation();
  const updatePurchaseMutation = trpc.purchase.update.useMutation();

  const purchaseId = query.get("purchaseId");
  const rescheduleUid = query.get("rescheduleUid") || undefined;
  const eventSlug = query.get("eventSlug") || "sixty-minutes-session";

  const {
    data: purchase,
    isLoading: isPurchaseLoading,
    error: purchaseError,
  } = trpc.purchase.get.useQuery(
    {
      where: {
        id: purchaseId || "",
      },
      include: {
        bookings: true,
        coachingPackage: true,
      },
    },
    {
      enabled: !!purchaseId,
    }
  );

  const userId = query.get("bookWithId") || purchase?.coachId;

  const eventDuration =
    parseInt(
      query.get("eventDuration") || `${purchase?.coachingPackage?.time}` || "60"
    ) || 60;

  const roomToken = React.useMemo(generateRoomToken, []);
  const locationUrl = `${process.env.NEXT_PUBLIC_URL}/conference?room=${roomToken}`;

  const {
    data: coach,
    error,
    isLoading: coachIsLoading,
  } = trpc.coach.get.useQuery({
    select: {
      id: true,
      name: true,
    },
    where: {
      userId,
    },
  });

  const isFreeEvent = eventSlug?.slice(0, 10) === "free-intro";

  if (
    isLoading ||
    !calCoachData ||
    coachIsLoading ||
    (isPurchaseLoading && purchaseId)
  ) {
    return "Loading...";
  }

  if (!isFreeEvent && (!purchase || purchaseError)) {
    return "Purchase not found";
  }
  if (!calCoachData?.data?.username || error) {
    return notFound();
  }
  if (purchase && !purchase?.hasPendingBookings) {
    return "You have no paid sessions to book for a given purchase.";
  }

  const maxBookingsForPurchase =
    purchase?.coachingPackage?.numberOfSessions || 1;
  const sessionsBooked =
    purchase?.bookings?.filter((b) => !b.isCanceled)?.length || 0;
  const sessionsLeftToBook = maxBookingsForPurchase - sessionsBooked;

  return (
    <Booker
      name={user?.name}
      // @ts-ignore
      email={user?.email}
      rescheduleUid={rescheduleUid}
      duration={!rescheduleUid ? eventDuration : undefined}
      eventSlug={eventSlug}
      username={calCoachData?.data?.username || ""}
      hideBranding
      locationUrl={!rescheduleUid ? locationUrl : undefined}
      onCreateBookingSuccess={async (data) => {
        const booking = data.data;
        const updatePayload = {
          bookingUid: booking.uid as string,
          bookingId: `${booking.id}`,
          startDate: booking.startTime as Date,
          endDate: booking.endTime as Date,
          isCanceled: booking.status === "CANCELLED",
        };
        const createPayload = {
          ...updatePayload,
          eventSlug: eventSlug,
          roomId: roomToken,
          calcomUsername: calCoachData?.data?.username,
          coach: {
            connect: {
              id: coach.id,
            },
          },
          coachingPackage: purchase?.coachingPackageId
            ? {
                connect: {
                  id: purchase.coachingPackageId,
                },
              }
            : undefined,
          user: {
            connect: {
              id: user?.id,
            },
          },
        };
        const promises = [];
        promises.push(
          upsertBookingMutation.mutateAsync({
            where: {
              bookingId: `${booking.id}`,
            },
            create: createPayload,
            update: {
              ...updatePayload,
            },
          })
        );

        if (!rescheduleUid && purchase && sessionsLeftToBook - 1 <= 0) {
          promises.push(
            updatePurchaseMutation.mutateAsync({
              where: {
                id: purchase.id,
              },
              data: {
                hasPendingBookings: false,
              },
            })
          );
        }

        await Promise.all(promises);

        router.push(`/bookings/${booking.uid}`);
      }}
    />
  );
}
