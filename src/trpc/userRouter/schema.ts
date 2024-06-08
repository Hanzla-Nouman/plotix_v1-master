import { z } from "zod";
import { AuthCredentialsValidator } from "@/lib/validators/account-credentials-validator";
import { UserUpdateInputSchema, UserFindFirstArgsSchema } from "@/TSChema";

export const CreateUserInput = AuthCredentialsValidator;

export const DeleteUserInput = z.object({
  id: z.string(),
});

export const ListUsersInput = z.object({
  query: z.object({}),
  options: z.object({
    take: z.number().optional(),
    cursor: z.string().optional(),
    orderBy: z.object({}).optional(),
  }),
});

export const UpdateUserPasswordInput = z.object({
  email: z.string(),
  password: z.string(),
  newPassword: z.string(),
});

export const UpdateUserInput = UserUpdateInputSchema;

export type TUpdateUserPasswordInput = z.infer<typeof UpdateUserPasswordInput>;
export type TCreateUserInput = z.infer<typeof CreateUserInput>;
export type TDeleteUserInput = z.infer<typeof DeleteUserInput>;
export type TGetUserInput = z.infer<typeof UserFindFirstArgsSchema>;
export type TListUsersInput = z.infer<typeof ListUsersInput>;
export type TUpdateUserInput = z.infer<typeof UpdateUserInput>;
