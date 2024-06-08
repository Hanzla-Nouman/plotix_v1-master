"use server";

import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { extractServerZodErrors } from "@/lib/errors";

interface ZodServerError {
  path: keyof TAuthCredentialsValidator;
  message: string;
}

export type TLoginState = {
  error?: string;
  zodErrors?: ZodServerError[];
} | null | void;

/*
 * Used as a server action to log in, gets called from login form as a form action.
 **/
export const login = async (
  redirectTo: string,
  _state: TLoginState,
  data: FormData
): Promise<TLoginState> => {
  try {
    const { email, password } = AuthCredentialsValidator.parse({
      email: data.get("email"),
      password: data.get("password"),
    });
    await signIn("credentials", { email, password, redirectTo: redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid email or password" };
        }
        default: {
          return { error: "Something went wrong" };
        }
      }
    }
    const zodErrors = extractServerZodErrors<ZodServerError["path"]>(error);
    if (zodErrors) {
      return { zodErrors };
    }

    if (isRedirectError(error)) {
      throw error;
    }
    return null;
  }
};
