/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Grade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_schoolId_fkey";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "schoolId",
ADD COLUMN     "teacherId" TEXT NOT NULL DEFAULT '4f083b21-582e-40bf-b873-00bc6212b39d';

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
