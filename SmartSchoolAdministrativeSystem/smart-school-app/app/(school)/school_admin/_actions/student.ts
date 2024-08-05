"use server";
/** next imports */
import { redirect } from "next/navigation";

import * as fs from "fs";
import { auth } from "@/auth";

/** schema imports */
import { csvFileSchema, imageSchema, phoneNumberSchema } from "@/lib/schemas";
import { saveFilePublic } from "@/app/_utils/utils";

/** database imports */
import db from "@/db/db";
import {
  ADDRESS_TYPE,
  Attendance,
  EDUCATION,
  FAMILY_SIZE,
  GENDER,
  GUARDIAN,
  JOB,
  PARENT_STATUS,
  SavedStudentData,
  SCHOOL_CHOICE_REASON,
  TRAVEL_TIME,
  WEEKLY_STUDY_TIME,
} from "@prisma/client";

/** for parsing */
import { parseStream, parseString } from "fast-csv";
import { Student } from "@prisma/client";
import { string, TypeOf, z } from "zod";

/** functions */
import { getSchoolIdByEmail, getSessionId } from "./shared";
import path from "path";
import axios, { AxiosError } from "axios";

/** constants */
import { ML_API_ENDPOINTS } from "@/lib/endpoints";
import { FILE } from "@/lib/constants";

/** models */
import { ServerActionReturnModel } from "@/lib/models";

const requiredMessage = "This field is required";
const validMessage = "Please select valid value";
/** schema for student data */
const studentSchema = z.object({
  // image
  image: imageSchema.refine((file) => FILE.MAX_FILE_SIZE_BYTES, {
    message: FILE.MAX_FILE_SIZE_ERR_MSG,
  }),
  // personal information
  first_name: z.string().min(1, { message: requiredMessage }),
  last_name: z.string().min(1, { message: requiredMessage }),
  other_names: z.string().min(1, { message: requiredMessage }),
  age: z.coerce.number({ message: "Please enter a number" }),
  gender: z.nativeEnum(GENDER),
  dob: z.coerce.date(),
  address_type: z.nativeEnum(ADDRESS_TYPE),
  state: z.string().min(1, { message: requiredMessage }),
  city: z.string().min(1, { message: requiredMessage }),
  //family information
  family_size: z.nativeEnum(FAMILY_SIZE),
  parent_status: z.nativeEnum(PARENT_STATUS),
  mother_job: z.nativeEnum(JOB),
  father_job: z.nativeEnum(JOB),
  mother_education: z.nativeEnum(EDUCATION),
  father_education: z.nativeEnum(EDUCATION),
  guardian: z.nativeEnum(GUARDIAN),
  family_relationship: z.coerce
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),

  // education information
  school_choice_reason: z.nativeEnum(SCHOOL_CHOICE_REASON),
  travel_time: z.nativeEnum(TRAVEL_TIME),
  nursery_school: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  family_support: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  school_support: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  activities: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  extra_paid_classes: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  higher_ed: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  study_time: z.nativeEnum(WEEKLY_STUDY_TIME),
  // other information
  internet_access: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  romantic_relationship: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "yes" ? true : false)),
  social: z.coerce
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),
  free_time: z.coerce
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),

  // admission
  courseId: z.coerce.number().min(1, { message: "Please select a course" }),
  year: z.coerce
    .number()
    .min(1, { message: "At least year 1" })
    .max(6, { message: "At most year 6" }),
  email: z.string().email(),
  phone_number: phoneNumberSchema.optional(),
});

/** function to add a single student */
export async function addStudent(
  prevState: unknown,
  formData: FormData
): Promise<{
  success?: boolean;
  errorMessage?: string;
  fieldErrors?: z.inferFlattenedErrors<typeof studentSchema>["fieldErrors"];
  data?: any;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session", success: false };
  }

  const schoolId = await getSchoolIdByEmail(session.user.email);

  if (!schoolId) return { errorMessage: "School not found", success: false };

  const validationResult = studentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validationResult.success)
    return { fieldErrors: validationResult.error.formErrors.fieldErrors };

  const data = validationResult.data;

  // upload file
  const imagePath = await saveFilePublic(
    "/students/",
    `${data.first_name}_${data.last_name}_${data.image.name}`,
    data.image
  );

  let { image, ...studentData } = data;
  const cleaned = { ...studentData, imagePath, schoolId };

  try {
    await db.student.create({ data: cleaned });
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error.message ? error.message : "Something went wrong",
    };
  }

  return { success: true };
}

