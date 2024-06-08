import { router, publicProcedure } from "@/trpc/server";
import * as focusAreaController from "./controller";
import { ListFocusAreasInputValidator } from "./schema";

const focusAreaRouter = router({
  list: publicProcedure
    .input(ListFocusAreasInputValidator)
    .query(focusAreaController.listFocusAreas),
});

export default focusAreaRouter;
