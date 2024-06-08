"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

interface FormInputProps extends InputProps {
  name: string;
  label: string;
  className?: string;
}

const FormTextarea = (props: FormInputProps) => {
  const { name, label, className, ...rest } = props;
  const form = useFormContext();

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={`grid gap-2 ${className}`}>
          <FormLabel htmlFor={`form-input-${name}`}>{label}</FormLabel>
          <Input
            id={`form-input-${name}`}
            {...rest}
            {...field}
            onChange={
              rest.type === "number"
                ? // cast to number if type is number
                  (event) => field.onChange(parseInt(event.target.value))
                : field.onChange
            }
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormTextarea;
