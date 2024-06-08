// use this script to import data from a CSV file into your database
import  {PrismaClient}  from "@prisma/client";
import { parse } from "csv-parse/sync";
import path from "path"; 
import { v4 as uuid } from "uuid";
import fs from "fs";
import uniq from "lodash/uniq";
import { S3, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getUrlFromBucket } from "../src/lib/files";
import bcryptjs from "bcryptjs";

const region = process.env.NEXT_PUBLIC_S3_REGION;
const prisma = new PrismaClient();
const s3 = new S3({
  endpoint: process.env.S3_HOST
    ? `http://${process.env.S3_HOST}:${process.env.S3_PORT}`
    : undefined,
  region,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_KEY as string,
    secretAccessKey: process.env.S3_SECRET as string,
  },
}); // Specify your AWS S3 region

async function uploadFileToS3(url: string, key: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const mimeType = response.headers.get("content-type") || "";
  const uploadParams: PutObjectCommandInput = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET as string,
    Key: key,
    Body: Buffer.from(arrayBuffer),
    ContentType: mimeType as string, //image/jpeg, image/png, etc.
    ACL: "public-read",
  };

  await s3.putObject(uploadParams);
  return { fileUrl: getUrlFromBucket(key), mimeType };
}

const parseComplimentarySession = (complimentarySession: string) => {
  if (complimentarySession === "30 Min Free session") {
    return "ThirtyMinutes";
  }
  if (complimentarySession === "15 Min Free session") {
    return "FifteenMinutes";
  }

  return null;
};

