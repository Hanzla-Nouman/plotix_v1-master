"use client";

import { useEffect } from "react";
import { BookingProvider } from "@/components/BookingProvider";
import { GcalConnect } from "@calcom/atoms";

const CoachConnectCalendar = () => {
  useEffect(() => {});

  return (
    <>
      <GcalConnect alreadyConnectedLabel={"You're all set up for bookings!"} />
    </>
  );
};

interface CoachConnectCalendarWithProviderProps {
  // id of a user who is about to be connected
  userId: string;
}

export const CoachConnectCalendarWithProvider = (
  props: CoachConnectCalendarWithProviderProps
) => {
  const { userId } = props;

  return (
    <BookingProvider currentUserId={userId}>
      <CoachConnectCalendar />
    </BookingProvider>
  );
};