/** function to get all students of school */
export async function getAllStudents() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const schoolId = await getSchoolIdByEmail(session.user.email);

  return await db.student.findMany({
    where: { schoolId },
    include: { course: { select: { name: true, code: true } } },
  });
}

async function getRows(file: File) {
  const textData = await file.text();
  return new Promise((resolve, reject) => {
    let result: { [key: string]: any }[] = [];
    parseString(textData, { headers: true })
      .on("data", (row) => result.push(row))
      .on("end", () => resolve(result));
  }).catch((err) => {
    throw err;
  });
}

export async function addStudentsFromFile(
  prevState: unknown,
  formData: FormData
) {
  const validationResult = csvFileSchema.safeParse(
    formData.get("studentsFile")
  );
  if (!validationResult.success) {
    console.log(validationResult.error.formErrors.fieldErrors);
    return validationResult.error?.errors[0].message;
  }

  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return;
  }

  const user = await db.user.findUnique({
    where: { email: session?.user?.email! },
    select: { id: true },
  });

  if (!user) return;
  const admin = await db.schoolAdministrator.findUnique({
    where: { id: user.id },
    select: { schoolId: true },
  });

  const schoolId = admin?.schoolId;
  let students = (await getRows(validationResult.data)) as Student[];
  students = students.map((student) => ({ ...student, schoolId: schoolId! }));

  // adding the students
  await db.student.createMany({ data: students });

  return {};
}

/** function to update student */
const updateStudentSchema = studentSchema.extend({
  image: imageSchema
    .refine((file) => FILE.MAX_FILE_SIZE_BYTES, {
      message: FILE.MAX_FILE_SIZE_ERR_MSG,
    })
    .optional(),
});
export async function updateStudentDetails(
  studentId: string,
  previousImage: string | undefined,
  prevState: unknown,
  formData: FormData
): Promise<{
  success?: boolean;
  fieldErrors?: z.inferFlattenedErrors<
    typeof updateStudentSchema
  >["fieldErrors"];
  errorMessage?: string;
}> {
  const validationResult = updateStudentSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!validationResult.success) {
    return {
      fieldErrors: validationResult.error.formErrors.fieldErrors,
      success: false,
    };
  }

  try {
    let imagePath: string | undefined = previousImage;

    if (validationResult.data.image) {
      const { image } = validationResult.data;
      imagePath = await saveFilePublic(
        "/students/",
        `${validationResult.data.first_name}_${validationResult.data.last_name}_${image.name}`,
        image
      );
    }

    const { image, ...data } = validationResult.data;
    await db.student.update({
      where: { id: studentId },
      data: {
        ...data,
        imagePath: imagePath,
      },
    });
  } catch (error: any) {
    return {
      errorMessage: error.message ? error.message : "Something went wrong",
      success: false,
    };
  }

  return { success: true };
}

export async function getTeacherStudents(): Promise<{
  errorMessage?: string;
  data?: {
    id: string;
    first_name: string;
    last_name: string;
    other_names: string;
    age: number;
    email: string | null;
    phone_number: string | null;
    index_number: number;
    gender: string;
    course: {
      code: string;
      name: string;
      subjects: {
        id: number;
      }[];
    };
    imagePath?: string | null;
  }[];
  success?: boolean;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;

  const schoolId = (
    await db.teacher.findUnique({
      where: { id: teacherId },
      select: { schoolId: true },
    })
  )?.schoolId;

  if (!schoolId)
    return { errorMessage: "You are not affiliated with a school" };

  const subject = await db.teacher.findUnique({
    where: { id: teacherId },
    select: { subjectId: true },
  });

  if (!subject)
    return { errorMessage: "subject does not exist", success: false };

  const students = await db.student.findMany({
    where: { schoolId: schoolId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      other_names: true,
      imagePath: true,
      age: true,
      email: true,
      gender: true,
      phone_number: true,
      index_number: true,
      course: {
        select: {
          code: true,
          name: true,
          subjects: {
            where: { id: subject.subjectId },
            select: { id: true },
          },
        },
      },
    },
  });

  return {
    success: true,
    data: students.filter((student) => student.course.subjects.length > 0),
  };
}

export async function uploadStudentScores(data: {
  scores: { [key: string]: number };
  passMark: number;
  title: string;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return;
  }

  const teacherId = session.user.id;

  const subject = await db.teacher.findUnique({
    where: { id: teacherId },
    select: { subjectId: true },
  });

  if (!subject)
    return { errorMessage: "subject does not exist", success: false };

  const subjectId = subject.subjectId;

  const entries = [];
  for (let key in data.scores) {
    entries.push({
      studentId: key,
      score: data.scores[key],
      passed: data.scores[key] > data.passMark,
      subjectId: subjectId,
      teacherId: teacherId,
      title: data.title,
    });
  }

  const response = await db.grade.createMany({ data: entries });
  return { success: true, data: entries.length };
}

