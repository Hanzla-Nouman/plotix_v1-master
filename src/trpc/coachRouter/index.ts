import { router, publicProcedure } from "@/trpc/server";
import * as coachController from "./controller";
import {
  GetInfiniteCoachesInputValidator,
  UpdateCoachFAQsInputValidator,
  CoachListInputValidator,
} from "./schema";
import { CoachFindUniqueArgsSchema, CoachUpdateArgsSchema } from "@/TSChema";

const coachRouter = router({
  getInfiniteCoaches: publicProcedure
    .input(GetInfiniteCoachesInputValidator)
    .query(coachController.getInfiniteCoaches),
  update: publicProcedure
    .input(CoachUpdateArgsSchema)
    .mutation(coachController.updateCoach),
  updateFAQs: publicProcedure
    .input(UpdateCoachFAQsInputValidator)
    .mutation(coachController.updateCoachFAQs),
  get: publicProcedure
    .input(CoachFindUniqueArgsSchema)
    .query(coachController.getCoach),
  getCoachList: publicProcedure
    .input(CoachListInputValidator)
    .query(coachController.getCoachList),
});

export default coachRouter;
