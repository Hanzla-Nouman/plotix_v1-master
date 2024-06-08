import { z } from "zod";

export const CategoriesListInputValidator = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  take: z.number().min(1).max(100).default(7).optional(),
});

export type TCategoriesListInput = z.infer<typeof CategoriesListInputValidator>;
