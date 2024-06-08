"use server";
import { prisma } from "@/prisma";
import { TListFocusAreasInput } from "./schema";

export const listFocusAreas = async ({
  input,
}: {
  input: TListFocusAreasInput;
}) => {
  try {
    const { cursor, ...options } = input?.options || {};
    const focusAreas = await prisma.focusArea.findMany({
      where: input.query,
      ...options,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    });

    return focusAreas;
  } catch (error) {
    console.error(error);
    return null;
  }
};
