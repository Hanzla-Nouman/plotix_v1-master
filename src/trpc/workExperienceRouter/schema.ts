import {
  WorkExperienceUpsertArgsSchema,
  WorkExperienceDeleteArgsSchema,
} from "@/TSChema";
import { z } from "zod";

export type TWorkExperienceUpsertArgsSchema = z.infer<
  typeof WorkExperienceUpsertArgsSchema
>;

export type TWorkExperienceDeleteArgsSchema = z.infer<
  typeof WorkExperienceDeleteArgsSchema
>;
