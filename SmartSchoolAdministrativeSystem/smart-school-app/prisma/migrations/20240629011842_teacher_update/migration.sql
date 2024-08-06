/*
  Warnings:

  - You are about to drop the column `district` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `age` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `educational_level` on the `Teacher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "district",
DROP COLUMN "region",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
DROP COLUMN "educational_level",
ADD COLUMN     "educational_level" "EDUCATION" NOT NULL;
