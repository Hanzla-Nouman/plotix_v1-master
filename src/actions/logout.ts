"use server";

import { signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export const logout = async () => {
  try {
    await signOut({ redirectTo: "/sign-in" });
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }
    return { error: "Something went wrong" };
  }
};
