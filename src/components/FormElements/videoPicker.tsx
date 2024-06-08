"use client";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { useState, useRef } from "react";
import { MediaWithRelations } from "@/TSChema";
import useMediaUploader from "@/hooks/use-media-uploader";
import DeleteButton from "@/components/DeleteButton";

interface FormVideoPickerProps extends InputProps {
  name: string;
  label?: string;
  showPreview?: boolean;
  showError?: boolean;
  className?: string;
  defaultMedia?: MediaWithRelations | null;
  userId: string;
  PickerTriggerCmp?: React.FC<{
    media?: MediaWithRelations | null;
    isLoading?: boolean;
    inputRef?: HTMLInputElement | null;
  }>;
}

const FormVideoPicker = ({
  name,
  label,
  showPreview = false,
  showError = true,
  defaultMedia,
  userId,
  PickerTriggerCmp,
}: FormVideoPickerProps) => {
  const inputRef = useRef<null | HTMLInputElement>();
  const [preview, setPreview] = useState<MediaWithRelations | undefined | null>(
    defaultMedia
  );
  const form = useFormContext();
  const { uploadMedia, isLoading } = useMediaUploader({
    userId,
    mediaType: "video",
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
                  isLoading={isLoading}
                  media={preview}
                  inputRef={inputRef.current}
                />
              )}
              <Input
                type="file"
                className={PickerTriggerCmp ? "hidden" : "cursor-pointer"}
                {...rest}
                ref={(e) => {
                  rest.ref(e);
                  inputRef.current = e;
                }}
                disabled={isLoading}
                accept="video/*"
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
                  <video controls width={200} height={200}>
                    <source src={preview?.url} type={preview?.mimeType} />
                  </video>
                  <DeleteButton
                    onClick={() => {
                      setPreview(null);
                      onChange(null);
                    }}
                  />
                </div>
              )}
            </>
          </FormControl>
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

export default FormVideoPicker;
