"use client";

import { useState, useEffect } from "react";
import {
  ComboboxOption,
  ComboboxExternalProps,
} from "@/components/ui/combobox";
import { trpc } from "@/trpc/client";
import FormSelect from "./select";

interface TFormFocusAreasSelectProps
  extends Omit<ComboboxExternalProps, "options"> {
  name: string;
  label: string;
  className?: string;
}

const FormFocusAreaSelect = (props: TFormFocusAreasSelectProps) => {
  const { name, label, className, ...comboboxProps } = props;
  const { data, isLoading } = trpc.focusArea.list.useQuery({});
  const [focusAreaOptions, setFocusAreaOptions] = useState<ComboboxOption[]>(
    []
  );

  useEffect(() => {
    setFocusAreaOptions(
      data?.map((focusArea) => ({
        value: focusArea.id,
        label: focusArea.name,
      })) || []
    );
  }, [data]);

  return (
    <FormSelect
      name={name}
      label={label}
      isLoading={isLoading}
      className={className}
      options={focusAreaOptions}
      {...comboboxProps}
    />
  );
};

export default FormFocusAreaSelect;
