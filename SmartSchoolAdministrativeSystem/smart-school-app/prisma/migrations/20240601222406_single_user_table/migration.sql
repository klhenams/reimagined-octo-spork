/*
  Warnings:

  - You are about to drop the column `email` on the `SchoolAdministrator` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `SchoolAdministrator` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SchoolAdministrator" DROP COLUMN "email",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;
