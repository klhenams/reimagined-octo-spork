/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,meeting,studentId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Attendance_meeting_studentId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_teacherId_meeting_studentId_date_key" ON "Attendance"("teacherId", "meeting", "studentId", "date");
