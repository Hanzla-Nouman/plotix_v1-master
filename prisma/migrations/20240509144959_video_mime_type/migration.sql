/*
  Warnings:

  - Added the required column `mimeType` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "mimeType" TEXT NOT NULL;
