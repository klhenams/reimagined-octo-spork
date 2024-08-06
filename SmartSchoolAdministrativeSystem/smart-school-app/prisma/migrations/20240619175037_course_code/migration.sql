/*
  Warnings:

  - You are about to drop the column `courseId` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `code` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "courseId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "_CourseToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToSubject_AB_unique" ON "_CourseToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToSubject_B_index" ON "_CourseToSubject"("B");

-- AddForeignKey
ALTER TABLE "_CourseToSubject" ADD CONSTRAINT "_CourseToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToSubject" ADD CONSTRAINT "_CourseToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
