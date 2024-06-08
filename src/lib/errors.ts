import { ZodError } from "zod";

export function extractServerZodErrors<T>(error: any) {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => ({
      path: issue.path.join(".") as T,
      message: issue.message,
    }));
  }
  return null;
}
