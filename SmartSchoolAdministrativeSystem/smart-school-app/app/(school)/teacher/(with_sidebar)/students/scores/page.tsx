import { getTeacherStudents } from "../../../../school_admin/_actions/student";
import ScoresUploadTable from "../../../_components/scoresUploadTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSAS | Scores"
}

export default async function ScoresUploadPage() {
  const response = await getTeacherStudents();
  if (!response.success) {
    return <div>{response.errorMessage}</div>;
  }
  if (!response.data || response.data.length < 1) {
    return <div>No students found</div>;
  }
  return <ScoresUploadTable students={response.data} />;
}
