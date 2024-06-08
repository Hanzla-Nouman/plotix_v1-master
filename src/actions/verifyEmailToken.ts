"use server";
import { prisma } from "@/prisma";

export const verifyEmailToken = async (token: string) => {
  const existingToken = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  if (existingToken.expiresAt < new Date()) {
    return { error: "Token has expired!" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });

  if (!user) {
    return { error: "User does not exist in our system" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      email: existingToken.email,
    },
  });
  await prisma.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: true };
};
