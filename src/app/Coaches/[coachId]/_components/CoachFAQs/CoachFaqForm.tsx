"use client";
import { PropsWithChildren, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormWrapper, FormInput } from "@/components/FormElements";
import { z } from "zod";
import { CoachFAQ } from "@/TSChema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowUp } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

interface TCoachFAQFormProps extends PropsWithChildren {
  coachId: string;
  defaultFaqs: CoachFAQ[];
}

const CoachFAQFormInput = z.object({
  faqs: z.array(
    z.object({
      id: z.string().optional(),
      question: z.string(),
      answer: z.string(),
      coachId: z.string().optional(),
      order: z.number().optional(),
    })
  ),
});

type TCoachFAQFormInput = z.infer<typeof CoachFAQFormInput>;

const CoachFAQForm: React.FC<TCoachFAQFormProps> = ({
  coachId,
  defaultFaqs,
  children,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = trpc.useUtils();

  const form = useForm<TCoachFAQFormInput>({
    resolver: zodResolver(CoachFAQFormInput),
    defaultValues: {
      faqs: defaultFaqs,
    },
  });

  const updateFAQsMutation = trpc.coach.updateFAQs.useMutation({
    onSuccess: async () => {
      await queryClient.coach.get.invalidate();

      toast.success("FAQs updated successfully");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const faqFields = useFieldArray({
    name: "faqs",
    control: form.control,
  });

  const onSubmit = async (values: TCoachFAQFormInput) => {
    await updateFAQsMutation.mutateAsync({
      coachId,
      coachFAQs: values.faqs.map((faq, index) => ({
        ...faq,
        order: index,
      })),
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[80%] sm:max-w-[50%] lg:max-w-[40%] max-h-[60vh] xl:max-h-[80vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit your FAQ&apos;s</DialogTitle>
          <DialogDescription>
            Add and edit existing FAQ&apos;s. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormWrapper<TCoachFAQFormInput>
          onSubmit={form.handleSubmit(onSubmit)}
          {...form}
        >
          {faqFields.fields.map((field, index) => (
            <div key={field.id} className="relative grid gap-4 py-4">
              <FormInput
                label="Question"
                name={`faqs.${index}.question`}
                type="text"
                placeholder="Question"
              />
              <FormInput
                label="Answer"
                name={`faqs.${index}.answer`}
                type="text"
                placeholder="Answer"
              />
              <div className="absolute top-0 right-0 flex">
                <DeleteButton onClick={() => faqFields.remove(index)} />
                {index > 0 && (
                  <Button
                    variant="icon"
                    size="icon"
                    onClick={() => faqFields.move(index, index - 1)}
                  >
                    <ArrowUp width={20} height={20} />
                  </Button>
                )}
              </div>
              {index + 1 !== faqFields.fields.length && <hr className="mt-6" />}
            </div>
          ))}
          <Button
            className="w-full"
            variant="outline"
            type="button"
            onClick={() => {
              faqFields.append({
                question: "",
                answer: "",
              });
            }}
          >
            Add +
          </Button>
          <DialogFooter>
            <Button
              disabled={!form.formState.isDirty}
              isLoading={form.formState.isSubmitting}
              type="submit"
            >
              Save
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default CoachFAQForm;
