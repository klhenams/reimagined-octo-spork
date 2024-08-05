"use server";

import { z } from "zod";

import { EDUCATION, GENDER, Student, Teacher, USER_ROLE } from "@prisma/client";
import { auth } from "@/auth";
import { getSchoolIdByEmail, predictStudentScores } from "./shared";
import { deleteFile, hashPassword, saveFilePublic } from "@/app/_utils/utils";
import { imageSchema, phoneNumberSchema } from "@/lib/schemas";
import db from "@/db/db";
import { FILE, SECURITY } from "@/lib/constants";
import { redirect } from "next/navigation";

const requiredMessage = "Required";
const createTeacherSchema = z.object({
  image: imageSchema.refine((file) => file.size < 2 * 1024 * 1024, {
    message: "Image file should be at most 2MB",
  }),
  first_name: z.string().min(1, { message: requiredMessage }),
  last_name: z.string().min(1, { message: requiredMessage }),
  other_names: z.string().min(1, { message: requiredMessage }),
  age: z.coerce.number({ message: "Please enter a number" }),
  gender: z.nativeEnum(GENDER),
  dob: z.coerce.date(),
  country: z.string().min(1, { message: requiredMessage }),
  state: z.string().min(1, { message: requiredMessage }),
  city: z.string().min(1, { message: requiredMessage }),
  educational_level: z.nativeEnum(EDUCATION),
  length_of_service: z.coerce
    .number()
    .min(0, { message: "Please enter valid value" }),
  num_seminars_attended: z.coerce
    .number()
    .min(0, { message: "Please enter valid value" }),
  subjectId: z.coerce.number().min(1, { message: "Please select a subject" }),
  email: z.string().email(),
  password: z
    .string()
    .refine((password) => SECURITY.PASSWORD_REGEX.test(password), {
      message: SECURITY.PASSWORD_ERROR_MSG,
    }),
  phone_number: phoneNumberSchema.optional(),
});

/** function to add a teacher */
export async function addTeacher(
  prevState: unknown,
  formData: FormData
): Promise<{
  success?: boolean;
  errorMessage?: string;
  fieldErrors?: z.inferFlattenedErrors<
    typeof createTeacherSchema
  >["fieldErrors"];
  data?: any;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session" };
  }

  const validationResult = createTeacherSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validationResult.success)
    return {
      fieldErrors: validationResult.error.formErrors.fieldErrors,
      success: false,
    };

  const data = validationResult.data;

  const exists = !!(await db.user.findUnique({ where: { email: data.email } }));
  if (exists) return { errorMessage: "user already exists" };

  try {
    // create the user
    const user = await db.user.create({
      data: {
        email: data.email,
        password: hashPassword(data.password),
        role: USER_ROLE.teacher,
      },
    });

    // get school id
    const schoolId = await getSchoolIdByEmail(session.user.email);
    if (!schoolId) return { errorMessage: "School not found" };

    // upload file
    const imagePath = await saveFilePublic(
      "/teachers/",
      `${data.first_name}_${data.last_name}_${data.image.name}`,
      data.image
    );

    let { image, email, password, ...teacherData } = data;
    const cleaned = { ...teacherData, imagePath, schoolId, id: user.id };

    await db.teacher.create({ data: cleaned });
  } catch (err: any) {
    return {
      errorMessage: err.message ?? "Something went wrong",
      success: false,
    };
  }

  return { success: true };
}

