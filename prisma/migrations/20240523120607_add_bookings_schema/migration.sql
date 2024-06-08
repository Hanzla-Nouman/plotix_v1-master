-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coachingPackageId" TEXT NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "isCanceled" BOOLEAN NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "roomId" TEXT NOT NULL,
    "bookingMetadata" JSONB NOT NULL,
    "bookingUid" TEXT NOT NULL,
    "calcomUsername" TEXT NOT NULL,
    "rescheduleUid" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_coachingPackageId_fkey" FOREIGN KEY ("coachingPackageId") REFERENCES "CoachingPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;
