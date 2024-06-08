"use client";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { useState } from "react";
import { Media } from "@/TSChema";
import useMediaUploader from "@/hooks/use-media-uploader";
import DeleteButton from "@/components/DeleteButton";

interface FormImagePickerProps extends InputProps {
  name: string;
  label?: string;
  showPreview?: boolean;
  id?: string;
  showError?: boolean;
  className?: string;
  defaultMedia?: Media | null;
  userId: string;
  PickerTriggerCmp?: React.FC<{
    media?: Media | null;
    isLoading?: boolean;
    inputId: string;
  }>;
}

const FormImagePicker = ({
  name,
  label,
  id,
  showPreview = false,
  showError = true,
  defaultMedia,
  userId,
  PickerTriggerCmp,
}: FormImagePickerProps) => {
  const [preview, setPreview] = useState<Media | undefined | null>(
    defaultMedia
  );
  const form = useFormContext();
  const { uploadMedia, isLoading } = useMediaUploader({
    userId,
    mediaType: "image",
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <>
              {PickerTriggerCmp && (
                <PickerTriggerCmp
                  inputId={id as string}
                  isLoading={isLoading}
                  media={preview}
                />
              )}
              <Input
                id={id}
                type="file"
                className={PickerTriggerCmp ? "hidden" : "cursor-pointer"}
                {...rest}
                disabled={isLoading}
                accept="image/png, image/jpeg, image/webp"
                onChange={(event) => {
                  const file = event?.target?.files?.[0];
                  if (!file) {
                    return;
                  }
                  uploadMedia(file, (media) => {
                    setPreview(media);
                    onChange(media);
                  });
                }}
              />
              {showPreview && !!preview?.url && (
                <div className="flex gap-2">
                  <Image
                    width={200}
                    height={200}
                    unoptimized
                    src={preview?.url}
                    alt="preview of the selected image"
                  />
                  <DeleteButton
                    onClick={() => {
                      setPreview(null);
                      onChange(null);
                    }}
                  />
                </div>
              )}
              {showError && <FormMessage />}
            </>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormImagePicker;
