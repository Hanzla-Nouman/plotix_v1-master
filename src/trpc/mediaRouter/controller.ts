import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { TCreateMediaInput, TMediaUpdateInput } from "./schema";
import { prisma } from "@/prisma";
import { getUrlFromBucket } from "@/lib/files";

async function getUploadLink(input: TCreateMediaInput) {
  const { filename, contentType, type } = input;

  try {
    if (!process.env.NEXT_PUBLIC_S3_BUCKET) {
      throw new Error("S3 Bucket is not defined");
    }
    const remoteFilename = `${type}/${filename}-${uuidv4()}`;
    const client = new S3Client({
      endpoint: process.env.S3_HOST
        ? `http://${process.env.S3_HOST}:${process.env.S3_PORT}`
        : undefined,
      region: process.env.NEXT_PUBLIC_S3_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_KEY as string,
        secretAccessKey: process.env.S3_SECRET as string,
      },
    });
    const { url: uploadUrl, fields } = await createPresignedPost(client, {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      Key: remoteFilename,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 3600, // Seconds before the presigned post expires.
    });

    return { uploadUrl, remoteFilename, uploadFields: fields };
  } catch (error: any) {
    return { error: error?.message as string };
  }
}

export async function createMedia({ input }: { input: TCreateMediaInput }) {
  try {
    const { filename, type, userId, contentType } = input;
    const { uploadUrl, uploadFields, remoteFilename, error } =
      await getUploadLink(input);

    if (error || !uploadUrl || !remoteFilename) {
      throw new Error(error);
    }

    const media = await prisma.media.create({
      data: {
        url: getUrlFromBucket(remoteFilename),
        type,
        mimeType: contentType,
        filename,
        createdBy: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // pre-create media record in postgres with predicted URL
    // send the upload URL to the client so that they can actually upload the file to s3 directly
    return { media, uploadUrl, uploadFields };
  } catch (error: any) {
    return { error: error?.message as string };
  }
}

export async function updateMedia({ input }: { input: TMediaUpdateInput }) {
  try {
    const { id, ...rest } = input;
    const media = await prisma.media.update({
      where: {
        id: id as string,
      },
      data: rest,
    });

    return { media };
  } catch (error: any) {
    return { error: error?.message as string };
  }
}
