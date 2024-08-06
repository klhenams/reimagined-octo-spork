/*
  Warnings:

  - You are about to drop the column `region` on the `Student` table. All the data in the column will be lost.
  - Added the required column `state` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "region",
ADD COLUMN     "state" TEXT NOT NULL;
