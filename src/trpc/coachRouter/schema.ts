import { z } from "zod";
import { CoachFindUniqueArgsSchema, CoachUpdateArgsSchema } from "@/TSChema";

const GetInfiniteCoachesQueryValidator = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

export const GetInfiniteCoachesInputValidator = z.object({
  take: z.number().min(1).max(100).default(15).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  cursor: z.string().nullish(),
  query: GetInfiniteCoachesQueryValidator.optional(),
});

export type TGetInfiniteCoachesInputValidator = z.infer<
  typeof GetInfiniteCoachesInputValidator
>;

export type TCoachUpdateArgsSchema = z.infer<typeof CoachUpdateArgsSchema>;

export const UpdateCoachFAQsInputValidator = z.object({
  coachId: z.string(),
  coachFAQs: z.array(
    z.object({
      id: z.string().optional(),
      question: z.string(),
      answer: z.string(),
      order: z.number(),
    })
  ),
});

export type TUpdateCoachFAQsInputValidator = z.infer<
  typeof UpdateCoachFAQsInputValidator
>;

export type TCoachFindUniqueArgsSchema = z.infer<
  typeof CoachFindUniqueArgsSchema
>;

export const CoachListInputValidator = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
    })
  ),
  take: z.number().min(1).max(100).default(15).optional(),
});

export type TCoachListInputValidator = z.infer<typeof CoachListInputValidator>;
