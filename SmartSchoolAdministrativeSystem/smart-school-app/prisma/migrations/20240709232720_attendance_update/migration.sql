/*
  Warnings:

  - You are about to drop the column `semester` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "semester",
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
