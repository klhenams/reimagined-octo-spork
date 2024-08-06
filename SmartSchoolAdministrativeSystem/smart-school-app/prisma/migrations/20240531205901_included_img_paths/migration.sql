/*
  Warnings:

  - Added the required column `badgeImagePath` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "badgeImagePath" TEXT NOT NULL;