export async function predictGrades(
  studentId: string,
  grades: {
    subjectId: number;
    score: number;
    passed: boolean;
    math_intensive: boolean;
  }[]
) {
  if (!grades || grades.length < 1) return;

  const samples: any = [];
  // getting student data with number of failures
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      _count: {
        select: {
          grades: { where: { passed: false } },
          attendance: { where: { present: false } },
        },
      },
    },
  });

  if (!student) return;

  const { _count, ...studentData } = student;
  grades.forEach((grade) => {
    samples.push({
      ...studentData,
      absences: _count.attendance,
      class_failures: _count.grades,
      math_intensive: grade.math_intensive,
      previous_grade: grade.score,
    });
  });

  try {
    const response = await axios.post(
      `${process.env.ML_API_ROOT}/${ML_API_ENDPOINTS.studentGradePredict}`,
      samples,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const predictions: { [key: string]: number } = {};
    response.data.predictions.forEach((pred: number, index: number) => {
      predictions[grades[index].subjectId] = pred;
    });
    return {
      success: {
        predictions: predictions,
        explanations: response.data.explanations,
      },
    };
  } catch (error: any) {
    if (error.response) {
      return {
        error: `${error.status}:${error.message ?? "unfavorable response"}`,
      };
    } else if (error.request) {
      return { error: error.message ? error.message : "No response received" };
    } else {
      return { error: error.message ?? "Something went wrong" };
    }
  }
}

// function to mark student attendance
export async function markStudentAttendance(
  meeting: number,
  studentId: string,
  present: boolean
) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;

  const attendance = await db.attendance.findUnique({
    where: {
      attendance_item: {
        teacherId: teacherId,
        meeting: meeting,
        studentId: studentId,
        date: new Date(),
      },
    },
  });

  const found = !!attendance;

  if (found) {
    await db.attendance.update({
      where: {
        attendance_item: {
          teacherId: teacherId,
          meeting: meeting,
          studentId: studentId,
          date: new Date(),
        },
      },
      data: {
        present: present,
      },
    });
  } else {
    await db.attendance.create({
      data: {
        teacherId: teacherId,
        meeting: meeting,
        studentId: studentId,
        present: present,
      },
    });
  }
}

export async function getTodaysAttendance() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;

  return await db.attendance.findMany({
    where: {
      teacherId: teacherId,
      date: new Date(),
    },
  });
}

export async function getTodaysAttendenceStudent(
  studentId: string,
  meeting: number
) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;
  const data = await db.attendance.findUnique({
    where: {
      attendance_item: {
        teacherId: teacherId,
        meeting: meeting,
        studentId: studentId,
        date: new Date(),
      },
    },
  });

  return data;
}

export async function getNumberOfMeetings() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;

  const uniqueMeetings = await db.attendance.findMany({
    where: {
      teacherId: teacherId,
      date: new Date(),
    },
    distinct: ["meeting"],
  });

  const meetings = uniqueMeetings.map((meeting) => meeting.meeting);

  return meetings.sort();
}

export async function createMeeting(meeting: number): Promise<{
  success?: boolean;
  errorMessage?: string;
  data?: any;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;

  // getting students
  const studentIds: string[] = [];
  const studentsFetchResult = await getTeacherStudents();

  if (studentsFetchResult.errorMessage)
    return { errorMessage: studentsFetchResult.errorMessage, success: false };

  const students = studentsFetchResult.data ?? [];

  // creating attendance for each student
  const attendance: {
    teacherId: string;
    studentId: string;
    meeting: number;
    date: Date;
    present: boolean;
  }[] = [];
  students.forEach((student) =>
    attendance.push({
      teacherId: teacherId,
      studentId: student.id,
      meeting: meeting,
      date: new Date(),
      present: false,
    })
  );

  await db.attendance.createMany({ data: attendance });

  return { success: true };
}

export async function deleteMeeting(
  meeting: number
): Promise<ServerActionReturnModel> {
  const teacherId = await getSessionId();

  await db.attendance.deleteMany({
    where: {
      teacherId: teacherId,
      meeting: meeting,
      date: new Date(),
    },
  });

  return { success: true };
}

// function to get details of a single student
export async function getStudentDetails(studentId: string) {
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      course: {
        select: {
          name: true,
          code: true,
        },
      },
    },
  });

  return student;
}

