-- AlterTable
ALTER TABLE "Grade" ALTER COLUMN "teacherId" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SavedStudentData" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "GENDER" NOT NULL,
    "address_type" "ADDRESS_TYPE" NOT NULL,
    "family_size" "FAMILY_SIZE" NOT NULL,
    "parent_status" "PARENT_STATUS" NOT NULL,
    "mother_education" "EDUCATION" NOT NULL,
    "father_education" "EDUCATION" NOT NULL,
    "mother_job" "JOB" NOT NULL,
    "father_job" "JOB" NOT NULL,
    "family_relationship" INTEGER NOT NULL,
    "guardian" "GUARDIAN" NOT NULL,
    "schoolId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "travel_time" "TRAVEL_TIME" NOT NULL,
    "school_choice_reason" "SCHOOL_CHOICE_REASON" NOT NULL,
    "study_time" "WEEKLY_STUDY_TIME" NOT NULL,
    "school_support" BOOLEAN NOT NULL,
    "family_support" BOOLEAN NOT NULL,
    "extra_paid_classes" BOOLEAN NOT NULL,
    "activities" BOOLEAN NOT NULL,
    "nursery_school" BOOLEAN NOT NULL,
    "higher_ed" BOOLEAN NOT NULL,
    "internet_access" BOOLEAN NOT NULL,
    "romantic_relationship" BOOLEAN NOT NULL,
    "free_time" INTEGER NOT NULL DEFAULT 0,
    "social" INTEGER NOT NULL DEFAULT 0,
    "time_registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "absences" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "class_failures" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedStudentData_pkey" PRIMARY KEY ("id")
);
