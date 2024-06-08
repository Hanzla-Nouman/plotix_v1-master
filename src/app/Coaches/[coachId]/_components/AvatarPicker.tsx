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

const AvatarPickerInputSchema = z.object({
  avatar: MediaSchema.nullish(),
});

interface TAvatarPickerInputSchema {
  avatar?: Media | null;
}

interface TUserAvatarProps {
  media?: Media | null;
  name: string;
}

interface TAvatarPickerTriggerProps {
  inputId: string;
  isLoading?: boolean;
}

interface TAvatarPickerProps extends TUserAvatarProps {
  userId: string;
}

export const UserAvatar = (props: PropsWithChildren<TUserAvatarProps>) => {
  const { media, name, children } = props;

  return (
    <Avatar className="h-20 w-20 relative">
      <AvatarImage src={media?.url} alt="avatar" className="object-cover" />
      <AvatarFallback>{name}</AvatarFallback>
      {children}
    </Avatar>
  );
};

const AvatarPickerTrigger = (props: TAvatarPickerTriggerProps) => {
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

export const AvatarPicker = (props: TAvatarPickerProps) => {
  const { media, userId, name } = props;
  const queryClient = trpc.useUtils();
  const form = useForm<TAvatarPickerInputSchema>({
    defaultValues: {
      avatar: media,
    },
    resolver: zodResolver(AvatarPickerInputSchema),
  });

  const userUpdateMutation = trpc.user.update.useMutation({
    onError: (err: any) => {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    },
    onSuccess: (data) => {
      queryClient.coach.get.invalidate();
      toast.success("Your profile has been updated successfully!");
    },
  });

  const onSubmit = (values: TAvatarPickerInputSchema) => {
    userUpdateMutation.mutate({
      avatar: values.avatar
        ? { connect: { id: values.avatar?.id } }
        : { disconnect: true },
      id: userId,
    });
  };

  const currentValue = form.watch("avatar");

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  return (
    <FormWrapper<TAvatarPickerInputSchema>
      {...form}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormImagePicker
        name={"avatar"}
        id={"avatarInput"}
        userId={userId}
        showError={false}
        PickerTriggerCmp={(
          triggerProps: Omit<TUserAvatarProps, "name"> &
            TAvatarPickerTriggerProps
        ) => (
          <UserAvatar media={currentValue} name={name}>
            <AvatarPickerTrigger
              {...triggerProps}
              isLoading={userUpdateMutation.isLoading || triggerProps.isLoading}
            />
          </UserAvatar>
        )}
      />
    </FormWrapper>
  );
};
