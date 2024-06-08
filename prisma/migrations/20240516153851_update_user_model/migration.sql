/*
  Warnings:

  - You are about to drop the column `profilePictureId` on the `Coach` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coach" DROP CONSTRAINT "Coach_profilePictureId_fkey";

-- DropIndex
DROP INDEX "Coach_profilePictureId_key";

-- AlterTable
ALTER TABLE "Coach" DROP COLUMN "profilePictureId";
