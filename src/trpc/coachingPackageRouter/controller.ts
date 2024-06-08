import { prisma } from "@/prisma";
import {
  TCoachingPackageUpsertArgsSchema,
  TCoachingPackageDeleteArgsSchema,
} from "./schema";
import { CoachingPackage } from "@/TSChema";
import { TRPCError } from "@trpc/server";

async function upsertBookingEventType(
  coachingPackage: CoachingPackage,
  shouldCreate: boolean
): Promise<number> {
  const coach = await prisma.coach.findUnique({
    where: {
      id: coachingPackage.coachId,
    },
    include: {
      user: {
        include: {
          accounts: true,
        },
      },
    },
  });

  const accessToken = coach?.user?.accounts?.find(
    (account) => account.provider === "calcom"
  )?.access_token;

  const refreshedTokenResp = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/bookings/refresh-token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const refreshedTokenData = await refreshedTokenResp.json();
  if (refreshedTokenData.error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: refreshedTokenData.error,
    });
  }
  const endpointPath = shouldCreate
    ? "/event-types"
    : `/event-types/${coachingPackage.eventTypeId}`;
  const endpoint = `${process.env.NEXT_PUBLIC_CAL_URL ?? ""}/${endpointPath}`;
  const method = shouldCreate ? "POST" : "PATCH";
  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshedTokenData.accessToken}`,
    },
    body: JSON.stringify({
      disableGuests: true,
      bookingFields: [],
      locations: [
        {
          type: "link",
        },
      ],
      length: coachingPackage.time,
      slug: coachingPackage.id,
      title: coachingPackage.title,
      description: coachingPackage.description,
      seatsPerTimeSlot: coachingPackage.seats || 1,
    }),
  });

  const upsertedEventType = await response.json();

  return upsertedEventType?.data?.id;
}
export const upsertCoachingPackage = async ({
  input,
}: {
  input: TCoachingPackageUpsertArgsSchema;
}) => {
  const coachingPackage = await prisma.coachingPackage.upsert(input);

  const eventTypeId = await upsertBookingEventType(
    coachingPackage,
    !Boolean(coachingPackage?.eventTypeId)
  );

  if (!coachingPackage.eventTypeId && eventTypeId) {
    await prisma.coachingPackage.update({
      where: {
        id: coachingPackage.id,
      },
      data: {
        eventTypeId: eventTypeId,
      },
    });
  }

  return coachingPackage;
};

export const deleteCoachingPackage = async ({
  input,
}: {
  input: TCoachingPackageDeleteArgsSchema;
}) => {
  await prisma.coachingPackage.delete(input);

  return true;
};
