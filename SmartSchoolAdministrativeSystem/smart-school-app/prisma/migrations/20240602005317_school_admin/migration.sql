/*
  Warnings:

  - You are about to drop the column `schoolId` on the `SchoolAdministrator` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[schoolAdministratorId]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolAdministratorId` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SchoolAdministrator" DROP CONSTRAINT "SchoolAdministrator_schoolId_fkey";

-- DropIndex
DROP INDEX "SchoolAdministrator_schoolId_key";

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "schoolAdministratorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SchoolAdministrator" DROP COLUMN "schoolId";

-- CreateIndex
CREATE UNIQUE INDEX "School_schoolAdministratorId_key" ON "School"("schoolAdministratorId");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_schoolAdministratorId_fkey" FOREIGN KEY ("schoolAdministratorId") REFERENCES "SchoolAdministrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
