/*
  Warnings:

  - Added the required column `password` to the `SchoolAdministrator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SchoolAdministrator" ADD COLUMN     "password" TEXT NOT NULL;
