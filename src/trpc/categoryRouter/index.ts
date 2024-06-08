import { router, publicProcedure } from "@/trpc/server";
import { CategoriesListInputValidator } from "./schema";
import { getCatories } from "./controller";

const categoryRouter = router({
  getCategoriesList: publicProcedure
  .input(CategoriesListInputValidator)
  .query(getCatories)
})

export default categoryRouter;
