"use server";

import {
  SignupCredentialsValidator,
  TSignupCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { isRedirectError } from "next/dist/client/components/redirect";
import { createUser } from "@/trpc/userRouter/controller";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { TRPCError } from "@trpc/server";
import { extractServerZodErrors } from "@/lib/errors";
import { redirect } from "next/navigation";

interface ZodServerError {
  path: keyof TSignupCredentialsValidator;
  message: string;
}
export type TSignupState = {
  error?: string;
  zodErrors?: ZodServerError[];
} | null | void;

export const signup = async (
  _prevState: TSignupState,
  data: FormData
): Promise<TSignupState> => {
  try {
    const { email, password, userName } = SignupCredentialsValidator.parse({
      userName: data.get("userName"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    });
    const result = await createUser({ email, password, userName });
    const verificationToken = await generateVerificationToken(email);

    if (!result || !verificationToken) {
      return { error: "Failed to create user or generate verification token" };
    }

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    redirect(`/verify-email?to=${email}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const zodErrors = extractServerZodErrors<ZodServerError["path"]>(error);
    if (zodErrors) {
      return { zodErrors };
    } 

    if (error instanceof TRPCError) {
      switch (error.code) {
        case "CONFLICT":
        default: {
          return {
            zodErrors: [
              {
                path: "email",
                message: "User with this email already exists",
              },
            ],
          };
        }
      }
    }
    console.error(error);
    return { error: "Failed to create user" };
  }
};
