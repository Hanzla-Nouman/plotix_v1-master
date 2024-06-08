import { prisma } from "@/prisma";
import {
  TPurchaseFindManyArgsSchema,
  TPurchaseUpsertArgsSchema,
  TPurchaseFindFirstArgsSchema,
  TPurchaseUpdateArgsSchema,
  TPurchaseDeleteArgsSchema,
} from "./schema";
import { PurchaseWithRelations } from "@/TSChema";

export const upsertPurchase = async ({
  input,
}: {
  input: TPurchaseUpsertArgsSchema;
}) => {
  const purchase = await prisma.purchase.upsert(input);

  return purchase;
};
export const updatePurchase = async ({
  input,
}: {
  input: TPurchaseUpdateArgsSchema;
}) => {
  const purchase = await prisma.purchase.update(input);

  return purchase;
};

export const listPurchases = async ({
  input,
}: {
  input: TPurchaseFindManyArgsSchema;
}) => {
  const purchases = await prisma.purchase.findMany(input);

  return purchases as PurchaseWithRelations[];
};

export const getPurchase = async ({
  input,
}: {
  input: TPurchaseFindFirstArgsSchema;
}) => {
  const purchase = await prisma.purchase.findFirst(input);

  return purchase as PurchaseWithRelations;
};

export const deletePurchase = async ({
  input,
}: {
  input: TPurchaseDeleteArgsSchema;
}) => {
  const purchase = await prisma.purchase.delete(input);

  return purchase;
};
