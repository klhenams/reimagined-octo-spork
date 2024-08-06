-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "index_number" SERIAL NOT NULL;

-- Alter auto increment sequence
ALTER SEQUENCE "Student_index_number_seq" RESTART WITH 1000000;
