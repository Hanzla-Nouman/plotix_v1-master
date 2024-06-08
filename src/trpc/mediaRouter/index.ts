import { publicProcedure, router } from "../server";
import { CreateMediaInput } from "./schema";
import { MediaUpdateInputSchema } from "@/TSChema";
import * as mediaController from "./controller";

const mediaRouter = router({
  create: publicProcedure
    .input(CreateMediaInput)
    .mutation(mediaController.createMedia),
  update: publicProcedure
    .input(MediaUpdateInputSchema)
    .mutation(mediaController.updateMedia),
});

export default mediaRouter;
