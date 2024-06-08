"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput, FormWrapper } from "@/components/FormElements";
import { Session } from "next-auth";

interface ChangePasswordFormProps {
  currentUser: Session["user"];
}

const ChangePasswordFormValidator = z
  .object({
    password: z.string().min(1, {
      message: "Password is required",
    }),
    newPassword: z.string().min(1, {
      message: "New password is required",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

type TChangePasswordFormValidator = z.infer<typeof ChangePasswordFormValidator>;

export const ChangePasswordForm = ({
  currentUser,
}: ChangePasswordFormProps) => {
  const form = useForm<TChangePasswordFormValidator>({
    resolver: zodResolver(ChangePasswordFormValidator),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = trpc.user.updatePassword.useMutation({
    onSuccess: () => {
      form.reset();
      toast.success("Password successfully changed.");
    },
    onError: () => {
      toast.error("Unexpected Error. Try again, or contact support.");
    },
  });

  const onSubmit = async (values: TChangePasswordFormValidator) => {
    const { password, newPassword } = values;

    changePasswordMutation.mutate({
      email: currentUser.email,
      password: password,
      newPassword: newPassword,
    });
  };

  return (
    <FormWrapper<TChangePasswordFormValidator> {...form} onSubmit={onSubmit}>
      <FormInput
        label="Current Password"
        type="password"
        name="password"
        required
      />
      <FormInput
        label="New Password"
        type="password"
        name="newPassword"
        required
      />
      <FormInput
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        required
      />

      <Button type="submit" isLoading={form.formState.isSubmitting}>
        Update
      </Button>
    </FormWrapper>
  );
};
