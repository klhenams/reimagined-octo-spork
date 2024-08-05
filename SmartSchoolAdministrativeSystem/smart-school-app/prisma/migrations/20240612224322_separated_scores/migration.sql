/*
  Warnings:

  - You are about to drop the column `math_intensive` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[index_number]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `math_intensive` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "math_intensive",
ALTER COLUMN "imagePath" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "math_intensive" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_index_number_key" ON "Student"("index_number");
