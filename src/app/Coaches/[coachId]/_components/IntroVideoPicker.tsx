"use client";

import {
  FormImagePicker,
  FormVideoPicker,
  FormWrapper,
} from "@/components/FormElements";
import Image from "next/image";
import { CoachWithRelations, Media, MediaSchema } from "@/TSChema";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlayCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditButton from "@/components/EditButton";
import { DialogTitle } from "@radix-ui/react-dialog";

const IntroVideoPickerInputSchema = z.object({
  thumbnail: MediaSchema.nullish(),
  video: MediaSchema.nullish(),
});

interface TIntroVideoPickerInputSchema {
  video?: Media | null;
  thumbnail?: Media | null;
}

interface TVideoWithPreviewProps extends PropsWithChildren {
  video?: Media | null;
  thumbnail?: Media | null;
}

interface TIntroVideoPickerProps {
  coach: CoachWithRelations;
}

export const VideoWithPreview = (
  props: PropsWithChildren<TVideoWithPreviewProps>
) => {
  const { video, children, thumbnail } = props;
  const [open, setOpen] = useState(false);

  const renderPreview = () => {
    if (!thumbnail || !video) {
      return (
        <p className="w-full h-full bg-gray-400 flex items-center text-center p-2 text-white font-bold">
          Make a nice impression, add your introduction video!
        </p>
      );
    }
    return (
      <Image
        src={thumbnail?.url}
        width={240}
        height={240}
        alt="video preview"
        className="w-auto h-full aspect-square object-cover object-top"
      />
    );
  };
  return (
    <div className="relative">
      {renderPreview()}
      {!!video && !!thumbnail && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="absolute hover:opacity-80 m-auto top-1/2 -translate-y-1/2 left-0 right-0"
            >
              <PlayCircle width={40} height={40} />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="p-0 rounded-none border-none"
            closeButtonClass="rounded-full bg-white/50"
          >
            <video width="100%" height="320px" autoPlay controls>
              <source src={video.url} type={video.mimeType} />
            </video>
          </DialogContent>
        </Dialog>
      )}
      {children}
    </div>
  );
};

export const IntroVideoPicker = (props: TIntroVideoPickerProps) => {
  const { coach } = props;
  const { introVideo: video, id: coachId, userId } = coach;
  const thumbnail = video?.thumbnail;

  const [open, setOpen] = useState(false);
  const queryClient = trpc.useUtils();
  const form = useForm<TIntroVideoPickerInputSchema>({
    defaultValues: {
      video: video,
      thumbnail: thumbnail,
    },
    resolver: zodResolver(IntroVideoPickerInputSchema),
  });

  const coachUpdateMutation = trpc.coach.update.useMutation({
    onError: (err: any) => {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    },
    onSuccess: () => {
      queryClient.coach.get.invalidate();
      toast.success("Your profile has been updated successfully!");
    },
  });

  const mediaUpdateMutation = trpc.media.update.useMutation({});

  const onSubmit = async (values: TIntroVideoPickerInputSchema) => {
    if (values.thumbnail && values.video) {
      await mediaUpdateMutation.mutateAsync({
        id: values.video.id,
        thumbnail: { connect: { id: values.thumbnail?.id } },
      });
    }
    await coachUpdateMutation.mutateAsync({
      where: {
        id: coachId,
      },
      data: {
        introVideo: values.video
          ? { connect: { id: values.video?.id } }
          : { disconnect: true },
      },
    });
    setOpen(false);
  };

  return (
    <VideoWithPreview video={video} thumbnail={thumbnail}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="absolute top-0 w-full h-full flex flex-col gap-4 items-center justify-center bg-black opacity-0 group-hover/item:opacity-80 transition-opacity duration-150">
            <p className="font-bold text-md text-white">Change intro video</p>
            <EditButton
              className="hover:bg-primary"
              color="white"
            />
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {video ? "Add" : "Edit"} your introduction video
            </DialogTitle>
          </DialogHeader>
          <FormWrapper<TIntroVideoPickerInputSchema>
            {...form}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormVideoPicker
              defaultMedia={video}
              showPreview={true}
              name={"video"}
              label="Video"
              userId={userId}
            />
            <FormImagePicker
              defaultMedia={thumbnail}
              showPreview={true}
              label="Video Preview"
              name={"thumbnail"}
              userId={userId}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </FormWrapper>
        </DialogContent>
      </Dialog>
    </VideoWithPreview>
  );
};
