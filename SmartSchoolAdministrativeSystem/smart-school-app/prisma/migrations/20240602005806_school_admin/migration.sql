/*
  Warnings:

  - You are about to drop the column `schoolAdministratorId` on the `School` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[schoolId]` on the table `SchoolAdministrator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `SchoolAdministrator` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_schoolAdministratorId_fkey";

-- DropIndex
DROP INDEX "School_schoolAdministratorId_key";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "schoolAdministratorId";

-- AlterTable
ALTER TABLE "SchoolAdministrator" ADD COLUMN     "schoolId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAdministrator_schoolId_key" ON "SchoolAdministrator"("schoolId");

-- AddForeignKey
ALTER TABLE "SchoolAdministrator" ADD CONSTRAINT "SchoolAdministrator_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
