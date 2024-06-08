import { CoachWithRelations } from "@/TSChema";
import CoachFAQForm from "./CoachFAQForm";
import EditButton from "@/components/EditButton";
import AddButton from "@/components/AddButton";
import { Card } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetHeader, SheetTitle, SheetContent } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const coachFaqs = [
  { question: 'What if the time slot don’t work for me?', answer: 'Try again' },
  { question: 'Do you have a discord server?', answer: 'Yes' },
  { question: 'Which are recommended session for me?', answer: 'All' },
];

interface TCoachFAQsProps {
  coach: CoachWithRelations;
  isEditable?: boolean;
}

export default function CoachFAQs({ coach, isEditable }: TCoachFAQsProps) {
  const { name, coachFAQs = [], id: coachId } = coach;

  const sortedFAQs = coachFAQs.sort((a, b) => a.order - b.order);

  const hasFAQs = sortedFAQs?.length > 0;

  return (
    <Card
      className="bg-card flex items-center justify-center h-full"
      style={{ boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)' }}
    >
      <Sheet>
        <SheetTrigger className="w-full p-16">
          <h3 className="text-center font-semibold text-[32px]">
            FAQ&apos;s
          </h3>
        </SheetTrigger>

        <SheetContent className="w-full sm:w-[70%] lg:w-[50%] xl:w-[35%]">
          <SheetHeader>
            <div className="flex items-center gap-4">
              <SheetTitle className="text-left font-bold">
                {name}&apos;s FAQ&apos;s
              </SheetTitle>

              {isEditable && (
                <CoachFAQForm coachId={coachId} defaultFaqs={coachFAQs}>
                  {hasFAQs ? <EditButton /> : <AddButton />}
                </CoachFAQForm>
              )}
            </div>

            <div className="w-full flex flex-col">
              {coach.coachFAQs.map((faq, i) => (
                <Accordion key={i} type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <p className="text-left text-[14px] block max-w-[80%] md:max-w-full">
                          {faq.question}
                        </p>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
