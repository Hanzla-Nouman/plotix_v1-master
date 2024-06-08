"use client";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormWrapper,
  FormInput,
  FormTextArea,
  FormImagePicker,
  FormVideoPicker,
  FormCoachingPackagesCategorySelect,
  FormFocusAreaSelect,
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
import { MediaSchema, CoachingPackageWithRelations } from "@/TSChema";
import PackageTypeSelect from "./PackageTypeSelect";
import FormFooter from "@/components/FormElements/formFooter";

interface TCoachingPackageFormProps extends PropsWithChildren {
  coachId: string;
  userId: string;
  existingPackagesLength: number;
  defaultValue?: CoachingPackageWithRelations;
}

const CoachingPackageFormInput = z.object({
  id: z.string().uuid().optional(),
  categoryId: z.string(),
  title: z.string(),
  image: MediaSchema.nullish(),
  explainerVideo: MediaSchema.nullish(),
  description: z.string(),
  price: z.number().int().min(0),
  time: z.number().int().min(0),
  numberOfSessions: z.number().int(),
  focusAreas: z.array(z.string())
});

type TCoachingPackageFormInput = z.infer<typeof CoachingPackageFormInput>;

const CoachingPackageForm: React.FC<TCoachingPackageFormProps> = ({
  coachId,
  userId,
  defaultValue,
  existingPackagesLength,
  children,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = trpc.useUtils();

  const form = useForm<TCoachingPackageFormInput>({
    resolver: zodResolver(CoachingPackageFormInput),
    defaultValues: {
      id: defaultValue?.id,
      categoryId: defaultValue?.categoryId ?? "",
      title: defaultValue?.title ?? "",
      image: defaultValue?.image,
      explainerVideo: defaultValue?.explainerVideo,
      description: defaultValue?.description ?? "",
      time: defaultValue?.time ?? 0,
      price: defaultValue?.price ?? 0,
      numberOfSessions: defaultValue?.numberOfSessions ?? 0,
      focusAreas: defaultValue?.focusAreas.map((focusArea) => focusArea.id) || [],
    },
  });

  const upsertCoachingPackage = trpc.coachingPackage.upsert.useMutation({
    onSuccess: async () => {
      await queryClient.coach.get.invalidate();

      toast.success("Coaching package saved successfully");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: focusAreasList } = trpc.focusArea.list.useQuery({});

  const onSubmit = async (values: TCoachingPackageFormInput) => {
    const { categoryId, ...rest } = values;
    const mappedValues = {
      ...rest,
      order: existingPackagesLength + 1,
      explainerVideo: values.explainerVideo
        ? { connect: { id: values.explainerVideo.id } }
        : undefined,
    };
    const mappedFocusAreas = values?.focusAreas?.map((focusArea) => ({
      id: focusArea,
    }));

    const focusAreaForCreating = values?.focusAreas?.map(focusArea => {
      return focusAreasList?.find(area => area.name === focusArea)
        || { id: uuid(), name: '' };
    });

    await upsertCoachingPackage.mutateAsync({
      where: {
        id: values.id || uuid(),
      },
      create: {
        ...mappedValues,
        category: { connect: { id: categoryId } },
        coach: { connect: { id: coachId } },
        image: values.image ? { connect: { id: values.image.id } } : {},
        focusAreas: mappedFocusAreas.length
          ? { connect: mappedFocusAreas }
          : undefined
      },

      update: {
        ...mappedValues,
        image:
          values.image?.id !== defaultValue?.image?.id
            ? { connect: { id: values?.image?.id } }
            : undefined,
        focusAreas: mappedFocusAreas?.length
          ? { set: mappedFocusAreas }
          : undefined,
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
              ? "Update coaching package."
              : "Create new coaching package"}
          </DialogTitle>

          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <FormWrapper<TCoachingPackageFormInput>
          onSubmit={form.handleSubmit(onSubmit)}
          {...form}
        >
          <FormInput
            label="Title"
            name={`title`}
            type="text"
            placeholder="Script-writing skills course"
          />

          <FormCoachingPackagesCategorySelect
            label="Category"
            name="categoryId"
            mode="single"
          />

          <FormTextArea
            label="Description"
            name="description"
            placeholder="Describe your role and responsibilities"
          />

          <FormInput label="Price" name={`price`} type="number" min={1} />

          <FormInput
            label="Time (minutes)"
            name={`time`}
            type="number"
            min={1}
          />

          <FormInput
            label="Number of sessions"
            name={`numberOfSessions`}
            type="number"
            min={1}
          />

          <FormFocusAreaSelect name="focusAreas" mode="multiple" label="Focus Areas" />

          <FormImagePicker
            showPreview={true}
            userId={userId}
            defaultMedia={defaultValue?.image}
            label="Preview"
            name="image"
          />

          <FormVideoPicker
            userId={userId}
            label="Explainer Video"
            name="explainerVideo"
          />

          <FormFooter form={form} />
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default CoachingPackageForm;
