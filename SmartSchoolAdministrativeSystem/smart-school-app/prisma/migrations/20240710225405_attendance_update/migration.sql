/*
  Warnings:

  - A unique constraint covering the columns `[meeting,studentId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Attendance_studentId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_meeting_studentId_date_key" ON "Attendance"("meeting", "studentId", "date");
