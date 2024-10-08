import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

interface DashBoardLayoutProps {
  children: React.ReactNode;
}
export default async function DashBoardLayout({ children }: DashBoardLayoutProps) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
        {children}
    </SessionProvider>
  );
}

