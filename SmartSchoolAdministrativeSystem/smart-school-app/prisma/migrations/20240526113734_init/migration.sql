-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('admin', 'schoolAdmin', 'teacher', 'student');

-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "PARENT_STATUS" AS ENUM ('together', 'apart');

-- CreateEnum
CREATE TYPE "ADDRESS_TYPE" AS ENUM ('rural', 'urban');

-- CreateEnum
CREATE TYPE "FAMILY_SIZE" AS ENUM ('less_than_or_equal_to_3', 'greater_than_3');

-- CreateEnum
CREATE TYPE "EDUCATION" AS ENUM ('none', 'elementary', 'middle', 'secondary', 'higher_education');

-- CreateEnum
CREATE TYPE "JOB" AS ENUM ('unemployed', 'civil', 'health', 'education', 'other');

-- CreateEnum
CREATE TYPE "SCHOOL_CHOICE_REASON" AS ENUM ('home', 'reputation', 'course', 'other');

-- CreateEnum
CREATE TYPE "GUARDIAN" AS ENUM ('mother', 'father', 'other');

-- CreateEnum
CREATE TYPE "TRAVEL_TIME" AS ENUM ('less_than_15', 'within_15_and_30', 'within_30_and_hour', 'greater_than_hour');

-- CreateEnum
CREATE TYPE "WEEKLY_STUDY_TIME" AS ENUM ('less_than_2_hours', 'within_2_and_5_hours', 'within_5_and_10_hours', 'greater_than_10_hours');

-- CreateEnum
CREATE TYPE "SEMESTER" AS ENUM ('first', 'second');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "USER_ROLE" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "index_number" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "other_names" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "schoolId" TEXT NOT NULL,
    "gender" "GENDER" NOT NULL,
    "year" INTEGER NOT NULL,
    "family_size" "FAMILY_SIZE" NOT NULL,
    "parent_status" "PARENT_STATUS" NOT NULL,
    "mother_education" TEXT NOT NULL,
    "father_education" TEXT NOT NULL,
    "mother_job" "JOB" NOT NULL,
    "father_job" "JOB" NOT NULL,
    "school_choice_reason" "SCHOOL_CHOICE_REASON" NOT NULL,
    "guardian" "GUARDIAN" NOT NULL,
    "travel_time" "TRAVEL_TIME" NOT NULL,
    "study_time" "WEEKLY_STUDY_TIME" NOT NULL,
    "class_failures" INTEGER NOT NULL,
    "school_support" BOOLEAN NOT NULL,
    "family_support" BOOLEAN NOT NULL,
    "address_type" "ADDRESS_TYPE" NOT NULL,
    "extra_paid_classes" BOOLEAN NOT NULL,
    "activities" BOOLEAN NOT NULL,
    "nursery_school" BOOLEAN NOT NULL,
    "higher_ed" BOOLEAN NOT NULL,
    "internet_access" BOOLEAN NOT NULL,
    "romantic_relationship" BOOLEAN NOT NULL,
    "family_relationship" INTEGER NOT NULL,
    "free_time" INTEGER NOT NULL,
    "social" INTEGER NOT NULL,
    "absences" INTEGER NOT NULL,
    "math_intensive" BOOLEAN NOT NULL,
    "time_registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "region" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "subjectId" TEXT NOT NULL,
    "semester" "SEMESTER" NOT NULL,
    "studentId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "dateEntered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "district" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "other_names" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "GENDER" NOT NULL,
    "region" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "educational_level" TEXT NOT NULL,
    "num_seminars_attended" INTEGER NOT NULL,
    "length_of_service" INTEGER NOT NULL,
    "schoolId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAdministrator" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "other_names" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "SchoolAdministrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "present" BOOLEAN NOT NULL,
    "semester" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAdministrator_schoolId_key" ON "SchoolAdministrator"("schoolId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAdministrator" ADD CONSTRAINT "SchoolAdministrator_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
