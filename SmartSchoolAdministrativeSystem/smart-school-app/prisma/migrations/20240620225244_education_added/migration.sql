/*
  Warnings:

  - Changed the type of `mother_education` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `father_education` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "mother_education",
ADD COLUMN     "mother_education" "EDUCATION" NOT NULL,
DROP COLUMN "father_education",
ADD COLUMN     "father_education" "EDUCATION" NOT NULL;
