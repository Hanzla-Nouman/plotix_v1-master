"use server";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Bell } from "lucide-react";
import { getCurrentUser } from "@/actions/getCurrentUser";

const NavNotification = async () => {
  const user = await getCurrentUser();

  return user ? (
    <Sheet>
      <SheetTrigger asChild>
        <Bell className="text-gray-500 cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col items-center pr-0 sm:max-w-lg">
        <SheetHeader className="font-semibold text-xl">
          Notifications
        </SheetHeader>
        <SheetDescription className="text-xl font-semibold text-gray-800 mt-72">
          No notifications yet.{" "}
        </SheetDescription>

        <SheetDescription className="font-normal text-sm mr-2 mt-2">
          This space will light up with important updates when they come in.
        </SheetDescription>
      </SheetContent>
    </Sheet>
  ) : null;
};

export default NavNotification;
