import StudentProfile from "@/app/(school)/_components/pages/studentProfile";
import { getAbsencesSummaryAdmin} from "@/app/(school)/school_admin/_actions/student";
import db from "@/db/db";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Student Profile"
}

export default async function StudentProfilePage({
  params,
}: {
  params: { studentId: string };
}) {
  const results: {
    subjectId: number;
    score: number;
    passed: boolean;
    semester: number;
    math_intensive: boolean;
  }[] = await db.$queryRaw`
    SELECT "subjectId", "score", "passed"
    FROM (
      SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY "subjectId"  ORDER BY "dateEntered" DESC) AS row_num
      FROM "Grade" WHERE "studentId"=${params.studentId}
    ) AS numbered_rows
    WHERE row_num = 1;
  `;


  const studentData = await db.student.findUnique({
    where: { id: params.studentId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      other_names: true,
      imagePath: true,
      phone_number: true,
      index_number: true,
      email: true,
      year: true,
      course: {
        select: {
          name: true,
          code: true,
          subjects: {
            select: { id: true, code: true, name: true, math_intensive: true },
          },
        },
      },
    },
  });


  const subjectScores: {
    [key: string]: { score: number; passed: boolean; semester: number };
  } = {};
  results.forEach((item) => {
    subjectScores[item.subjectId] = {
      score: item.score,
      passed: item.passed,
      semester: item.semester,
    };
  });


  const stats = {
    absences: await getAbsencesSummaryAdmin(params.studentId)
  }

  return <StudentProfile studentData={studentData!} grades={subjectScores} stats={stats} canDelete={true}/>;
}
