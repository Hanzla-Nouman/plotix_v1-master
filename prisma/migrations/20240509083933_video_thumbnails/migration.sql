/*
  Warnings:

  - A unique constraint covering the columns `[thumbnailId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "thumbnailId" TEXT;

-- CreateTable
CREATE TABLE "_Subsriber" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Subsriber_AB_unique" ON "_Subsriber"("A", "B");

-- CreateIndex
CREATE INDEX "_Subsriber_B_index" ON "_Subsriber"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Media_thumbnailId_key" ON "Media"("thumbnailId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Subsriber" ADD CONSTRAINT "_Subsriber_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Subsriber" ADD CONSTRAINT "_Subsriber_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
