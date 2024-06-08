"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { FormInput, FormWrapper } from "@/components/FormElements";
import FormFooter from "@/components/FormElements/formFooter";
import { CoachWithRelations } from "@/TSChema";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";


const HeadlineFormValidator = z.object({
  aboutMe: z.string()
});

type TCoachAboutMeFormValidator = z.infer<typeof HeadlineFormValidator>;

interface CoachAboutMeEditFormProps {
  coach: CoachWithRelations
}

export default function CoachAboutMeEditForm({ coach }: CoachAboutMeEditFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<TCoachAboutMeFormValidator>({
    resolver: zodResolver(HeadlineFormValidator),
    defaultValues: {
      aboutMe: coach.aboutMe || ''
    }
  });

  const queryClient = trpc.useUtils();

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

  const onSubmit = (values: TCoachAboutMeFormValidator) => {
    mutate({
      where: { id: coach.id },
      data: {
        aboutMe: values.aboutMe
          ? { set: values.aboutMe }
          : undefined,
      },
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

      <DialogTrigger asChild>
        <Button className="p-0 bg-transparent text-black hover:bg-transparent hover:text-primary">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[80%] sm:max-w-[50%] lg:max-w-[40%] max-h-[60vh] xl:max-h-[80vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit headline</DialogTitle>
        </DialogHeader>

        <FormWrapper<TCoachAboutMeFormValidator>
          {...form}
          onSubmit={onSubmit}
          className="gap-8"
        >
          <FormInput name="aboutMe" label="About me" />

          <FormFooter form={form} isLoading={isLoading} />
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
}


