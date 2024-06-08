"use client";

import { useState, useEffect } from "react";
import {
  ComboboxOption,
  ComboboxExternalProps,
} from "@/components/ui/combobox";
import { trpc } from "@/trpc/client";
import FormSelect from "./select";

interface TFormCoachingPackagesCategoriesSelectProps
  extends Omit<ComboboxExternalProps, "options"> {
  name: string;
  label: string;
  className?: string;
}

const FormCoachingPackagesCategorySelect = (
  props: TFormCoachingPackagesCategoriesSelectProps
) => {
  const { name, label, className, ...comboboxProps } = props;
  const { data, isLoading } = trpc.coachingPackageCategory.list.useQuery({});
  const [coachingPackageCategoryOptions, setCoachingPackageCategoryOptions] =
    useState<ComboboxOption[]>([]);

  useEffect(() => {
    setCoachingPackageCategoryOptions(
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
      options={coachingPackageCategoryOptions}
      {...comboboxProps}
    />
  );
};

export default FormCoachingPackagesCategorySelect;
