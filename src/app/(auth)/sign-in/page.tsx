"use client";
import { useEffect } from "react";
import { Icons } from "@/components/Icons";
import { useFormState } from "react-dom";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSubmitButton } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login, TLoginState } from "@/actions/login";

const Page = () => {
  const searchParams = useSearchParams();
  const isCoach = searchParams.get("as") === "coach";
  const origin = searchParams.get("origin");
  let redirectTo = origin ? `/${origin}` : "/";
  if (isCoach) {
    redirectTo = "/sell";
  }

  const loginWithRedirect = login.bind(null, redirectTo);

  const [state, formAction] = useFormState<TLoginState, FormData>(
    loginWithRedirect,
    null
  );

  const {
    register,
    setError,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.zodErrors) {
      state.zodErrors.forEach((err) => {
        setError(err.path, err);
      });
    } else {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Return statement should be here
  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-full md:w-[400px] lg:w-[450px] xl:w-[500px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo />
            <h1 className="text-2xl font-bold">
              Sign in to your {isCoach ? "coach" : ""} account
            </h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-up"
            >
              Don&apos;t have an account? Sign up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form action={formAction}>
              <div className="grid gap-2">
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

                <FormSubmitButton>Sign in</FormSubmitButton>
              </div>
            </form>
            {/* Seperator */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <span className="w-full border-t" />
              </div>
              {/* <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div> */}
            </div>

            {/* {isCoach ? (
              <Button
                onClick={continueAsUser}
                variant="secondary"
                disabled={isLoading}
              >
                Continue as user
              </Button>
            ) : (
              <Button
                onClick={continueAsCoach}
                variant="secondary"
                disabled={isLoading}
              >
                Continue as a Coach
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
