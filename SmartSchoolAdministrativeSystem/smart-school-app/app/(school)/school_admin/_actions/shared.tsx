import { auth } from "@/auth";
import db from "@/db/db";
import { Student } from "@prisma/client";
import axios from "axios";
import { ML_API_ENDPOINTS } from "@/lib/endpoints";

export async function getSchoolIdByEmail(email: string) {
  return (
    await db.user.findUnique({
      where: { email },
      select: { SchoolAdministrator: { select: { schoolId: true } } },
    })
  )?.SchoolAdministrator[0].schoolId;
}

export async function getSessionId() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return;
  }

  return session.user.id;
}

export async function predictStudentScores(
  records: (Student & { previous_grade: number; math_intensive: boolean , absences: number, class_failures: number })[]
): Promise<{
  data?: { predictions: number[]; explanations: [string, number][] };
  success?: boolean;
  error?: string;
}> {
  try {
    const response = await axios.post(
      `${process.env.ML_API_ROOT}/${ML_API_ENDPOINTS.studentGradePredict}`,
      records,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { data: response.data, success: true };
  } catch (error: any) {
    if (error.response) {
      return {
        error: `${error.status}:${error.message ?? "unfavorable response"}`,
        success: false,
      };
    } else if (error.request) {
      return {
        error: error.message ? error.message : "No response received",
        success: false,
      };
    } else {
      return { error: error.message ?? "Something went wrong", success: false };
    }
  }
}
