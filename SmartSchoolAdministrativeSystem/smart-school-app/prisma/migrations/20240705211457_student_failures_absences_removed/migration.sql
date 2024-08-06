/*
  Warnings:

  - You are about to drop the column `absences` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `class_failures` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "absences",
DROP COLUMN "class_failures",
ALTER COLUMN "social" SET DEFAULT 0;
