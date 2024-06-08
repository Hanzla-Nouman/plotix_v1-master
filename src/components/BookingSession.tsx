import { Timer } from "lucide-react";
import Image from "next/image";
import user from "@/media/user.webp";
import { Avatar } from "./ui/avatar";
import React, { useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import coach from "@/media/coach-woman.webp";
import { BookingWithRelations } from "@/TSChema";

interface Props {
  booking: BookingWithRelations;
  onCancel: () => void;
  onView: () => void;
  onReschedule: () => void;
}

export default function BookingSession({
  booking,
  onCancel,
  onReschedule,
  onView,
}: Props) {
  const date = dayjs(booking.startDate).toDate();
  const startTime = dayjs(booking?.startDate).format(
    12 === 12 ? "h:mma" : "HH:mm"
  );
  const endTime = dayjs(booking?.endDate).format(12 === 12 ? "h:mma" : "HH:mm");
  const day = dayjs(date).format("dddd");
  const dayOfMonth = dayjs(date).format("D");

  const [optionsAreOpened, setOptionsAreOpened] = useState(false);

  return (
    <div
      className="w-max lg:w-full flex gap-4 justify-between items-center py-3 px-5 lg:py-5 lg:px-8 border border-slate-300 rounded-md relative"
      style={{ boxShadow: "0 4px 6px 0 rgba(0,0,0, 0.10)" }}
    >
      <div className="flex flex-col items-center w-16 lg:w-12">
        <p className="font-bold text-slate-600 text-[24px]">
          {day.toUpperCase()}
        </p>
        <p className="text-indigo-200 text-[24px]">{dayOfMonth}</p>
      </div>

      <div style={{ width: "2px" }} className="h-12 bg-slate-400" />

      <div className="flex items-center gap-2 w-28 lg:w-36">
        <Timer className="text-slate-500 w-7 h-7 lg:w-10 lg:h-10" />
        <div className="flex flex-col">
          <p className="text-slate-300 text-[14px] lg:text-[20px]">
            {startTime}
          </p>
          <p className="text-slate-300 text-[14px] lg:text-[20px]">{endTime}</p>
        </div>
      </div>

      <div style={{ width: "2px" }} className="h-12 bg-slate-400" />

      <div className="flex justify-center items-center gap-3 w-72 lg:w-80">
        <Avatar className="w-12 h-12 overflow-auto">
          <Image src={coach} fill alt="Coach" />
        </Avatar>

        <div className="flex flex-col gap-1 items-center">
          <p className="block w-max text-slate-500 text-[16px] lg:text-[20px] text-center">
            {booking.coachingPackage?.title || "Individual Session"}
          </p>

          {/* NEED TO DETECT IF SESSION TYPE IS PACKAGE OR COACHING  */}

          {/* <div className="w-full flex justify-center items-center gap-4 lg:gap-12">
            <div className="flex flex-col gap-1 items-center">
              <div className="flex justify-center px-3 bg-purple-200 text-[11px] w-max lg:text-[14px] text-slate-400 rounded-sm">
                Package
              </div>
              <div className="flex justify-center px-3 bg-purple-800 text-[11px] w-max lg:text-[14px] text-white rounded-sm">
                Session {session.sessionNumberInPackage}/3
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div style={{ width: "2px" }} className="h-12 bg-slate-400" />

      <div className="flex justify-center items-center gap-3 w-40">
        <Avatar className="w-12 h-12 overflow-auto">
          <Image src={user} fill alt="Coach" />
        </Avatar>

        {booking.user && (
          <p className="block max-w-16 text-center text-slate-400 text-[14px] lg:text-[20px]">
            {booking.user.name}
          </p>
        )}
      </div>

      <Button
        variant="icon"
        className="w-20 lg:w-24 hover:bg-white hover:text-primary transition-colors duration-150"
        onClick={() => setOptionsAreOpened(!optionsAreOpened)}
      >
        <Icons.ElipsisMenu />
      </Button>

      {optionsAreOpened && (
        <div className="flex items-center absolute top-6 right-0">
          <Button onClick={onView}>View booking</Button>

          <Button onClick={onCancel}>Cancel Booking</Button>

          <Button onClick={onReschedule}>Reschedule</Button>
        </div>
      )}
    </div>
  );
}
