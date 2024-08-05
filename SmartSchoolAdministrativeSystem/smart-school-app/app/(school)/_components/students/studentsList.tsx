"use client";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StudentBrief from "./studentsBrief";
import { cn } from "@/lib/utils";

export default function StudentsList({
  students,
}: {
  students: {
    id: string;
    first_name: string;
    last_name: string;
    other_names?: string;
    email: string | null;
    phone_number: string | null;
    index_number: number;
    gender: string;
    age: number;
    imagePath?: string | null;
  }[];
}) {
  const [currentStudent, setCurrentStudent] = useState<string>();
  return (
    <div className="grid grid-cols-3">
      {/** Table for students data start */}
      <div className="col-span-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Index Number</TableHead>
              <TableHead>Parent Email</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Gender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow
                key={student.id}
                className={cn("cursor-pointer hover:bg-ssPrimary-300 hover:text-white", (currentStudent === student.id) && "bg-ssPrimary-200 text-white")}
                onClick={() => setCurrentStudent(student.id)}
              >
                <TableCell className="font-medium flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={student.imagePath ?? "https://github.com/shadcn.png"}
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span>
                    {student.first_name} {student.last_name}
                  </span>
                </TableCell>
                <TableCell>{student.index_number}</TableCell>
                <TableCell>{student.email ?? "Unavailable"}</TableCell>
                <TableCell>SC1</TableCell>
                <TableCell>{student.gender}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/** Table for students data end */}
      {/** Student summary start */}
      <StudentBrief studentId={currentStudent} edit={true} />
      {/** Student summary end */}
    </div>
  );
}
