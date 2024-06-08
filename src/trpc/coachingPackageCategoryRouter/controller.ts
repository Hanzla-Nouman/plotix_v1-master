"use server";
import { prisma } from "@/prisma";
import { TListCoachingPackageCategoriesInput } from "./schema";

export const listCoachingPackageCategories = async ({
  input,
}: {
  input: TListCoachingPackageCategoriesInput;
}) => {
  try {
    const { cursor, ...options } = input?.options || {};
    const coachingPackageCategories =
      await prisma.coachingPackageCategory.findMany({
        where: input.query,
        ...options,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
      });

    return coachingPackageCategories;
  } catch (error) {
    console.error(error);
    return null;
  }
};
