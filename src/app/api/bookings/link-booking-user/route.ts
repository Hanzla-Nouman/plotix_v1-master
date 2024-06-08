import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, timezone } = await req.json();

  const existingUser = await prisma.user.findUnique({
    include: {
      accounts: {
        where: {
          provider: "calcom",
        },
      },
    },
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    return NextResponse.json(
      {
        message: "User not found in the database",
      },
      { status: 404 }
    );
  }

  const calcomProviderAccount = existingUser?.accounts?.find(
    (account) => account.provider === "calcom"
  );

  if (calcomProviderAccount) {
    return NextResponse.json({
      id: calcomProviderAccount.providerAccountId,
      userId: existingUser.id,
      username: existingUser.name ?? "",
      accessToken: calcomProviderAccount.access_token ?? "",
    });
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CAL_URL ?? ""}/oauth-clients/${
      process.env.NEXT_PUBLIC_CAL_OAUTH_CLIENT_ID
    }/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": process.env.CAL_OAUTH_SECRET_KEY ?? "",
        origin: process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
      },
      body: JSON.stringify({
        email: existingUser?.email ?? "",
        name: existingUser?.name ?? "",
      }),
    }
  );
  const body = await response.json();

  if (!body.data?.user.id) {
    return NextResponse.json(
      {
        message: "Failed to create calcom user. Please try again.",
      },
      { status: 404 }
    );
  }

  const defaultScheduleResp = await createDefaultSchedule(
    body.data?.accessToken as string,
    timezone
  );
  const eventTypesResp = await createDefaultEventTypes(
    body.data?.accessToken as string
  );

  if (eventTypesResp.error || defaultScheduleResp.error) {
    return NextResponse.json(
      {
        message:
          "Failed to setup event types or default schedule. Please try again.",
      },
      { status: 404 }
    );
  }

  await prisma.account.create({
    data: {
      provider: "calcom",
      user: {
        connect: {
          id: existingUser?.id,
        },
      },
      type: "oauth",
      refresh_token: (body.data?.refreshToken as string) ?? "",
      access_token: (body.data?.accessToken as string) ?? "",
      providerAccountId: `${body.data?.user.id}`,
    },
  });

  return NextResponse.json({
    id: body?.data?.user?.id,
    userId: existingUser.id,
    username: (body.data?.username as string) ?? "",
    accessToken: (body.data?.accessToken as string) ?? "",
  });
}

const eventMeta = {
  disableGuests: true,
  seatsPerTimeSlot: 1,
  bookingFields: [],
  scheduleType: "MANAGED",
  locations: [
    {
      type: "link",
    },
  ],
  metadata: {
    config: {
      useHostSchedulesForTeamEvent: false,
    },
    managedEventConfig: {
      unlockedFields: {
        locations: true,
        scheduleId: true,
        destinationCalendar: true,
      },
    },
  },
};

const defaultEventTypesPayload = [
  {
    length: 15,
    slug: "free-intro-FifteenMinutes",
    title: `Free Introduction Session`,
    description: "Your session with this coach, free of charge.",
    ...eventMeta,
  },
  {
    length: 30,
    slug: "free-intro-ThirtyMinutes",
    title: `Free Introduction Session`,
    description: "Your session with this coach, free of charge.",
    ...eventMeta,
  },
  {
    length: 60,
    slug: "sixty-minutes-session",
    title: `One hour individual session`,
    description:
      "Your 1:1 session with this coach. Please specify your goals or questions in the booking form.",
    ...eventMeta,
    seatsPerTimeSlot: 1,
  },
];

async function createDefaultEventTypes(accessToken: string) {
  try {
    const responses = defaultEventTypesPayload.map((eventType) =>
      fetch(`${process.env.NEXT_PUBLIC_CAL_URL ?? ""}/event-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(eventType),
      })
    );

    await Promise.all(responses);

    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
}

async function createDefaultSchedule(accessToken: string, timeZone: string) {
  const name = "Default Schedule";
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CAL_URL ?? ""}/schedules`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          isDefault: true,
          timeZone,
        }),
      }
    );

    const schedule = await response.json();
    return schedule;
  } catch (e) {
    return { error: e };
  }
}
