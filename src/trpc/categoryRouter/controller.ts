import { prisma } from "@/prisma";
import { TCategoriesListInput } from "./schema";
import { CoachCategory } from "@/TSChema";

export const getCatories = async ({ input }: { input: TCategoriesListInput }) => {
  const { take = 7, sort = 'asc' } = input;

  const categories = await prisma.coachCategory.findMany({
    orderBy: {
      order: sort,
    },
    take
  });

  return categories as CoachCategory[];
}