/** functions to get abscences */
export async function getTeacherTotalNumberOfAbsences(studentId: string) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;

  const allMeetings = await db.attendance.findMany({
    where: { teacherId: teacherId, studentId: studentId },
  });

  const totalNumberOfMeetings = (allMeetings ?? []).length;
  const abscentMeetings = await db.attendance.findMany({
    where: { studentId: studentId, present: false, teacherId: teacherId },
  });
  const totalAbsences = (abscentMeetings ?? []).length;

  return { totalNumberOfMeetings, totalAbsences };
}

export async function getTeacherTodaysAbscences(studentId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }
  const teacherId = session.user.id;

  const todaysMeetings = await db.attendance.groupBy({
    by: ["teacherId", "date", "meeting"],
    where: { teacherId: teacherId, date: new Date() },
    _count: {
      teacherId: true,
    },
  });

  const totalTodaysMeetings = (todaysMeetings ?? []).length;
  const abscentMeetings = await db.attendance.findMany({
    where: { studentId: studentId, present: false, date: new Date(), teacherId: teacherId },
  });
  const totalTodaysAbsences = (abscentMeetings ?? []).length;

  return { totalTodaysMeetings, totalTodaysAbsences };
}

export async function getTeacherAbsencesSummary(studentId: string) {
  return {
    summary: await getTeacherTotalNumberOfAbsences(studentId),
    today: await getTeacherTodaysAbscences(studentId),
  };
}

/** more general absences */
export async function getTotalNumberOfAbsences(studentId: string) {
  const session = await auth();

  const allMeetings = await db.attendance.findMany({
    where: { studentId: studentId },
  });

  const totalNumberOfMeetings = (allMeetings ?? []).length;
  const abscentMeetings = await db.attendance.findMany({
    where: { studentId: studentId, present: false },
  });
  const totalAbsences = (abscentMeetings ?? []).length;

  return { totalNumberOfMeetings, totalAbsences };
}

export async function getTodaysAbscences(studentId: string) {
  const todaysMeetings = await db.attendance.groupBy({
    by: ["teacherId", "date"],
    where: { date: new Date() },
    _count: {
      teacherId: true,
    },
  });

  const totalTodaysMeetings = (todaysMeetings ?? []).length;
  const abscentMeetings = await db.attendance.findMany({
    where: { studentId: studentId, present: false, date: new Date() },
  });
  const totalTodaysAbsences = (abscentMeetings ?? []).length;

  return { totalTodaysMeetings, totalTodaysAbsences };
}

/** function to get all absences for all classes for the current day */
export async function getAllClassesAbsencesToday(studentId: string){
  const todaysMeetings = await db.attendance.findMany({
    where:{
      studentId: studentId,
      date: new Date()
    }
  });

  const totalTodaysMeetings = (todaysMeetings ?? []).length;
  let totalAbsences = 0;

  for(let meeting of todaysMeetings){
    totalAbsences += Number(!meeting.present);
  }
  const totalTodaysAbsences = totalAbsences;

  return { totalTodaysMeetings, totalTodaysAbsences };
}

/** function to get absences summary for teacher for a student */
export async function getAbsencesSummary(studentId: string) {
  return {
    summary: await getTotalNumberOfAbsences(studentId),
    today: await getTodaysAbscences(studentId),
  };
}

/** function to get absences summary for admin for student */
export async function getAbsencesSummaryAdmin(studentId: string) {
  return {
    summary: await getTotalNumberOfAbsences(studentId),
    today: await getAllClassesAbsencesToday(studentId),
  };
}

/** function to get total number of students in school */
export default async function getTotalStudents(schoolId: string) {
  return (
    await db.student.aggregate({
      where: { schoolId: schoolId },
      _count: {
        id: true,
      },
    })
  )._count.id;
}

/** function to get total number of teachers */
export async function getTotalTeachers(schoolId: string) {
  return (
    await db.teacher.aggregate({
      where: { schoolId: schoolId },
      _count: {
        id: true,
      },
    })
  )._count.id;
}

export async function getTotalPresents(schoolId: string) {
  const presents = await db.attendance.aggregate({
    where: { present: true },
    _count: {
      id: true,
    },
  });

  return presents._count.id;
}

/** function to get dashboard information for school admin */
export async function getDashboardStats() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const adminId = session.user.id;

  const school = await db.schoolAdministrator.findUnique({
    where: { id: adminId },
    select: { schoolId: true },
  });

  if (!school) redirect("/");

  return {
    numStudents: await getTotalStudents(school?.schoolId),
    numTeachers: await getTotalTeachers(school?.schoolId),
    totalStudentPresent: await getTotalPresents(school?.schoolId),
  };
}

