"use client";
import { useState, PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import {
  FormWrapper,
  FormInput,
  FormCheckbox,
  FormTextArea,
  FormDatePicker,
  FormImagePicker,
} from "@/components/FormElements";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
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
import { MediaSchema, WorkExperienceWithRelations } from "@/TSChema";

interface TWorkExperienceFormProps extends PropsWithChildren {
  coachId: string;
  userId: string;
  defaultValue?: WorkExperienceWithRelations;
}

const WorkExperienceformInput = z.object({
  id: z.string().optional(),
  jobTitle: z.string(),
  companyName: z.string(),
  isCurrent: z.boolean(),
  description: z.string().nullish(),
  startDate: z.date(),
  endDate: z.date().nullish(),
  image: MediaSchema.nullish(),
});

type TWorkExperienceFormInput = z.infer<typeof WorkExperienceformInput>;

const WorkExperienceForm: React.FC<TWorkExperienceFormProps> = ({
  coachId,
  userId,
  defaultValue,
  children,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = trpc.useUtils();

  const form = useForm<WorkExperienceWithRelations>({
    resolver: zodResolver(WorkExperienceformInput),
    defaultValues: {
      id: defaultValue?.id,
      jobTitle: defaultValue?.jobTitle ?? "",
      companyName: defaultValue?.companyName ?? "",
      isCurrent: defaultValue?.isCurrent ?? false,
      description: defaultValue?.description ?? "",
      startDate: defaultValue?.startDate,
      endDate: defaultValue?.endDate,
      image: defaultValue?.image ?? null,
    },
  });

  const upsertWorkExperience = trpc.workExperience.upsert.useMutation({
    onSuccess: async () => {
      await queryClient.coach.get.invalidate();

      toast.success("Work experience saved successfully");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: TWorkExperienceFormInput) => {
    const mappedValues = {
      ...values,
      image: values.image ? { connect: { id: values.image.id } } : undefined,
    };
    await upsertWorkExperience.mutateAsync({
      where: {
        id: values.id || uuid(),
      },
      create: {
        ...mappedValues,
        coach: { connect: { id: coachId } },
      },
      update: {
        ...mappedValues,
      },
    });
  };

  // @ts-ignore
  const isCurrent = form.watch("isCurrent");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {!!defaultValue
              ? "Update work experience."
              : "Create new work experience"}
          </DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormWrapper<WorkExperienceWithRelations>
          onSubmit={form.handleSubmit(onSubmit)}
          {...form}
        >
          <FormInput
            label="Job Title"
            name={`jobTitle`}
            type="text"
            placeholder="Screenwriter"
          />
          <FormInput
            label="Company Name"
            name={`companyName`}
            type="text"
            placeholder="HBO"
          />
          <FormTextArea
            label="Description"
            name="description"
            placeholder="Describe your role and responsibilities"
          />
          <FormCheckbox label="My current job" name="isCurrent" />
          <FormDatePicker label="Start Date" name="startDate" />
          {!isCurrent && <FormDatePicker label="End Date" name="endDate" />}
          <FormImagePicker userId={userId} label="Company Logo" name="image" />

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

export default WorkExperienceForm;

