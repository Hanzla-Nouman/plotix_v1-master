"use client";

import { Form } from "@/components/ui/form";
import { FormProviderProps, FieldValues } from "react-hook-form";

interface TFormWrapperProps<T extends FieldValues>
  extends FormProviderProps<T> {
  onSubmit: (data: any) => void;
  className?: string;
}

const FormWrapper = <T extends {}>(props: TFormWrapperProps<T>) => {
  const { onSubmit, className = "", children, ...formProps } = props;

  return (
    <Form {...formProps}>
      <form onSubmit={formProps.handleSubmit(onSubmit)} noValidate>
        <div className={`grid gap-4 ${className}`}>{children}</div>
      </form>
    </Form>
  );
};

export default FormWrapper;
