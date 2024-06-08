import { prisma } from "@/prisma";
import {
  TPortfolioItemUpsertArgsSchema,
  TPortfolioItemDeleteArgsSchema,
} from "./schema";

export const upsertPortfolioItem = async ({
  input,
}: {
  input: TPortfolioItemUpsertArgsSchema;
}) => {
  const portfolioItem = await prisma.portfolioItem.upsert(input);

  return portfolioItem;
};

export const deletePortfolioItem = async ({
  input,
}: {
  input: TPortfolioItemDeleteArgsSchema;
}) => {
  await prisma.portfolioItem.delete(input);

  return true;
};
