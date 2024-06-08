import * as portfolioItemController from "./controller";
import { t } from "@/trpc/server";
import {
  PortfolioItemDeleteArgsSchema,
  PortfolioItemUpsertArgsSchema,
} from "@/TSChema";

const portfolioItemRouter = t.router({
  upsert: t.procedure
    .input(PortfolioItemUpsertArgsSchema)
    .mutation(portfolioItemController.upsertPortfolioItem),
  delete: t.procedure
    .input(PortfolioItemDeleteArgsSchema)
    .mutation(portfolioItemController.deletePortfolioItem),
});

export default portfolioItemRouter;