function mapCSVToJSObject(data: any) {
  return data.map((entry: any) => {
    // Dynamically extract session categories, focus areas, and languages
    const focusAreas: string[] = [];
    const languages: string[] = [];

    let portfolioCount = 0;
    let workExperienceCount = 0;
    let faqCount = 0;
    // Dynamic extraction based on known pattern in keys
    Object.keys(entry).forEach((key) => {
      if (key.startsWith("faq[") && key.endsWith("].question")) {
        faqCount++;
      }
      if (key.startsWith("portfolio[") && key.endsWith("].name")) {
        portfolioCount++;
      }
      if (
        key.startsWith("profile.workExperiences[") &&
        key.endsWith("].jobTitle")
      ) {
        workExperienceCount++;
      }
      if (key.startsWith("profile.focusArea[")) {
        if (entry[key].trim()) {
          focusAreas.push(entry[key]);
        }
      }
      if (key.startsWith("profile.language[")) {
        if (entry[key].trim()) {
          languages.push(entry[key]);
        }
      }
    });
    // Returning the structured object
    return {
      firstName: entry.firstName,
      lastName: entry.lastName,
      active: entry.active === "true",
      email: entry.email,
      phone: entry.phone,
      role: entry.role,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      profile: {
        fullName: entry["profile.fullname"],
        introVideo: entry["profile.introVideo"],
        hourlyRate: entry["profile.hourlyRate"],
        userName: entry["profile.userName"],
        shortDescription: entry["profile.shortDescription"],
        aboutMe: entry["profile.aboutMe"],
        mainSpecialization: entry["profile.mainSpecilization"],
        headline: entry["profile.headline"],
        location: entry["profile.location"],
        gender: entry["profile.gender"],
        focusAreas,
        languages,
        socials: {
          linkedinUrl: entry["profile.socials.linkedin"] || null,
          instagramUrl: entry["profile.socials.instagram"] || null,
          facebookUrl: entry["profile.socials.facebook"] || null,
          twitterUrl: entry["profile.socials.x"] || null,
        },
        profilePhoto: entry["profile.profilePhoto"],
        complimentarySession: entry["profile.complimentarySession"],
      },
      portfolio: Array.from({ length: portfolioCount }, (_, i) => ({
        name: entry[`portfolio[${i}].name`],
        description: entry[`portfolio[${i}].description`],
        img: entry[`portfolio[${i}].img`],
        type: entry[`portfolio[${i}].type`],
      })).filter(
        (item) => item.name || item.description || item.img || item.type
      ),
      faqs: Array.from({ length: faqCount }, (_, i) => ({
        question: entry[`faq[${i}].question`],
        answer: entry[`faq[${i}].answer`],
        order: i,
      })).filter((faq) => faq.question && faq.answer),
      workExperiences: Array.from({ length: workExperienceCount }, (_, i) => ({
        jobTitle: entry[`profile.workExperiences[${i}].jobTitle`],
        company: entry[`profile.workExperiences[${i}].company`],
        startDate: entry[`profile.workExperiences[${i}].startDate`],
        endDate: entry[`profile.workExperiences[${i}].endDate`],
        stillWorking: entry[`profile.workExperiences[${i}].stillWorking`],
        description: entry[`profile.workExperiences[${i}].description`],
        img: entry[`profile.workExperiences[${i}].img`],
      })).filter(
        (workExp) =>
          workExp.jobTitle ||
          workExp.company ||
          workExp.startDate ||
          workExp.endDate ||
          workExp.stillWorking ||
          workExp.description ||
          workExp.img
      ),
    };
  });
}
async function main() {
  const csvData = fs.readFileSync(path.resolve(__dirname, "seed.csv"));
  const rawRecords = parse(csvData, {
    columns: true,
    cast: true,
    skip_empty_lines: true,
  });

  const records = mapCSVToJSObject(rawRecords);

  for (const record of records) {
    let avatarPayload;
    let introVideoPayload;

    if (record.profile.profilePhoto) {
      const imageFilename = uuid();
      const { fileUrl, mimeType } = await uploadFileToS3(
        record.profile.profilePhoto,
        `image/${imageFilename}`
      );
      avatarPayload = {
        create: {
          url: fileUrl,
          mimeType,
          filename: imageFilename,
          type: "image" as const,
        },
      };
    }

    if (record.profile.introVideo) {
      const filename = uuid();
      const { fileUrl, mimeType } = await uploadFileToS3(
        record.profile.introVideo,
        `video/${filename}`
      );
      introVideoPayload = {
        create: {
          url: fileUrl,
          mimeType,
          filename,
          type: "video" as const,
        },
      };
    }
    const user = await prisma.user.create({
      include: { coach: true },
      data: {
        avatar: avatarPayload,
        emailVerified: true,
        email: record.email.trim(),
        hash: bcryptjs.hashSync(record.email, 10),
        name: `${record.firstName} ${record.lastName}`.trim(),
        role: record.role.toLowerCase() || "user",
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
        coach:
          record.role.toLowerCase() === "coach"
            ? {
                create: {
                  approvedForSale: record.status || "pending",
                  name: `${record.firstName} ${record.lastName}`.trim(),
                  headline: record.profile.headline || null,
                  aboutMe: record.profile.aboutMe || null,
                  hourlyRate: parseInt(record.profile.hourlyRate || "50"),
                  location: record.profile.location || null,
                  language: {
                    set: uniq(
                      record.profile.languages?.map(
                        (lang: string) => lang.split(" ")[0]
                      ) || ["English"]
                    ),
                  },
                  ...record.profile.socials,
                  freeIntroductionOption: parseComplimentarySession(
                    record.profile.complimentarySession
                  ),
                  coachFAQs: {
                    create:
                      record.faqs?.map((faq: any, index: number) => ({
                        question: faq.question,
                        answer: faq.answer,
                        order: index,
                      })) || [],
                  },
                  introVideo: introVideoPayload,
                  focusAreas: {
                    connectOrCreate: record.profile.focusAreas?.map(
                      (focusArea: string) =>
                        ({
                          where: { name: focusArea },
                          create: { name: focusArea },
                        } || [])
                    ),
                  },
                },
              }
            : undefined,
      },
    });

    if (record.workExperiences?.length && user.coach?.id) {
      const promises = record.workExperiences.map(async (workExp: any) => {
        let workExpImagePayload;
        if (workExp.img) {
          const imageFilename = uuid();
          const { fileUrl, mimeType } = await uploadFileToS3(
            workExp.img,
            `image/${imageFilename}`
          );

          workExpImagePayload = {
            create: {
              url: fileUrl,
              mimeType,
              createdBy: { connect: { id: user.id } },
              filename: imageFilename,
              type: "image" as const, // Make sure to dynamically set this based on the actual file type
            },
          };
        }
        const createdWorkExp = await prisma.workExperience.create({
          data: {
            image: workExpImagePayload,
            jobTitle: workExp.jobTitle,
            companyName: workExp.company,
            startDate: new Date(workExp.startDate),
            endDate: workExp.endDate ? new Date(workExp.endDate) : null,
            description: workExp.description || null,
            isCurrent: workExp.stillWorking === "TRUE",
            coach: { connect: { id: user.coach?.id as string } },
          },
        });
      });

      await Promise.all(promises);
    }

    if (record.profile.portfolio && user.role === "coach") {
      const uploadedPortfolioImages = await Promise.all(
        record.profile.portfolio.map(async (portfolioItem: any) => {
          if (!portfolioItem.img) return null;
          const imageFilename = uuid();
          const { fileUrl, mimeType } = await uploadFileToS3(
            portfolioItem.img,
            `image/${imageFilename}`
          );
          return {
            create: {
              url: fileUrl,
              mimeType,
              filename: imageFilename,
              type: "image",
              createdBy: { connect: { id: user.id } },
            },
          };
        })
      );
      await prisma.portfolioItem.create({
        data: record.profile.portfolio.map(
          async (portfolioItem: any, index: number) => ({
            name: portfolioItem.name,
            order: index + 1,
            coach: { connect: { id: user.coach?.id } },
            img: uploadedPortfolioImages[index] || null,
            description: portfolioItem.description,
          })
        ),
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
