"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormLabel } from "@/components/ui/form";
import { FormImagePicker, FormWrapper } from "@/components/FormElements";
import { Media, MediaSchema } from "@/TSChema";
import { PropsWithChildren, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { cn } from "@/lib/utils";

const BannerPickerInputSchema = z.object({
  banner: MediaSchema.nullish(),
});

interface TBannerPickerInputSchema {
  banner?: Media | null;
}

interface TUserBanerProps {
  media?: Media | null;
  name: string;
}

interface TBannerPickerTriggerProps {
  inputId: string;
  isLoading?: boolean;
}

interface TBannerPickerProps extends TUserBanerProps {
  userId: string;
}

export const UserBanner = (props: PropsWithChildren<TUserBanerProps>) => {
  const { media, name, children } = props;

  return (
    <Avatar className="h-44 w-full rounded-md relative">
      <AvatarImage src={media?.url} alt="banner" className="object-cover" />
      <AvatarFallback className="rounded-md">{name}</AvatarFallback>
      {children}
    </Avatar>
  );
};

const BannerPickerTrigger = (props: TBannerPickerTriggerProps) => {
  const { inputId, isLoading } = props;

  return (
    <FormLabel
      htmlFor={inputId}
      className={cn(
        "cursor-pointer flex w-full justify-center items-center h-full absolute inset-x-0 z-10 transition-opacity duration-300 inset-y-0 opacity-0 hover:opacity-80 bg-black",
        {
          "opacity-80": isLoading,
        }
      )}
    >
      {isLoading ? (
        <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
      ) : (
        <PlusIcon className="text-zinc-300" width={40} height={40} />
      )}
    </FormLabel>
  );
};

export const BannerPicker = (props: TBannerPickerProps) => {
  const { media, userId, name } = props;
  const queryClient = trpc.useUtils();
  const form = useForm<TBannerPickerInputSchema>({
    defaultValues: {
      banner: media,
    },
    resolver: zodResolver(BannerPickerInputSchema),
  });

  const coachUpdateMutation = trpc.coach.update.useMutation({
    onError: (err: any) => {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    },

    onSuccess: (data) => {
      queryClient.coach.get.invalidate();
      toast.success("Your profile has been updated successfully!");
    },
  });

  const onSubmit = (values: TBannerPickerInputSchema) => {
    coachUpdateMutation.mutate({
      where: { id: userId },
      data: {
        backgroundPicture: values.banner
          ? { connect: { id: values.banner.id } }
          : { disconnect: true },
      },
    });
  };

  const currentValue = form.watch("banner");

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  return (
    <FormWrapper<TBannerPickerInputSchema>
      {...form}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormImagePicker
        name="banner"
        id="bannerInput"
        userId={userId}
        showError={false}
        PickerTriggerCmp={(
          triggerProps: Omit<TUserBanerProps, "name"> &
            TBannerPickerTriggerProps
        ) => (
          <UserBanner media={currentValue} name={name}>
            <BannerPickerTrigger
              {...triggerProps}
              isLoading={coachUpdateMutation.isLoading || triggerProps.isLoading}
            />
          </UserBanner>
        )}
      />
    </FormWrapper>
  );
};

