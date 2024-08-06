import { getTeacherStudents } from "@/app/(school)/school_admin/_actions/student";

export default async function AttendancePage() {
  const students = await getTeacherStudents();
  return <div></div>;
}
