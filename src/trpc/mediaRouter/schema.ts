import { z } from "zod";
import { MediaUpdateInputSchema } from "@/TSChema";

export const CreateMediaInput = z.object({
  filename: z.string(),
  type: z.enum(["image", "video", "file"]),
  userId: z.string(),
  contentType: z.string(),
});

export type TMediaUpdateInput = z.infer<typeof MediaUpdateInputSchema>;

export type TCreateMediaInput = z.infer<typeof CreateMediaInput>;
