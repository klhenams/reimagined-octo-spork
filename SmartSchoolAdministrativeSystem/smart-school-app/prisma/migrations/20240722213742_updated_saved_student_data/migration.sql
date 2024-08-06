/*
  Warnings:

  - Added the required column `math_intensive` to the `SavedStudentData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `SavedStudentData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedStudentData" ADD COLUMN     "math_intensive" BOOLEAN NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL;
