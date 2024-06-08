import {
  CoachingPackageUpsertArgsSchema,
  CoachingPackageDeleteArgsSchema,
} from "@/TSChema";
import { z } from "zod";

export type TCoachingPackageUpsertArgsSchema = z.infer<
  typeof CoachingPackageUpsertArgsSchema
>;

export type TCoachingPackageDeleteArgsSchema = z.infer<
  typeof CoachingPackageDeleteArgsSchema
>;
