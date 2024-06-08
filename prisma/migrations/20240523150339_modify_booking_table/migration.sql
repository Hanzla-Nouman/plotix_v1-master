/*
  Warnings:

  - You are about to drop the column `bookingMetadata` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `rescheduleUid` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingMetadata",
DROP COLUMN "duration",
DROP COLUMN "rescheduleUid",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "isCompleted" SET DEFAULT false;
