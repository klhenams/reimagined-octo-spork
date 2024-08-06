/*
  Warnings:

  - Added the required column `imagePath` to the `SchoolAdministrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SchoolAdministrator" ADD COLUMN     "imagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "imagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "imagePath" TEXT NOT NULL;
