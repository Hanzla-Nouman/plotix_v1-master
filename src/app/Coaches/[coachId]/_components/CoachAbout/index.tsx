import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CoachWithRelations } from "@/TSChema";
import { Icons } from "@/components/Icons";
import CoachFAQs from "../CoachFAQs";
import CoachLinks from "../CoachLinks";
import { IntroVideoPicker, VideoWithPreview } from "../IntroVideoPicker";
import WorkExperience from "../WorkHistory";
import CoachHeadlineEditForm from "../CoachAboutMeEditForm";

interface Props {
  coach: CoachWithRelations,
  isEditable?: boolean
}

export default function CoachAboutTab({ coach, isEditable }: Props) {
  return (
    <TabsContent value="about">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xl:gap-8">
        <Card
          className="relative bg-gray-100 p-0 overflow-hidden w-full min-h-96 xl:min-h-112 xl:max-h-112 border border-slate-300 group/item"
          style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
        >
          <CardContent className="p-0 flex shrink-0 overflow-hidden h-full w-full rounded-none group/item">
            {isEditable ? (
              <IntroVideoPicker coach={coach} />
            ) : (
              <VideoWithPreview
                video={coach.introVideo}
                thumbnail={coach.introVideo?.thumbnail}
              />
            )}
          </CardContent>
        </Card>

        {!isEditable && coach.freeIntroductionOption && (
          <div className="col-span-1 flex flex-col gap-4 justify-between">
            <Card
              className="bg-card p-4 xl:py-10 flex flex-col gap-4 items-center justify-center border border-gray-300"
              style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
            >
              <h2 className="block max-w-48 text-sm font-semibold text-center">
                Start with a Free {coach.freeIntroductionOption} Session with {coach.name}
              </h2>
              <Button variant="outline" className="border-primary bg-card text-primary hover:bg-orange-100 hover:text-primary">Reserve Now</Button>
            </Card>

            <Card
              className="bg-card p-5 xl:py-10 flex flex-col gap-8 items-center justify-center border border-gray-300"
              style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
            >
              <div className="flex gap-4 items-center">
                <Button variant="ghost" className="hover:bg-transparent p-1">
                  <ArrowLeft />
                </Button>

                <div className="max-w-56 text-[14px] text-center">
                  “ Lako this is a great review for Lako...
                  Lako this is a great review for Lako...
                  Lako this is a great review for Lako... “
                </div>

                <Button variant="ghost" className="hover:bg-transparent p-1">
                  <ArrowRight />
                </Button>
              </div>

              <div className="flex flex-col xl:flex-row gap-2 justify-between items-center">
                <p className="block w-max font-bold text-[12px]">Neil Parikh</p>

                <div className="flex gap-2">
                  {[1, 2, 3].map(item => (
                    <Avatar key={item}>
                      <AvatarImage
                        src="/coach2.jpeg"
                        className="object-cover w-full"
                      />
                    </Avatar>
                  ))}

                  <Avatar className="flex items-center justify-center bg-gray-300">
                    <p className="text-gray-500">+17</p>
                  </Avatar>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="lg:col-span-1">
          {coach.workHistory.length > 0 && (
            <WorkExperience coach={coach} isEditable={isEditable} />
          )}
        </div>

        <div className={cn('h-full flex flex-col gap-6 justify-between', {
          'lg:col-span-1': !isEditable,
          'sm:col-span-2 gap-6 sm:grid grid-cols-2': isEditable,
        })}>
          <Card
            className="bg-orange-100 p-4 lg:p-12 max-h-44 flex gap-4 items-center justify-between h-full col-span-1"
            style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
          >
            <p className="font-semibold text-center block max-h-full overflow-y-auto">
              {coach.aboutMe}
            </p>

            {isEditable && (
              <CoachHeadlineEditForm coach={coach} />
            )}
          </Card>

          <div className="flex flex-col gap-2">
            <CoachFAQs isEditable={isEditable} coach={coach} />
            <CoachLinks coach={coach} />
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
