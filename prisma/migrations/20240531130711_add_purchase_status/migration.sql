/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `checkoutSessionId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('notStarted', 'pending', 'success', 'failed');

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "isPaid",
ADD COLUMN     "checkoutSessionId" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'notStarted';
