/*
  Warnings:

  - You are about to drop the column `coachId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_coachId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coachId";
