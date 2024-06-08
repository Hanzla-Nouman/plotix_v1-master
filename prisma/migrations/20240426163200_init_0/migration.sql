-- CreateEnum
CREATE TYPE "LanguageOptions" AS ENUM ('English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Italian', 'Portuguese', 'Dutch', 'Swedish', 'Turkish', 'Hindi', 'Bengali', 'Urdu', 'Persian', 'Swahili', 'Vietnamese', 'Indonesian', 'Malay', 'Thai', 'Greek', 'Hebrew', 'Czech', 'Polish', 'Romanian', 'Hungarian', 'Finnish', 'Danish', 'Norwegian', 'Icelandic', 'Slovak', 'Slovenian', 'Croatian', 'Bulgarian', 'Serbian', 'Macedonian', 'Albanian', 'Latvian', 'Lithuanian', 'Estonian', 'Georgian', 'Armenian', 'Azerbaijani', 'Kazakh', 'Uzbek', 'Yoruba');

-- CreateEnum
CREATE TYPE "PinnedOptions" AS ENUM ('Achievement', 'Publication', 'Contribution', 'Milestone', 'MediaFeature');

-- CreateEnum
CREATE TYPE "FreeSessionDurationOptions" AS ENUM ('FifteenMinutes', 'ThirtyMinutes');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'denied');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user', 'coach');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'file');

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "coachId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "resetPasswordToken" VARCHAR,
    "avatarId" TEXT,
    "resetPasswordExpiration" VARCHAR,
    "hash" TEXT NOT NULL,
    "loginAttempts" INTEGER,
    "lockUntil" DATE,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "CoachCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headline" TEXT,
    "aboutMe" TEXT,
    "whyICoach" TEXT,
    "hourlyRate" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "language" "LanguageOptions"[],
    "freeIntroductionOption" "FreeSessionDurationOptions",
    "approvedForSale" "ApprovalStatus",
    "priceId" TEXT,
    "stripeId" TEXT,
    "introVideoId" TEXT,
    "profilePictureId" TEXT,
    "backgroundPictureId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "linkedinUrl" TEXT,
    "youtubeUrl" TEXT,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "twitchUrl" TEXT,
    "tiktokUrl" TEXT,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingPackage" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "imageId" TEXT NOT NULL,
    "explainerVideoId" TEXT,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "numberOfSessions" INTEGER NOT NULL,

    CONSTRAINT "CoachingPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FocusArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingPackageCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CoachingPackageCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "coachId" TEXT NOT NULL,
    "imgId" TEXT,
    "description" TEXT,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "coachId" TEXT NOT NULL,
    "imageId" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachFAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "coachId" TEXT NOT NULL,

    CONSTRAINT "CoachFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoachToCoachCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CoachToFocusArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CoachingPackageToFocusArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_coachId_key" ON "User"("coachId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "CoachCategory_name_key" ON "CoachCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_userId_key" ON "Coach"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_introVideoId_key" ON "Coach"("introVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_profilePictureId_key" ON "Coach"("profilePictureId");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_backgroundPictureId_key" ON "Coach"("backgroundPictureId");

-- CreateIndex
CREATE UNIQUE INDEX "CoachingPackage_coachId_title_categoryId_key" ON "CoachingPackage"("coachId", "title", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "FocusArea_name_key" ON "FocusArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CoachingPackageCategory_name_key" ON "CoachingPackageCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_key" ON "VerificationToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_CoachToCoachCategory_AB_unique" ON "_CoachToCoachCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachToCoachCategory_B_index" ON "_CoachToCoachCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CoachToFocusArea_AB_unique" ON "_CoachToFocusArea"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachToFocusArea_B_index" ON "_CoachToFocusArea"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CoachingPackageToFocusArea_AB_unique" ON "_CoachingPackageToFocusArea"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachingPackageToFocusArea_B_index" ON "_CoachingPackageToFocusArea"("B");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_introVideoId_fkey" FOREIGN KEY ("introVideoId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_backgroundPictureId_fkey" FOREIGN KEY ("backgroundPictureId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingPackage" ADD CONSTRAINT "CoachingPackage_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingPackage" ADD CONSTRAINT "CoachingPackage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CoachingPackageCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingPackage" ADD CONSTRAINT "CoachingPackage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingPackage" ADD CONSTRAINT "CoachingPackage_explainerVideoId_fkey" FOREIGN KEY ("explainerVideoId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_imgId_fkey" FOREIGN KEY ("imgId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachFAQ" ADD CONSTRAINT "CoachFAQ_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachToCoachCategory" ADD CONSTRAINT "_CoachToCoachCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachToCoachCategory" ADD CONSTRAINT "_CoachToCoachCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "CoachCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachToFocusArea" ADD CONSTRAINT "_CoachToFocusArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachToFocusArea" ADD CONSTRAINT "_CoachToFocusArea_B_fkey" FOREIGN KEY ("B") REFERENCES "FocusArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachingPackageToFocusArea" ADD CONSTRAINT "_CoachingPackageToFocusArea_A_fkey" FOREIGN KEY ("A") REFERENCES "CoachingPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachingPackageToFocusArea" ADD CONSTRAINT "_CoachingPackageToFocusArea_B_fkey" FOREIGN KEY ("B") REFERENCES "FocusArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
