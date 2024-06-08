"use client";

import { useState, useEffect } from "react";
import {
  ComboboxOption,
  ComboboxExternalProps,
} from "@/components/ui/combobox";
import { trpc } from "@/trpc/client";
import FormSelect from "./select";

interface TFormCoachCategoriesSelectProps
  extends Omit<ComboboxExternalProps, "options"> {
  name: string;
  label: string;
  className?: string;
}

const FormCoachCategoriesSelect = (props: TFormCoachCategoriesSelectProps) => {
  const { name, label, className, ...comboboxProps } = props;
  const { data, isLoading } = trpc.category.getCategoriesList.useQuery({});
  const [CoachCategoriesOptions, setCoachCategoriesOptions] = useState<
    ComboboxOption[]
  >([]);

  useEffect(() => {
    setCoachCategoriesOptions(
      data?.map((category) => ({
        value: category.id,
        label: category.name,
      })) || []
    );
  }, [data]);

  return (
    <FormSelect
      name={name}
      label={label}
      isLoading={isLoading}
      className={className}
      options={CoachCategoriesOptions}
      {...comboboxProps}
    />
  );
};

export default FormCoachCategoriesSelect;
