import { prisma } from "@/prisma";
import {
  TWorkExperienceUpsertArgsSchema,
  TWorkExperienceDeleteArgsSchema,
} from "./schema";

export const upsertWorkExperience = async ({
  input,
}: {
  input: TWorkExperienceUpsertArgsSchema;
}) => {
  const workExperience = await prisma.workExperience.upsert(input);

  return workExperience;
};

export const deleteWorkExperience = async ({
  input,
}: {
  input: TWorkExperienceDeleteArgsSchema;
}) => {
  await prisma.workExperience.delete(input);

  return true;
};
