-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "schoolId" TEXT NOT NULL DEFAULT '62441fca-a299-4f09-97af-fdca8ab43ca0';

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
