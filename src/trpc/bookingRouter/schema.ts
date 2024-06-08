import {
  BookingUpsertArgsSchema,
  BookingFindManyArgsSchema,
  BookingFindFirstArgsSchema,
  BookingUpdateArgsSchema,
} from "@/TSChema";
import { z } from "zod";

export type TBookingUpsertArgsSchema = z.infer<typeof BookingUpsertArgsSchema>;

export type TBookingUpdateArgsSchema = z.infer<typeof BookingUpdateArgsSchema>;

export type TBookingFindManyArgsSchema = z.infer<
  typeof BookingFindManyArgsSchema
>;

export type TBookingFindFirstArgsSchema = z.infer<
  typeof BookingFindFirstArgsSchema
>;
