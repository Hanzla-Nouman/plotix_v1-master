import {
  PurchaseUpsertArgsSchema,
  PurchaseFindManyArgsSchema,
  PurchaseFindFirstArgsSchema,
  PurchaseUpdateArgsSchema,
  PurchaseDeleteArgsSchema,
} from "@/TSChema";
import { z } from "zod";

export type TPurchaseUpsertArgsSchema = z.infer<
  typeof PurchaseUpsertArgsSchema
>;

export type TPurchaseUpdateArgsSchema = z.infer<
  typeof PurchaseUpdateArgsSchema
>;

export type TPurchaseFindManyArgsSchema = z.infer<
  typeof PurchaseFindManyArgsSchema
>;

export type TPurchaseFindFirstArgsSchema = z.infer<
  typeof PurchaseFindFirstArgsSchema
>;

export type TPurchaseDeleteArgsSchema = z.infer<
  typeof PurchaseDeleteArgsSchema
>;
