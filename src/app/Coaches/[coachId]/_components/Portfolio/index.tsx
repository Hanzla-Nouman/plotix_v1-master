import { TabsContent } from "@/components/ui/tabs";
import { CoachWithRelations } from "@/TSChema";
import AddButton from "@/components/AddButton";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardTitle } from "@/components/ui/card";
import EditButton from "@/components/EditButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { Plus } from "lucide-react";
import PortfolioItemForm from "./PortfolioItemForm";
import DeleteItem from "../DeleteItem";

export default function CoachPortfolioTab({
  coach,
  isEditable,
}: {
  coach: CoachWithRelations;
  isEditable?: boolean;
}) {
  const existingItemsLength = coach.portfolioItems.length;

  if (!coach.portfolioItems || existingItemsLength === 0) {
    return (
      <TabsContent value="portfolio">
        {isEditable && (
          <Card className="w-full flex items-center justify-between p-4 mb-4">
            <CardTitle className="block w-max text-xl sm:text-2xl">Create new portfolio</CardTitle>

            <PortfolioItemForm
              existingItemsLength={existingItemsLength}
              userId={coach.userId}
              coachId={coach.id}
            >
              <Button className="px-10">
                <Plus className="w-4 h-4" />
              </Button>
            </PortfolioItemForm>
          </Card>
        )}

        <div className="font-semibold mt-5 mb-4 flex items-center gap-2">
          <span>No Portfolio Items</span>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="portfolio">
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-3 xl:gap-8">
        {isEditable && (
          <Card className="col-span-full flex items-center justify-between p-4">
            <CardTitle className="block w-max text-xl sm:text-2xl">Create new portfolio</CardTitle>

            <PortfolioItemForm
              existingItemsLength={existingItemsLength}
              userId={coach.userId}
              coachId={coach.id}
            >
              <Button className="px-10">
                <Plus className="w-4 h-4" />
              </Button>
            </PortfolioItemForm>
          </Card>
        )}

        {coach.portfolioItems.map(portfolioItem => (
          <div
            className="col-span-1 flex flex-col"
            key={portfolioItem.id}
          >
            {isEditable && (
              <div className="flex w-full justify-end items-center">
                <PortfolioItemForm
                  defaultValue={portfolioItem}
                  existingItemsLength={existingItemsLength}
                  userId={coach.userId}
                  coachId={coach.id}
                >
                  <EditButton />
                </PortfolioItemForm>

                <DeleteItem
                  entityName="portfolioItem"
                  entityId={portfolioItem.id}
                />
              </div>
            )}

            <Card
              className="relative p-0 rounded-xl flex flex-col px-3 py-9 cursor-pointer transition-colors duration-200 group/item hover:bg-gray-100"
              style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
            >
              <div className="absolute top-4 left-4 z-10 bg-black/30 p-2 backdrop-blur-md rounded-md w-fit visible xl:invisible flex items-center justify-center text-white text-[13px] px-4 py-1 transition-all duration-200 group-hover/item:visible">
                {portfolioItem.name}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Avatar className="w-full h-44 sm:h-32 md:h-36 lg:h-36 xl:h-44 2xl:h-36 rounded-md bg-secondary">
                    <AvatarImage src={portfolioItem?.img?.url} className="object-cover" />
                  </Avatar>
                </DialogTrigger>
                <DialogContent
                  className="max-w-fit p-0 rounded-xl p-2 2xl:p-6"
                  style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
                >
                  <div className="flex items-center w-full justify-between">
                    <h3 className="font-bold text-[24px]">{portfolioItem.name}</h3>
                    <DialogClose />
                  </div>
                  <div className="bg-gray-900 w-80 h-44 sm:w-128 sm:h-72 lg:w-144 lg:h-96 rounded-lg flex justify-center items-center">
                    <Button className="p-0 bg-transparent hover:bg-transparent hover:text-purple-900">
                      <Icons.play fill="#81559B" className="hover:fill-purple-900 duration-150 transition-colors" />
                    </Button>
                  </div>
                  <p className="text-slate-600 text-[16px]">{portfolioItem.description}</p>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        ))
        }
      </div >
    </TabsContent >
  );
}
