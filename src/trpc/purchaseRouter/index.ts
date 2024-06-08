import * as purchaseController from "./controller";
import { t } from "@/trpc/server";
import {
  PurchaseUpsertArgsSchema,
  PurchaseFindManyArgsSchema,
  PurchaseUpdateArgsSchema,
  PurchaseFindFirstArgsSchema,
  PurchaseDeleteArgsSchema,
} from "@/TSChema";

const coachingPackageRouter = t.router({
  upsert: t.procedure
    .input(PurchaseUpsertArgsSchema)
    .mutation(purchaseController.upsertPurchase),
  update: t.procedure
    .input(PurchaseUpdateArgsSchema)
    .mutation(purchaseController.updatePurchase),
  list: t.procedure
    .input(PurchaseFindManyArgsSchema)
    .query(purchaseController.listPurchases),
  get: t.procedure
    .input(PurchaseFindFirstArgsSchema)
    .query(purchaseController.getPurchase),
  delete: t.procedure
    .input(PurchaseDeleteArgsSchema)
    .mutation(purchaseController.deletePurchase),
});

export default coachingPackageRouter;