/** function to delete student */
export async function deleteStudent(studentId: string) {
  try {
    // save the student data in separate database
    const student = await db.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        age: true,
        gender: true,
        address_type: true,
        family_size: true,
        parent_status: true,
        mother_education: true,
        father_education: true,
        mother_job: true,
        father_job: true,
        family_relationship: true,
        guardian: true,
        schoolId: true,
        year: true,
        travel_time: true,
        school_choice_reason: true,
        study_time: true,
        school_support: true,
        family_support: true,
        extra_paid_classes: true,
        activities: true,
        nursery_school: true,
        higher_ed: true,
        internet_access: true,
        romantic_relationship: true,
        free_time: true,
        social: true,
        time_registered: true,
        state: true,
        city: true,
        grades: {
          select: {
            score: true,
            passed: true,
            subject: {
              select: { math_intensive: true },
            },
          },
        },
        attendance: {
          select: { present: true },
        },
      },
    });

    if (!student) {
      return { errorMessage: "Student not found", success: false };
    }

    // save the students data
    let absences = 0;
    student.attendance.forEach((item) => {
      if (!item.present) absences += 1;
    });

    // getting number of failures
    let class_failures = 0;
    student.grades.forEach((item) => {
      if (!item.passed) class_failures += 1;
    });

    const entries: Omit<SavedStudentData, "id" | "createdAt">[] = [];

    const { grades, attendance, ...studentData } = student;

    student.grades.forEach((grade) => {
      entries.push({
        ...studentData,
        class_failures: 0,
        absences: absences,
        score: grade.score,
        math_intensive: grade.subject.math_intensive,
      });
    });

    await db.savedStudentData.createMany({ data: entries });

    await db.student.delete({
      where: {
        id: studentId,
      },
    });

    return { success: true };
  } catch (error: any) {
    return {
      errorMessage:
        error && error.message ? error.message : "Something went wrong",
      success: false,
    };
  }
}

/** function to get students in danger (with bad predicted averages) */
export async function getStudentPredictionsWitIds() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  const schoolAdminId = session.user.id;

  const schoolId = (
    await db.schoolAdministrator.findUnique({ where: { id: schoolAdminId } })
  )?.schoolId;

  if (!schoolId) redirect("/");

  const samples: any[] = [];
  const students = await db.student.findMany({
    where: { schoolId: schoolId },
    include: {
      _count: {
        select: {
          grades: { where: { passed: false } },
          attendance: { where: { present: false } },
        },
      },
      grades: {
        select: {
          score: true,
          dateEntered: true,
          subjectId: true,
          subject: {
            select: {
              math_intensive: true,
            },
          },
        },
      },
    },
  });

  for (let student of students) {
    const { _count, grades, ...studentData } = student;
    grades.sort((a,b) => a.dateEntered.getTime() - b.dateEntered.getTime())
    const holder:{[key: string]: {math_intensive: boolean, previous_grade: number}} = {}
    for(let grade of grades){
      holder[grade.subjectId] = {
        math_intensive: grade.subject.math_intensive,
        previous_grade: grade.score
      }
    }
    const values = Object.values(holder);

    values.forEach((grade) => {
      samples.push({
        ...studentData,
        absences: _count.attendance,
        class_failures: _count.grades,
        math_intensive: grade.math_intensive,
        previous_grade: grade.previous_grade,
      });
    });
  }

  try {
    const response = await axios.post(
      `${process.env.ML_API_ROOT}/${ML_API_ENDPOINTS.studentGradePredictWithId}`,
      samples,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const items: {
      id: string;
      first_name: string;
      last_name: string;
      other_names: string;
      class: string;
      index_number: number;
      email: string | null;
      imagePath: string | null;
      predictedGrades: number[];
    }[] = [];
    const data = response.data;
    for (let student of students) {
      if (student.id in data) {
        items.push({
          id: student.id,
          index_number: student.index_number,
          first_name: student.first_name,
          last_name: student.last_name,
          other_names: student.other_names,
          class: "SC1",
          email: student.email,
          imagePath: student.imagePath,
          predictedGrades: data[student.id]
        })
      }
    }

    return {data: items, success: true};
  } catch (error: any) {
    if (error.response) {
      return {
        error: `${error.status}:${error.message ?? "unfavorable response"}`,
        success: false
      };
    } else if (error.request) {
      return { error: error.message ? error.message : "No response received", success: false };
    } else {
      return { error: error.message ?? "Something went wrong", success: false };
    }
  }
}
