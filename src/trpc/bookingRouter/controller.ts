import { prisma } from "@/prisma";
import {
  TBookingFindManyArgsSchema,
  TBookingUpsertArgsSchema,
  TBookingFindFirstArgsSchema,
  TBookingUpdateArgsSchema,
} from "./schema";
import { BookingWithRelations } from "@/TSChema";

export const upsertBooking = async ({
  input,
}: {
  input: TBookingUpsertArgsSchema;
}) => {
  const booking = await prisma.booking.upsert(input);

  return booking;
};
export const updateBooking = async ({
  input,
}: {
  input: TBookingUpdateArgsSchema;
}) => {
  const booking = await prisma.booking.update(input);

  return booking;
};

export const listBookings = async ({
  input,
}: {
  input: TBookingFindManyArgsSchema;
}) => {
  const bookings = await prisma.booking.findMany(input);

  return bookings as BookingWithRelations[];
};

export const getBooking = async ({
  input,
}: {
  input: TBookingFindFirstArgsSchema;
}) => {
  const booking = await prisma.booking.findFirst(input);

  return booking as BookingWithRelations;
};
