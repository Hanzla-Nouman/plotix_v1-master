"use client";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormWrapper,
  FormInput,
  FormTextArea,
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
import { MediaSchema, PortfolioItemWithRelations } from "@/TSChema";

interface TPortfolioItemFormProps extends PropsWithChildren {
  coachId: string;
  userId: string;
  existingItemsLength: number;
  defaultValue?: PortfolioItemWithRelations;
}

const PortfolioItemFormInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  img: MediaSchema.nullish(),
  description: z.string().nullish(),
});

type TPortfolioItemFormInput = z.infer<typeof PortfolioItemFormInput>;

const PortfolioItemForm: React.FC<TPortfolioItemFormProps> = ({
  coachId,
  userId,
  defaultValue,
  children,
  existingItemsLength = 0,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = trpc.useUtils();

  const form = useForm<PortfolioItemWithRelations>({
    resolver: zodResolver(PortfolioItemFormInput),
    defaultValues: {
      id: defaultValue?.id,
      name: defaultValue?.name ?? "",
      img: defaultValue?.img,
      description: defaultValue?.description ?? "",
    },
  });

  const upsertPortfolioItem = trpc.portfolioItem.upsert.useMutation({
    onSuccess: async () => {
      await queryClient.coach.get.invalidate();

      toast.success("Portfolio item saved successfully");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: TPortfolioItemFormInput) => {
    const mappedValues = {
      ...values,
      order: existingItemsLength + 1,
      img: values.img ? { connect: { id: values.img.id } } : undefined,
    };

    await upsertPortfolioItem.mutateAsync({
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {!!defaultValue
              ? "Update portfolio item."
              : "Create new portfolio item"}
          </DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FormWrapper<PortfolioItemWithRelations>
          onSubmit={form.handleSubmit(onSubmit)}
          {...form}
        >
          <FormInput
            label="Title"
            name={`name`}
            type="text"
            placeholder="Script-writing skills course"
          />
          <FormTextArea
            label="Description"
            name="description"
            placeholder="Describe your role and responsibilities"
          />
          <FormImagePicker
            showPreview={true}
            userId={userId}
            defaultMedia={defaultValue?.img}
            label="Preview"
            name="img"
          />

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

export default PortfolioItemForm;
