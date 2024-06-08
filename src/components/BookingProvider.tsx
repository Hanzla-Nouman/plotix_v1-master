"use client";
import { useEffect, useState } from "react";
import { CalProvider } from "@calcom/atoms";
import { useSearchParams } from "next/navigation";

export const BookingProvider = ({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId?: string;
}) => {
  const query = useSearchParams();
  const bookWithId = query.get("bookWithId");
  const [accessToken, setAccessToken] = useState<string>("");
  // bookWithId is used to show booker of a specific coach to the user
  // otherwise fall back to current user id to edit their own bookings and settings
  const userId = bookWithId || currentUserId;

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetch(`/api/bookings/link-booking-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        setAccessToken(data.accessToken);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <CalProvider
      accessToken={accessToken}
      clientId={process.env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID ?? ""}
      options={{
        apiUrl: process.env.NEXT_PUBLIC_CAL_URL ?? "",
        refreshUrl: "/api/bookings/refresh-token",
      }}
    >
      {children}
    </CalProvider>
  );
};
