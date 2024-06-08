import * as bookingController from "./controller";
import { t } from "@/trpc/server";
import {
  BookingUpsertArgsSchema,
  BookingFindManyArgsSchema,
  BookingUpdateArgsSchema,
  BookingFindFirstArgsSchema,
} from "@/TSChema";

const bookingRouter = t.router({
  upsert: t.procedure
    .input(BookingUpsertArgsSchema)
    .mutation(bookingController.upsertBooking),
  update: t.procedure
    .input(BookingUpdateArgsSchema)
    .mutation(bookingController.updateBooking),
  list: t.procedure
    .input(BookingFindManyArgsSchema)
    .query(bookingController.listBookings),
  get: t.procedure
    .input(BookingFindFirstArgsSchema)
    .query(bookingController.getBooking),
});

export default bookingRouter;
