"use server";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { MessageSquare } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { getCurrentUser } from "@/actions/getCurrentUser";

const MessagesNav = async () => {
  const user = await getCurrentUser();

  return user ? (
    <Sheet>
      <SheetTrigger asChild>
        <MessageSquare className="text-gray-500 cursor-pointer" />
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col items-center pr-0 sm:max-w-lg">
        <SheetHeader className="font-semibold text-xl">Chat</SheetHeader>

        <div className="text-center justify-center">
          <div className="flex h-full flex-col items-center space-y-1">
            <div
              aria-hidden="true"
              className="relative h-60 w-60 text-muted-foreground "
            >
              {/* <Image src="/noMessage.png" fill alt="No Message" /> */}
            </div>
          </div>
        </div>

        <SheetDescription className="text-xl font-semibold text-gray-800">
          Your message box is empty.
        </SheetDescription>

        <SheetDescription className="font-normal text-sm mr-2 mt-2">
          Ready to fill it up with some great conversations?{" "}
        </SheetDescription>

        <SheetFooter>
          <Link
            href="/coaches"
            className={buttonVariants({
              variant: "link",
              size: "sm",
              className: "text-sm text-muted-foreground",
            })}
          >
            Explore our coaches
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : null;
};

export default MessagesNav;
