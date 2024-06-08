import bcrypt from "bcryptjs";
import { CredentialsConfig } from "next-auth/providers/credentials";
import { prisma } from "@/prisma";
import { TAuthCredentialsValidator } from "@/lib/validators/account-credentials-validator";

export const runtime = "nodejs";

/*
 * Used only in auth.config to authorize using user credentials
 **/
export const authorizeViaCredentials: CredentialsConfig["authorize"] = async (
  credentials
) => {
  try {
    const { email, password } = credentials as TAuthCredentialsValidator;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
        coach: true,
      },
    });

    const passwordMatch = await bcrypt.compare(password, user?.hash || "");
    if (!user?.hash || !passwordMatch) {
      throw new Error("Invalid Email or Password");
    }
    if (!user.emailVerified) {
      throw new Error("Email not verified");
    }

    return user;
  } catch (err) {
    return null;
  }
};
