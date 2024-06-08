"use client";

import {
  FormWrapper,
  FormInput,
  FormTextArea,
  FormSelect,
  FormFocusAreaSelect,
} from "@/components/FormElements";
import { z } from "zod";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { languageOptions } from "@/constants/Coach";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { LanguageOptionsSchema, CoachWithRelations } from "@/TSChema";
import { ExternalLink, Pencil } from "lucide-react";

interface TCoachDetailsFormProps {
  coach: CoachWithRelations;
}

const CoachDetailsFormValidator = z.object({
  name: z.string().min(3),
  headline: z.string().nullish(),
  location: z.string().nullish(),
  hourlyRate: z.number().min(1),
  aboutMe: z.string().nullish(),
  language: z.array(LanguageOptionsSchema),
  focusAreas: z.array(z.string()),
});

type TCoachDetailsFormValidator = z.infer<typeof CoachDetailsFormValidator>;

const CoachDetailsForm = (props: TCoachDetailsFormProps) => {
  const { coach } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = trpc.useUtils();

  const form = useForm<TCoachDetailsFormValidator>({
    resolver: zodResolver(CoachDetailsFormValidator),
    defaultValues: {
      name: coach.name,
      aboutMe: coach.aboutMe,
      focusAreas: coach.focusAreas.map((focusArea) => focusArea.id) || [],
      headline: coach.headline,
      hourlyRate: coach.hourlyRate,
      language: coach.language,
      location: coach.location,
    },
  });

  const { mutate, isLoading } = trpc.coach.update.useMutation({
    onError: (err: any) => {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    },
    onSuccess: async () => {
      await queryClient.coach.get.invalidate();
      setDialogOpen(false);
      toast.success("Your profile has been updated successfully!");
    },
  });

  const onSubmit = (values: TCoachDetailsFormValidator) => {
    const mappedFocusAreas = values?.focusAreas?.map((focusArea) => ({
      id: focusArea,
    }));

    mutate({
      where: { id: coach.id },
      data: {
        ...values,
        focusAreas: mappedFocusAreas?.length
          ? { set: mappedFocusAreas }
          : undefined,
      },
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex justify-center items-center gap-3">
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-2 items-center">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        </DialogTrigger>

        <Button variant="outline" className="flex gap-2 items-center">
          <ExternalLink className="h-4 w-4" />
          Share Profile
        </Button>
      </div>

      <DialogContent className="max-w-[80%] sm:max-w-[50%] lg:max-w-[40%] max-h-[60vh] xl:max-h-[80vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>

          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormWrapper<TCoachDetailsFormValidator> {...form} onSubmit={onSubmit}>
          <FormInput name="name" required label="Name" />
          <FormInput name="headline" required label="Headline" />
          <FormInput name="location" label="Location" />
          <FormInput
            name="hourlyRate"
            label="Hourly Rate"
            min={1}
            max={500}
            type="number"
          />
          <FormTextArea name="aboutMe" label="About Me" />
          <FormSelect
            name="language"
            mode="multiple"
            label="Languages"
            options={languageOptions}
          />
          <FormFocusAreaSelect
            name="focusAreas"
            mode="multiple"
            label="Focus Areas"
          />

          <DialogFooter>
            <Button
              disabled={!form.formState.isDirty}
              isLoading={isLoading}
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

export default CoachDetailsForm;
