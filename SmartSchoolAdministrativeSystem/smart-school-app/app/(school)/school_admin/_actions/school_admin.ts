import db from "@/db/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStudentPredictionsWitIds } from "./student";

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

export async function getTotalMeetings(schoolId: string) {
  return (
    await db.attendance.aggregate({
      _count: {
        id: true,
      },
    })
  )._count.id;
}

/** function to get students in danger */
export async function getStudentsSortedByPredictedAverage(
  max_students: number = 5
) {
  const response = await getStudentPredictionsWitIds();
  if (!response.success)
    return {
      errorMessage: response.error ? response.error : "something went wrong",
      success: false,
      data: null,
    };

  const studentsWithPreds = response.data!;
  const averages: { [key: string]: number } = {};
  const result: {
    id: string;
    index_number: number;
    first_name: string;
    last_name: string;
    class: string;
    email: string | null;
    imagePath: string | null;
    predictedAverage: number;
  }[] = [];
  // getting the averages of each student
  for (let student of studentsWithPreds) {
    let scores_sum = 0;
    for (let score of student.predictedGrades) {
      scores_sum += score;
    }
    result.push({
      id: student.id,
      index_number: student.index_number,
      first_name: student.first_name,
      last_name: student.last_name,
      class: student.class,
      email: student.email,
      imagePath: student.imagePath,
      predictedAverage: scores_sum / student.predictedGrades.length,
    });

    result.sort((a, b) => a.predictedAverage - b.predictedAverage);
  }

  return { success: true, data: result.slice(0, max_students) };
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
    totalMeetings: await getTotalMeetings(school.schoolId),
    leastPredictedAvgStudents:
      (await getStudentsSortedByPredictedAverage()).data ?? [],
  };
}
