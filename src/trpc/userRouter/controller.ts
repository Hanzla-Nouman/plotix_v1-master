"use server";
import { prisma } from "@/prisma";
import {
  TCreateUserInput,
  TDeleteUserInput,
  TGetUserInput,
  TListUsersInput,
  TUpdateUserInput,
  TUpdateUserPasswordInput,
} from "./schema";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { UserWithRelations } from "@/TSChema";

export const createUser = async (input: TCreateUserInput) => {
  try {
    const { userName, email, password } = input;
    // check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) throw new TRPCError({ code: "CONFLICT" });

    const hash = await bcrypt.hash(
      password,
      process.env.BCRYPT_SALT_ROUNDS || 10
    );
    return await prisma.user.create({
      data: {
        name: userName,
        email,
        hash,
        role: "user",
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const listUsers = async (input: TListUsersInput) => {
  try {
    const { cursor, ...options } = input?.options;
    const users = await prisma.user.findMany({
      where: input.query,
      ...options,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    });

    return users;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getUser = async (input: TGetUserInput) => {
  try {
    const user = await prisma.user.findFirst(input);
    return user as UserWithRelations;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const updateUser = async (input: TUpdateUserInput) => {
  let updatedUser;
  try {
    const { id, ...data } = input;
    updatedUser = await prisma.user.update({
      where: { id: id as string },
      data,
    });
  } catch (error) {
    console.error(error);
    return error;
  }
  return updatedUser;
};
export const deleteUser = async (input: TDeleteUserInput) => {
  try {
    await prisma.user.delete({ where: { id: input.id } });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const updateUserPassword = async (input: TUpdateUserPasswordInput) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    const isValidPassword = await bcrypt.compare(input.password, user.hash);

    if (!isValidPassword) throw new TRPCError({ code: "UNAUTHORIZED" });

    const hash = await bcrypt.hash(
      input.newPassword,
      process.env.BCRYPT_SALT_ROUNDS || 10
    );

    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hash,
      },
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};
