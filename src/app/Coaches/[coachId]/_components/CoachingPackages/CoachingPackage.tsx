"use client";
import { CircleEllipsisIcon, Crown, Plus } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CoachWithRelations, CoachingPackageWithRelations } from "@/TSChema";
import CoachingPackageForm from "./CoachingPackageForm";
import EditButton from "@/components/EditButton";
import DeleteItem from "@/app/coaches/[coachId]/_components/DeleteItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface Props {
  coachPackage: CoachingPackageWithRelations,
  isEditable?: boolean,
  packagesLength: number,
  coach: CoachWithRelations
}

export default function CoachingPackage({ isEditable, coachPackage, packagesLength, coach }: Props) {
  const [packagePrice, setPackagePrice] = useState(coachPackage.price);
  const [packageNumberOfSessions, setPackageNumberOfSessions] = useState(coachPackage.numberOfSessions);
  const [activePackage, setActivePackage] = useState('basic');

  return (
    <Card
      className="relative p-0 rounded-xl flex flex-col gap-5 p-2"
      style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
    >
      {isEditable && (
        <Badge className="absolute top-4 right-4 sm:top-3 lg:top-4 z-10 bg-black/30 hover:bg-black/30 cursor-pointer py-0 backdrop-blur-md rounded-full flex items-center gap-3 w-fit">
          <CoachingPackageForm
            existingPackagesLength={packagesLength}
            userId={coach.userId}
            coachId={coach.id}
            defaultValue={coachPackage}
          >
            <EditButton />
          </CoachingPackageForm>
          <DeleteItem
            entityName="coachingPackage"
            entityId={coachPackage.id}
          />
        </Badge>
      )}
      <Badge className="absolute top-4 left-4 sm:top-3 lg:top-4 z-10 bg-black/30 hover:bg-black/30 p-2 pr-5 backdrop-blur-md rounded-full flex items-center gap-3 w-fit">
        <Crown className="w-6 h-6 p-1 bg-white rounded-full text-black" />
        <p className="font-semibold text-[13px] text-white">Top plans</p>
      </Badge>
      <CardHeader className="p-0 flex flex-col gap-2">
        <Avatar className="relative w-full h-44 sm:h-40 xl:h-44 2xl:h-52 rounded-md bg-secondary group/item">
          <AvatarImage src={coachPackage.image.url} className="object-cover" />
        </Avatar>

        <CardTitle className="text-[16px] px-4 sm:px-2 xl:px-6">
          {coachPackage.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-4 sm:px-2 xl:px-6 py-0">
        <div className="flex gap-4 w-full justify-center">
          <Button
            className={cn('px-4 py-1 text-[13px] font-semibold bg-sky-100 text-sky-900 hover:bg-sky-200', {
              'bg-sky-200': activePackage === 'basic'
            })}
            onClick={() => {
              setPackagePrice(coachPackage.price)
              setActivePackage('basic');
            }}
          >
            Basic
          </Button>
          <Button
            className={cn('px-4 py-1 text-[13px] font-semibold bg-green-100 text-green-900 hover:bg-green-200', {
              'bg-green-200': activePackage === 'standart'
            })}
            onClick={() => {
              if (coachPackage.price) {
                setPackagePrice(coachPackage.price * 1.3);
                setPackageNumberOfSessions(coachPackage.numberOfSessions * 2);
                setActivePackage('standart');
              }
            }}
          >
            Standart
          </Button>
          <Button
            className={cn('px-4 py-1 text-[13px] font-semibold bg-yellow-100 text-yellow-900 hover:bg-yellow-200', {
              'bg-yellow-200': activePackage === 'premium'
            })}
            onClick={() => {
              if (coachPackage.price) {
                setPackagePrice(coachPackage.price * 1.5);
                setPackageNumberOfSessions(coachPackage.numberOfSessions * 3);
                setActivePackage('premium');
              }
            }}
          >
            Premium
          </Button>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <p className="font-bold text-[13px]">$ {packagePrice}</p>
          <div className="w-1 h-1 bg-slate-600 rounded-full" />
          <p className="font-bold text-slate-600 text-[13px]">{packageNumberOfSessions} sessions</p>
        </div>
        <div className="w-full flex gap-4 lg:gap-2 xl:gap-4 items-center justify-center flex-wrap">
          {coachPackage.focusAreas.slice(0, 2).map((focusArea, i) => (
            <div key={i} className="py-2 px-4 text-orange-900 text-[12px] bg-orange-100 rounded-sm font-semibold">
              {focusArea.name}
            </div>
          ))}

          {coachPackage.focusAreas.length > 2 && (
            <div className="py-2 px-4 text-orange-900 text-[12px] bg-orange-100 rounded-sm font-semibold">
              + {coachPackage.focusAreas.slice(2).length}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