/** function to update teacher data */
const updateTeacherSchema = createTeacherSchema.extend({
  image: imageSchema
    .refine((file) => FILE.MAX_FILE_SIZE_BYTES, {
      message: FILE.MAX_FILE_SIZE_ERR_MSG,
    })
    .optional(),
  password: z.undefined(),
});
export async function updateTeacher(
  teacherId: string,
  previousImage: string | undefined,
  prevState: unknown,
  formData: FormData
): Promise<{
  success?: boolean;
  fieldErrors?: z.inferFlattenedErrors<
    typeof updateTeacherSchema
  >["fieldErrors"];
  errorMessage?: string;
}> {
  const validationResult = updateTeacherSchema.safeParse(
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

      if (previousImage) await deleteFile(previousImage);
    }

    const { image, ...data } = validationResult.data;
    delete data.password;

    await db.student.update({
      where: { id: teacherId },
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

export async function getTeachers(): Promise<{
  errorMessage?: string;
  data?: ({ subject: { name: string; code: string } } & Teacher & {
      user: { email: string };
    })[];
  success?: boolean;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session", success: false };
  }

  const schoolId = (
    await db.schoolAdministrator.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        schoolId: true,
      },
    })
  )?.schoolId;

  if (!schoolId) redirect("/");

  const data = await db.teacher.findMany({
    where: { schoolId: schoolId },
    include: {
      subject: { select: { name: true, code: true } },
      user: { select: { email: true } },
    },
  });

  return { data: data, success: true };
}

export async function getTeacherDetails(teacherId: string) {
  return await db.teacher.findUnique({
    where: { id: teacherId },
    include: {
      subject: { select: { name: true, code: true } },
      user: { select: { email: true } },
    },
  });
}

/** stats related functions */
export async function getTotalMeetings(teacherId: string) {
  return (
    await db.attendance.aggregate({
      where: { teacherId: teacherId },
      _count: {
        teacherId: true,
      },
    })
  )._count.teacherId;
}

export async function getTotalTodaysMeetings(teacherId: string) {
  // return (
  //   await db.attendance.aggregate({
  //     where: { teacherId: teacherId, date: new Date() },
  //     _count: {
  //       teacherId: true,
  //     },
  //   })
  // )._count.teacherId;

  return (
    await db.attendance.groupBy({
      by: ["date", "meeting"],
      where: {
        teacherId: teacherId,
        date: new Date(),
      },
      _count: {
        id: true,
      },
    })
  ).length;
}

export async function getAvgStudentPerformance(teacherId: string) {
  const results = await db.grade.findMany({
    where: {
      teacherId: teacherId,
    },
    select: { score: true },
  });
  let totalScores = 0;
  results.forEach((item) => (totalScores += item.score));
  return totalScores / results.length;
}

export async function getAvgPredictedStudentPerformance(teacherId: string) {
  const result = await db.grade.findMany({
    where: { teacherId: teacherId },
    include: {
      student: {
        include: {
          _count: {
            select: {
              attendance: {
                where: {
                  present: false,
                },
              },
            },
          },
        },
      },
      subject: { select: { math_intensive: true } },
    },
  });

  const failureResponse = await db.grade.groupBy({
    by: ["studentId"],
    where: {
      teacherId: teacherId,
      passed: false,
    },
    _count: {
      studentId: true,
    },
  });

  const classFailures: { [key: string]: number } = {};
  for (let item of failureResponse) {
    classFailures[item.studentId] = item._count.studentId;
  }

  const records: (Student & {
    math_intensive: boolean;
    previous_grade: number;
    absences: number;
    class_failures: number;
  })[] = [];

  for (let item of result) {
    records.push({
      ...item.student,
      math_intensive: item.subject.math_intensive,
      previous_grade: item.score,
      absences: item.student._count.attendance,
      class_failures: classFailures[item.studentId]??0,
    });
  }

  const response = await predictStudentScores(records);

  if (response.success && response.data) {
    return (
      response.data.predictions.reduce((a, b) => a + b, 0) /
      response.data.predictions.length
    );
  }

  return -1;
}

export async function getTeacherProfileStats(teacherId: string) {
  return {
    totalLessons: await getTotalMeetings(teacherId),
    totalTodaysLessons: await getTotalTodaysMeetings(teacherId),
    averageStudentPerformance: await getAvgStudentPerformance(teacherId),
    averagePredictedStudentPerformance: await getAvgPredictedStudentPerformance(
      teacherId
    ),
  };
}
