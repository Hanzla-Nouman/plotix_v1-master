import { z } from "zod";

export const ListCoachingPackageCategoriesInputValidator = z.object({
  query: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  options: z
    .object({
      take: z.number().optional(),
      cursor: z.string().optional(),
      orderBy: z
        .object({
          name: z.enum(["asc", "desc"]),
        })
        .optional(),
    })
    .optional(),
});

export type TListCoachingPackageCategoriesInput = z.infer<
  typeof ListCoachingPackageCategoriesInputValidator
>;
