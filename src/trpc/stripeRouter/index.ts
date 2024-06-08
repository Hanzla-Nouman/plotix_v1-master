import * as stripeController from "./controller";
import { t } from "@/trpc/server";
import {
  CreateAccountSessionInput,
  CreateCheckoutInput,
  CreateAccountInput,
} from "./schema";

const stripeRouter = t.router({
  createAccountSession: t.procedure
    .input(CreateAccountSessionInput)
    .mutation(stripeController.createAccountSession),
  createAccount: t.procedure
    .input(CreateAccountInput)
    .mutation(stripeController.createAccount),
  createCheckoutSession: t.procedure
    .input(CreateCheckoutInput)
    .mutation(stripeController.createCheckoutSession),
});

export default stripeRouter;
