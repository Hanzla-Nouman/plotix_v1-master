import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";

const focusAreaOptions = [
  "Character Development",
  "Story Structure",
  "World-building",
  "Script Review",
  "Scripting",
  "Visual Storytelling",
  "Balancing Dialogue and Art",
  "Plot Development",
  "Writing Style and Voice",
  "Conflict Resolution",
  "Building Tension and Suspense",
  "Resrach Methods",
  "Structuring Articles/Essays",
  "Crafting introductions/conclusions",
  "Adapting Stories for Screen",
  "Collaborative Scriptwriting",
  "Manga Page Layout",
  "Charecter Design for Manga",
  "Balancing Action and Dialogue",
  "Investigative Journalism",
  "Writing Compelling Headlines",
  "Interview Techniques",
  "Fact-Checking and Accuracy",
  "Covering Sensitive Topics Responsibly",
  "Loglines",
];

const prisma = new PrismaClient();

async function main() {
  // Seed User with related Media and Coach using cascade creation
  await prisma.focusArea.createMany({
    data: focusAreaOptions.map((name) => ({
      name,
    })),
  });
  const focusAreas = await prisma.focusArea.findMany({
    take: 3,
  });

  const coachingPackageCategory = await prisma.coachingPackageCategory.upsert({
    where: {
      name: "Manga",
    },
    create: {
      name: "Manga",
    },
    update: {},
  });

  const coachCategory = await prisma.coachCategory.create({
    data: {
      name: "Screenwriter",
      order: 1,
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: "coach@example.com",
    },
    include: {
      coach: {
        include: {
          coachingPackages: true,
        },
      },
    },
    update: {},
    create: {
      email: "coach@example.com",
      avatar: {
        create: {
          url: "http://example.com/media/profilepicture.jpg",
          filename: "profilepicture.jpg",
          type: "image",
          mimeType: "image/jpeg",
        },
      },
      hash: await bcryptjs.hash(
        "password",
        process.env.BCRYPT_SALT_ROUNDS || 2
      ),
      role: "coach",
      coach: {
        create: {
          name: "John Doe Coach",
          hourlyRate: 100,
          approvedForSale: "approved",
          headline: "Experienced Manga Coach",
          aboutMe: "I have over 10 years of experience in Manga art.",
          whyICoach: "I love to teach and share my knowledge.",
          language: {
            set: ["English", "Japanese"],
          },
          focusAreas: {
            connect: focusAreas.map((focusArea) => ({ id: focusArea.id })),
          },
          categories: {
            connect: [{ id: coachCategory.id }],
          },
          location: "Tokyo, Japan",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          youtubeUrl: "https://youtube.com/johndoe",
          introVideo: {
            create: {
              url: "http://example.com/media/introvideo.mp4",
              filename: "introvideo.mp4",
              type: "video",
              mimeType: "video/mp4",
            },
          },
          backgroundPicture: {
            create: {
              url: "http://example.com/media/background.jpg",
              filename: "background.jpg",
              mimeType: "image/jpeg",
              type: "image",
            },
          },
        },
      },
    },
  });

  await prisma.coachingPackage.upsert({
    where: {
      id: user?.coach?.coachingPackages?.[0]?.id || uuidv4(),
    },
    update: {},
    create: {
      category: {
        connect: {
          id: coachingPackageCategory.id,
        },
      },
      coach: {
        connect: {
          id: user.coach?.id || "",
        },
      },
      title: "Advanced Manga Techniques",
      order: 1,
      description: "Deep dive into advanced manga drawing techniques.",
      price: 300,
      time: 90,
      numberOfSessions: 10,
      focusAreas: {
        connect: focusAreas.map((focusArea) => ({ id: focusArea.id })),
      },
      image: {
        create: {
          url: "http://example.com/media/packageimage.jpg",
          filename: "packageimage.jpg",
          type: "image",
          mimeType: "image/jpeg",
        },
      },
      explainerVideo: {
        create: {
          url: "http://example.com/media/explainervideo.mp4",
          filename: "explainervideo.mp4",
          type: "video",
          mimeType: "video/mp4",
        },
      },
    },
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
