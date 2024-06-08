import "@calcom/atoms/globals.min.css";
import { BookingProvider } from "@/components/BookingProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

interface BookingLayoutProps {
  children: React.ReactNode;
}
export default async function BookingLayout({ children }: BookingLayoutProps) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <BookingProvider currentUserId={session?.user?.id}>
        {children}
      </BookingProvider>
    </SessionProvider>
  );
}
