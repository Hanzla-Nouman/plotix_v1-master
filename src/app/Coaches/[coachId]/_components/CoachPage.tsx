"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoachBanner from "./CoachBanner";
import CoachPackageTab from "./CoachingPackages";
import { CoachWithRelations } from "@/TSChema";
import { Session } from "next-auth";
import { trpc } from "@/trpc/client";
import { notFound } from "next/navigation";
import CoachSidebar from "./CoachSideBar";
import CoachPortfolioTab from "./Portfolio";
import CoachAboutTab from "./CoachAbout";

interface PageProps {
  staticCoachData: CoachWithRelations;
  user?: Session["user"];
}

export default function CoachPage({ staticCoachData, user }: PageProps) {
  const { id: coachId } = staticCoachData;

  const { data, error } = trpc.coach.get.useQuery({
    include: {
      workHistory: {
        include: {
          image: true,
        },
      },
      user: {
        include: {
          avatar: true,
        },
      },
      coachFAQs: true,
      introVideo: {
        include: {
          thumbnail: true,
        },
      },
      portfolioItems: {
        include: {
          img: true,
        },
      },
      focusAreas: true,
      coachingPackages: {
        include: {
          image: true,
          explainerVideo: true,
          focusAreas: true,
        },
      },
      categories: true,
      backgroundPicture: true,
    },
    where: {
      id: coachId,
    },
  });

  if (error) {
    console.log(error);

    return notFound();
  }

  const coach = data || staticCoachData;

  if (!coach) {
    return null;
  }

  const isEditable = coach.id === user?.coachId || user?.role === "admin";

  console.log(coach);

  return (
    <main className="md:flex min-h-screen flex-col items-center justify-between md:p-12 lg:px-9 xl:p-24">
      <div className="flex flex-col lg:flex-row">
        <CoachSidebar coach={coach} isEditable={isEditable} />

        <main className="flex-1 p-8 lg:p-4 2xl:px-10">
          <CoachBanner coach={coach} isEditable={isEditable} />

          <Tabs defaultValue="about">
            <TabsList className="flex sm:justify-center space-x-4 mb-6 overflow-x-auto py-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="package" >Package</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <CoachAboutTab coach={coach} isEditable={isEditable} />

            <CoachPackageTab coach={coach} isEditable={isEditable} />

            <CoachPortfolioTab coach={coach} isEditable={isEditable} />
          </Tabs>
        </main>
      </div>
    </main>
  );
}
