"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  SignupCredentialsValidator,
  TSignupCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signup, TSignupState } from "@/actions/signup";
import { useFormState } from "react-dom";

const Page = () => {
  const {
    formState: { errors },
    register,
    setError,
  } = useForm<TSignupCredentialsValidator>({
    resolver: zodResolver(SignupCredentialsValidator),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [state, formAction] = useFormState<TSignupState, FormData>(
    signup,
    null
  );

  useEffect(() => {
    if (!state) {
      return;
    }
 console.log("state is here======",state)
    if (state.zodErrors) {
      state.zodErrors.forEach((err) => {
        setError(err.path, err);
      });
      return;
    } else {
      console.log("state in error",state)
      toast.error(`Error occured while registering. \n ${state.error}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-full md:w-[400px] lg:w-[450px] xl:w-[500px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo />
            <h1 className="text-2xl font-bold">Create an account</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-in"
            >
              Already have an account? Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form action={formAction}>
              <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Username</Label>
                  <Input
                    {...register("userName")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="example"
                  />
                  {/* Error sign in message email*/}
                  {errors.userName && (
                    <p className="text-sm text-red-500">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                  {/* Error sign in message email*/}
                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    type="password"
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder="Password"
                  />
                  {errors?.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    className={cn({
                      "focus-visible:ring-red-500": errors.confirmPassword,
                    })}
                    placeholder="Confirm Password"
                  />
                  {errors?.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit">Sign up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
