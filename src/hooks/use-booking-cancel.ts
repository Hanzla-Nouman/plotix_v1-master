import { trpc } from "@/trpc/client";
import { useState, useCallback } from "react";
import { useCancelBooking } from "@calcom/atoms";
import { toast } from "sonner";

export const useBookingCancel = () => {
  const updateInternalBooking = trpc.booking.update.useMutation();
  const queryClient = trpc.useUtils();
  const [isLoading, setIsLoading] = useState(false);
  const updatePurchase = trpc.purchase.update.useMutation();
  const { mutate: cancelBooking } = useCancelBooking({
    onError: () => {
      setIsLoading(false);
      toast.error("Failed to cancel booking");
    },
    onSuccess: () => {
      setIsLoading(false);
      queryClient.booking.list.invalidate();
    },
  });
  const handleBookingCancel = useCallback(
    async (bookingId: number, bookingUid: string) => {
      setIsLoading(true);
      const booking = await updateInternalBooking.mutateAsync({
        where: {
          bookingId: `${bookingId}`,
        },
        data: {
          isCanceled: true,
        },
      });
      if (booking.purchaseId) {
        await updatePurchase.mutate({
          where: {
            id: booking.purchaseId,
          },
          data: {
            hasPendingBookings: true,
          },
        });
      }
      cancelBooking({ id: bookingId, uid: bookingUid });
    },
    [cancelBooking, updateInternalBooking]
  );

  return { isLoading, handleBookingCancel };
};
