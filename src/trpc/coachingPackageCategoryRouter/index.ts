import { router, publicProcedure } from "@/trpc/server";
import * as coachingPackageCategoryController from "./controller";
import { ListCoachingPackageCategoriesInputValidator } from "./schema";

const coachingPackageCategoryRouter = router({
  list: publicProcedure
    .input(ListCoachingPackageCategoriesInputValidator)
    .query(coachingPackageCategoryController.listCoachingPackageCategories),
});

export default coachingPackageCategoryRouter;
