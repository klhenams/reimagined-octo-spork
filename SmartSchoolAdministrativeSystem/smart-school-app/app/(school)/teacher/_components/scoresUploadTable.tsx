"use client";
import { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/** server actions */
import { uploadStudentScores } from "../../school_admin/_actions/student";

export default function ScoresUploadTable({
  students,
}: {
  students: {
    id: string;
    index_number: number;
    first_name: string;
    last_name: string;
    course: { name: string; code: string };
  }[];
}) {
  const [scores, setScores] = useState<{
    [key: string]: number;
  }>({});
  const passMarkInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    const data = {
      scores: scores,
      title: titleInputRef.current!.value,
      passMark: parseFloat(passMarkInputRef.current!.value),
    };

    setLoading(true);
    uploadStudentScores(data)
      .then((response) => {
        if (response?.success)
          toast.success(
            `Scores for ${response.data} students successfully uploaded`
          );
        else toast.error(response?.errorMessage);
      })
      .catch((error: any) => {
        toast.error(error.message ?? error ?? "Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div>
          Pass Mark:
          <Input
            ref={passMarkInputRef}
            type="number"
            min={0}
            max={100}
            defaultValue={40}
            name="passmark"
          />
        </div>
        <div>
          Title <small>(Give a title to your scores)</small>:
          <Input ref={titleInputRef} name="title" />
        </div>
      </div>
      <Table>
        <TableCaption>Upload scores for you students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Index Number</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index: number) => (
            <StudentScoreItem
              key={index}
              studentId={student.id}
              indexNumber={student.index_number}
              firstName={student.first_name}
              lastName={student.last_name}
              courseCode={student.course.code}
              courseName={student.course.name}
              setScores={setScores}
              added={student.id in scores}
            />
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-6">
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full max-w-64"
        >
          {loading ? "Loading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}

function StudentScoreItem({
  studentId,
  indexNumber,
  firstName,
  lastName,
  courseCode,
  courseName,
  setScores,
  added,
}: {
  studentId: string;
  indexNumber: number;
  firstName: string;
  lastName: string;
  courseCode: string;
  courseName: string;
  added?: boolean;
  setScores: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;
}) {
  const scoreInputRef = useRef<HTMLInputElement>(null);
  const handleRemove = (prev: { [key: string]: number }) => {
    const copy = { ...prev };
    delete copy[studentId];
    return copy;
  };
  return (
    <TableRow>
      <TableCell>
        {firstName} {lastName}
      </TableCell>
      <TableCell>
        {indexNumber}
      </TableCell>
      <TableCell>
        {courseCode}-{courseName}
      </TableCell>
      <TableCell>some subject</TableCell>
      <TableCell>
        <Input
          defaultValue={0}
          type="number"
          min={0}
          max={100}
          ref={scoreInputRef}
        />
      </TableCell>
      <TableCell>
        {!added && (
          <Button
            onClick={() =>
              setScores((prev) => ({
                ...prev,
                [studentId]: parseFloat(scoreInputRef.current!.value),
              }))
            }
          >
            Add
          </Button>
        )}
        {added && (
          <Button variant="destructive" onClick={() => setScores(handleRemove)}>
            Remove
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
