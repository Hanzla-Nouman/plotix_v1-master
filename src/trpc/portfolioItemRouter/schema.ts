import {
  PortfolioItemUpsertArgsSchema,
  PortfolioItemDeleteArgsSchema,
} from "@/TSChema";
import { z } from "zod";

export type TPortfolioItemUpsertArgsSchema = z.infer<
  typeof PortfolioItemUpsertArgsSchema
>;

export type TPortfolioItemDeleteArgsSchema = z.infer<
  typeof PortfolioItemDeleteArgsSchema
>;
