-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "phone_number" TEXT NOT NULL DEFAULT '+233123456789';

-- CreateTable
CREATE TABLE "Class" (
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("schoolId","classId")
);

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
