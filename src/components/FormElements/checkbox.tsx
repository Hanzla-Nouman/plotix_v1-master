"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckboxProps } from "@radix-ui/react-checkbox";

interface TFormCheckboxProps extends CheckboxProps {
  name: string;
  label: string;
  className?: string;
}

const FormCheckbox = (props: TFormCheckboxProps) => {
  const { name, label, id, className, ...rest } = props;
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem
          className={`flex gap-2 my-2 items-center space-y-0 ${className}`}
        >
          <Checkbox
            checked={value}
            onCheckedChange={onChange}
            id={`form-checkbox-${name}`}
            {...rest}
            {...field}
          />
          <FormLabel
            className="cursor-pointer"
            htmlFor={`form-checkbox-${name}`}
          >
            {label}
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormCheckbox;
