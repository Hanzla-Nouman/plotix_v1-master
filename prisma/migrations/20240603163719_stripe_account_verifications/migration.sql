/*
  Warnings:

  - A unique constraint covering the columns `[stripeAccountId]` on the table `Coach` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Coach" ADD COLUMN     "stripeDetailsSubmitted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Coach_stripeAccountId_key" ON "Coach"("stripeAccountId");
