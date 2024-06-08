import { z } from "zod";

export const AuthCredentialsValidator = z.object({
  userName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 charecters long.",
  }),
});


export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>

export const SignupCredentialsValidator = z.object({
  userName: z.string().nonempty({
    message: "Please enter username"
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type TSignupCredentialsValidator = z.infer<
  typeof SignupCredentialsValidator
>;
