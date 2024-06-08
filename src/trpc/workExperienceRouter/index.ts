import * as workExperienceController from "./controller";
import { t } from "@/trpc/server";
import {
  WorkExperienceDeleteArgsSchema,
  WorkExperienceUpsertArgsSchema,
} from "@/TSChema";

const workExperienceRouter = t.router({
  upsert: t.procedure
    .input(WorkExperienceUpsertArgsSchema)
    .mutation(workExperienceController.upsertWorkExperience),
  delete: t.procedure
    .input(WorkExperienceDeleteArgsSchema)
    .mutation(workExperienceController.deleteWorkExperience),
});

export default workExperienceRouter;
