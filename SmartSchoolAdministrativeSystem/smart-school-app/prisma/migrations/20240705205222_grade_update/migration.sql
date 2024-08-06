/*
  Warnings:

  - The `semester` column on the `Grade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `passed` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "passed" BOOLEAN NOT NULL,
DROP COLUMN "semester",
ADD COLUMN     "semester" INTEGER;

-- DropEnum
DROP TYPE "SEMESTER";
