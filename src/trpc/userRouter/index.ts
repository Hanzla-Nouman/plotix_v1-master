import {
  CreateUserInput,
  DeleteUserInput,
  ListUsersInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from "./schema";
import { UserFindFirstArgsSchema } from "@/TSChema";
import * as userController from "./controller";
import { t } from "@/trpc/server";

const userRouter = t.router({
  create: t.procedure
    .input(CreateUserInput)
    .mutation(({ input }) => userController.createUser(input)),
  list: t.procedure
    .input(ListUsersInput)
    .query(({ input }) => userController.listUsers(input)),
  get: t.procedure
    .input(UserFindFirstArgsSchema)
    .query(({ input }) => userController.getUser(input)),
  update: t.procedure
    .input(UpdateUserInput)
    .mutation(({ input }) => userController.updateUser(input)),
  delete: t.procedure
    .input(DeleteUserInput)
    .mutation(({ input }) => userController.deleteUser(input)),
  updatePassword: t.procedure
    .input(UpdateUserPasswordInput)
    .mutation(({ input }) => userController.updateUserPassword(input)),
});

export default userRouter;
