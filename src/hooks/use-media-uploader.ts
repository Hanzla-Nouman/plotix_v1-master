import { trpc, RouterOutput } from "@/trpc/client";
import { useState } from "react";
import { MediaTypeType, MediaWithRelations } from "@/TSChema";
import { toast } from "sonner";

interface TUseMediaUploaderParams {
  userId: string;
  mediaType: MediaTypeType;
}

const useMediaUploader = (params: TUseMediaUploaderParams) => {
  const { mediaType, userId } = params;
  const [isLoading, setIsLoading] = useState(false);

  const showError = (error?: string) => {
    toast.error(`Failed to upload file: ${error}`);
    setIsLoading(false);
  };

  const { mutate } = trpc.media.create.useMutation({
    onError: (err: any) => {
      showError(err?.message);
    },
  });

  const sendFileToS3 = async (
    data: RouterOutput["media"]["create"],
    file: File,
    successCallback: (media: MediaWithRelations) => void
  ) => {
    if (data.error || !data.uploadUrl) {
      showError(data.error);
      return;
    }

    const formData = new FormData();
    Object.entries(data.uploadFields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("file", file);
    const uploadResponse = await fetch(data.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.ok) {
      successCallback(data.media as MediaWithRelations);
      setIsLoading(false);
      toast.success("File has been uploaded!");
    } else {
      showError(data.error);
    }
  };

  const uploadMedia = (
    file: File,
    successCallback: (media: MediaWithRelations) => void
  ) => {
    setIsLoading(true);
    mutate(
      {
        filename: file.name,
        type: mediaType,
        contentType: file.type,
        userId,
      },
      {
        onSuccess: (data) => sendFileToS3(data, file, successCallback),
      }
    );
  };

  return { uploadMedia, isLoading };
};

export default useMediaUploader;
