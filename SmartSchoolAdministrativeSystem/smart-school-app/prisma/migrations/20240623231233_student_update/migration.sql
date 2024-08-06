/*
  Warnings:

  - You are about to drop the column `index_number` on the `Student` table. All the data in the column will be lost.
  - Added the required column `email` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_index_number_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "index_number",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id_num" SERIAL NOT NULL,
ALTER COLUMN "class_failures" SET DEFAULT 0,
ALTER COLUMN "free_time" SET DEFAULT 0,
ALTER COLUMN "absences" SET DEFAULT 0;
