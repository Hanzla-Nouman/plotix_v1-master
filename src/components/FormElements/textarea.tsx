"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea, TextareaProps } from "@/components/ui/textarea";

interface TFormTextAreaProps extends TextareaProps {
  name: string;
  label: string;
  className?: string;
}

const FormTextArea = (props: TFormTextAreaProps) => {
  const { name, label, id, className, ...rest } = props;
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`grid gap-2 ${className}`}>
          <FormLabel htmlFor={`form-textarea-${name}`}>{label}</FormLabel>
          <Textarea id={`form-textarea-${name}`} {...rest} {...field} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextArea;
