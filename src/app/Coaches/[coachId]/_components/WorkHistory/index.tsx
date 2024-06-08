import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import WorkExperienceForm from "./WorkExperienceForm";
import { Plus } from "lucide-react";
import { CoachWithRelations } from "@/TSChema";
import EditButton from "@/components/EditButton";
import DeleteItem from "@/app/coaches/[coachId]/_components/DeleteItem";

interface TMyWorkExperienceProps {
  coach: CoachWithRelations;
  isEditable?: boolean;
}

export default function WorkExperience({ isEditable, coach }: TMyWorkExperienceProps) {
  const { workHistory, id: coachId, userId } = coach;

  return (
    <Card
      className="p-8 bg-card sm:p-5 xl:px-8 flex flex-col justify-center xl:justify-between gap-5 xl:gap-10 rounded-8 border border-slate-300 xl:min-h-112 xl:h-112"
      style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
    >
      <CardHeader className="p-0 flex flex-row w-full items-center justify-between">
        <CardTitle className="text-xl xl:text-2xl">Experience</CardTitle>

        {isEditable && (
          <WorkExperienceForm userId={userId} coachId={coachId}>
            <Button className="flex gap-2 items-center w-fit text-[13px]">
              <Plus className="h-4 w-4" />
              Add new
            </Button>
          </WorkExperienceForm>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col gap-3 xl:gap-5 max-h-64 overflow-y-auto">
          {workHistory.map(workHistoryItem => (
            <div key={workHistoryItem.id}>
              <div className="flex items-center space-x-4">
                <Image
                  alt={`${workHistoryItem.companyName} Logo`}
                  loading="lazy"
                  width={0}
                  height={0}
                  decoding="async"
                  data-nimg="1"
                  className="object-cover shrink-0 rounded-full h-10 w-10"
                  src={`https://logo.clearbit.com/${workHistoryItem.companyName}.com?size=200&w=64&q=75`}
                />

                <div>
                  <div className="text-gray-800 text-md items-center flex gap-1">
                    <span>{workHistoryItem.jobTitle}</span>

                    {isEditable && (
                      <div className="flex items-center gap-3">
                        <WorkExperienceForm
                          userId={userId}
                          coachId={coachId}
                          defaultValue={workHistoryItem}
                        >
                          <EditButton />
                        </WorkExperienceForm>

                        <DeleteItem
                          entityName="workExperience"
                          entityId={workHistoryItem.id}
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm mr-2">
                    {workHistoryItem.companyName}{" "}
                    <span className="text-gray-500 text-sm">{" | "}</span>
                    <span className="text-gray-500 text-sm">
                      {workHistoryItem.startDate
                        ? new Date(workHistoryItem.startDate).toLocaleString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )
                        : "Present"}
                    </span>{" "}
                    -{" "}
                    {workHistoryItem.endDate
                      ? new Date(workHistoryItem.endDate).toLocaleString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                      : "Present"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Button className="p-0 flext justify-start text-sm bg-transparent hover:bg-transparent text-black hover:text-primary">
        See more...
      </Button>
    </Card>
  );
}
