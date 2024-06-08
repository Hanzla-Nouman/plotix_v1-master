import * as coachingPackageController from "./controller";
import { t } from "@/trpc/server";
import {
  CoachingPackageDeleteArgsSchema,
  CoachingPackageUpsertArgsSchema,
} from "@/TSChema";

const coachingPackageRouter = t.router({
  upsert: t.procedure
    .input(CoachingPackageUpsertArgsSchema)
    .mutation(coachingPackageController.upsertCoachingPackage),
  delete: t.procedure
    .input(CoachingPackageDeleteArgsSchema)
    .mutation(coachingPackageController.deleteCoachingPackage),
});

export default coachingPackageRouter;
