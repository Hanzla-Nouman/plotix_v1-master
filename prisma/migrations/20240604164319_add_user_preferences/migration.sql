-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferedCurrency" TEXT DEFAULT 'USD',
ADD COLUMN     "preferedLanguages" "LanguageOptions"[],
ADD COLUMN     "timezone" TEXT;

-- CreateTable
CREATE TABLE "_CoachCategoryToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FocusAreaToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CoachCategoryToUser_AB_unique" ON "_CoachCategoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachCategoryToUser_B_index" ON "_CoachCategoryToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FocusAreaToUser_AB_unique" ON "_FocusAreaToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FocusAreaToUser_B_index" ON "_FocusAreaToUser"("B");

-- AddForeignKey
ALTER TABLE "_CoachCategoryToUser" ADD CONSTRAINT "_CoachCategoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "CoachCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachCategoryToUser" ADD CONSTRAINT "_CoachCategoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FocusAreaToUser" ADD CONSTRAINT "_FocusAreaToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FocusArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FocusAreaToUser" ADD CONSTRAINT "_FocusAreaToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
