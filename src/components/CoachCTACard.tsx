"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CoachWithRelations } from "@/TSChema";
import { Session } from "next-auth";

interface CoachCTACardProps {
  coach: CoachWithRelations;
  currentUser?: Session["user"];
}

export const CoachCTACard: React.FC<CoachCTACardProps> = (props) => {
  const { coach, currentUser } = props;
  const { name, id: coachId } = coach;

  return !currentUser ? null : (
    <div>
      <Button
        className={cn("w-full text-center font-normal mb-2 mt-3 text-white")}
      >
        <Link
          href={{
            pathname: `/checkout/${coachId}`,
          }}
        >
          Book a session
        </Link>
      </Button>

      {/* Message */}
      <Button
        variant={"outline"}
        className="flex items-center justify-center  p-3.5 w-full hover:bg-gray-100"
      >
        {" "}
        Message {name}
      </Button>
    </div>
  );
};

export default CoachCTACard;
