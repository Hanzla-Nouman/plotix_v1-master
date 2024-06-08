import { prisma } from "@/prisma";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  const existingToken = await prisma.verificationToken.findUnique({
    where: {
      email,
    },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({ where: { id: existingToken.id } });
  }

  return await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt: expires,
    },
  });
};

function randomString(length: number): string {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const generateRoomToken = () => {
  return `${randomString(3)}-${randomString(3)}-${randomString(3)}`;
};
