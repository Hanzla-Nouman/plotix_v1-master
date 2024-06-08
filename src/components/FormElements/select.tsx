"use client";
import { Combobox, ComboboxExternalProps } from "@/components/ui/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

interface TFormSelectProps extends ComboboxExternalProps {
  name: string;
  label: string;
  className?: string;
}

const FormSelect = (props: TFormSelectProps) => {
  const { name, label, className, isLoading, ...comboboxProps } = props;
  const form = useFormContext();

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={`grid gap-2 ${className}`}>
          <FormLabel htmlFor={`form-input-${name}`}>{label}</FormLabel>
          <Combobox
            onChange={field.onChange}
            value={field.value}
            isLoading={isLoading || form.formState.isSubmitting}
            {...comboboxProps}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
