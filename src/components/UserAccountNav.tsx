"use server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { logout } from "@/actions/logout";
import { FormSubmitButton } from "./ui/form";

const UserAccountNav = async () => {
  const user = await getCurrentUser();
  const isCoach = user?.role === "coach";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Avatar className="rounded-full overflow-hidden border-2 border-white cursor-pointer">
          <AvatarImage
            src={user?.avatar || "https://github.com/shadcn.png"}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-black">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/purchases" className="cursor-pointer">
            Purchases
          </Link>
        </DropdownMenuItem>
        {isCoach && (
          <DropdownMenuItem>
            <Link href={`/coaches/${user.coachId}`}>Profile</Link>
          </DropdownMenuItem>
        )}
        {isCoach && (
          <DropdownMenuItem>
            <Link href="/bookings/availability">Availability</Link>
          </DropdownMenuItem>
        )}
        {isCoach && (
          <DropdownMenuItem>
            <Link href="/coaches/payment-management">Payments</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link href="/user/profile">Account Settings</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Refer a friend</DropdownMenuItem>
        <DropdownMenuItem>Become a Coach</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>Help & Support</DropdownMenuItem> */}
        <DropdownMenuItem>
          <form action={logout}>
            <FormSubmitButton className="w-full">Logout</FormSubmitButton>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
