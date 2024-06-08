"use client";
import React from "react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import {
  FormWrapper,
  FormInput,
  FormFocusAreaSelect,
  FormTextArea,
  FormSelect,
  FormCoachCategoriesSelect,
} from "@/components/FormElements";
import { Session } from "next-auth";
import { z } from "zod";
import { LanguageOptionsSchema } from "@/TSChema";
import { useForm } from "react-hook-form";
import { languageOptions } from "@/constants/Coach";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AvatarPicker } from "@/components/AvatarPicker";
import { Loader2 } from "lucide-react";

interface EditUserFormProps {
  currentUser: Session["user"];
}

const EditUserFormValidator = z.object({
  name: z.string().min(3),
  preferedCoachCategories: z.array(z.string()),
  preferedCurrency: z.string().optional(),
  preferedLanguages: z.array(LanguageOptionsSchema),
  focusAreas: z.array(z.string()),
});

type TEditUserFormValidator = z.infer<typeof EditUserFormValidator>;

export const EditUserForm = ({ currentUser }: EditUserFormProps) => {
  const { data: user } = trpc.user.get.useQuery({
    where: { id: currentUser.id },
    include: {
      avatar: true,
      focusAreas: true,
      preferedCoachCategories: true,
      coach: true,
    },
  });
  const updateUserMutation = trpc.user.update.useMutation();

  const queryClient = trpc.useUtils();
  const form = useForm<TEditUserFormValidator>({
    resolver: zodResolver(EditUserFormValidator),
    defaultValues: {
      name: "",
      preferedLanguages: [],
      preferedCurrency: "USD",
      focusAreas: [],
    },
  });

  React.useEffect(() => {
    form.reset({
      name: user?.name || "",
      preferedCurrency: user?.preferedCurrency || "USD",
      preferedCoachCategories:
        user?.preferedCoachCategories?.map((c) => c.id) || [],
      preferedLanguages: user?.preferedLanguages || [],
      focusAreas: user?.focusAreas?.map((focusArea) => focusArea.id) || [],
    });
  }, [user]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const mappedFocusAreas = values?.focusAreas?.map((focusArea) => ({
        id: focusArea,
      }));
      const mappedCategories = values?.preferedCoachCategories?.map(
        (category) => ({
          id: category,
        })
      );

      await updateUserMutation.mutateAsync({
        id: currentUser.id,
        ...values,
        preferedCoachCategories: mappedCategories?.length
          ? { set: mappedCategories }
          : undefined,
        focusAreas: mappedFocusAreas?.length
          ? { set: mappedFocusAreas }
          : undefined,
      });

      queryClient.user.get.invalidate({
        where: { id: currentUser.id },
      });
      toast.success("User updated");
    } catch (error) {
      toast.error("Failed to update user");
    }
  });

  return (
    <section className="flex gap-4 flex-col lg:flex-row justify-center">
      {user ? (
        <AvatarPicker
          media={user?.avatar}
          name={user?.name || ""}
          userId={currentUser.id}
        />
      ) : (
        <Loader2 className="animate-spin h-8 w-8" />
      )}
      <div className="w-full max-w-[400px]">
        <FormWrapper<TEditUserFormValidator> {...form} onSubmit={onSubmit}>
          <FormInput name="name" required label="Legal Name" />
          <FormSelect
            name="preferedLanguages"
            mode="multiple"
            label="Languages"
            options={languageOptions}
          />
          <FormCoachCategoriesSelect
            name="preferedCoachCategories"
            label="Prefered Coaching Categories"
            mode="multiple"
          />
          {user?.coach?.id && (
            <FormSelect
              name="preferedCurrency"
              mode="single"
              label="Currency"
              options={[
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
                { label: "GBP", value: "GBP" },
              ]}
            />
          )}
          <FormFocusAreaSelect
            name="focusAreas"
            mode="multiple"
            label="Focus Areas"
          />

          <Button
            disabled={!form.formState.isDirty}
            isLoading={updateUserMutation.isLoading}
            type="submit"
          >
            Save
          </Button>
        </FormWrapper>
      </div>
    </section>
  );
};
