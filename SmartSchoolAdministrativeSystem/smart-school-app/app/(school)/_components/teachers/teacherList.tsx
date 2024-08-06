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
import TeacherBrief from "./teacherBrief";
import { cn } from "@/lib/utils";

export default function TeacherList({
  teachers,
}: {
  teachers?: {
    id: string;
    first_name: string;
    last_name: string;
    other_names?: string;
    phone_number: string | null;
    gender: string;
    age: number;
    imagePath?: string | null;
    subject: { name: string };
    user: {
      email: string;
    };
  }[];
}) {
  const [currentTeacher, setCurrentTeacher] = useState<string>();
  return (
    <>
      {teachers && (
        <div className="grid grid-cols-3">
          {/** Table for students data start */}
          <div className="col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Subject</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher, index) => (
                  <TableRow
                    key={teacher.id}
                    className={cn(
                      "cursor-pointer hover:bg-ssPrimary-300 hover:text-white",
                      currentTeacher === teacher.id && "bg-ssPrimary-200 text-white"
                    )}
                    onClick={() => setCurrentTeacher(teacher.id)}
                  >
                    <TableCell className="font-medium flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            teacher.imagePath ?? "https://github.com/shadcn.png"
                          }
                          className="object-cover"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span>
                        {teacher.first_name} {teacher.last_name}
                      </span>
                    </TableCell>
                    <TableCell>{teacher.phone_number}</TableCell>
                    <TableCell>{teacher.user.email ?? "Unavailable"}</TableCell>
                    <TableCell>{teacher.subject.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/** Table for students data end */}
          {/** Student summary start */}
          <TeacherBrief teacherId={currentTeacher} />
          {/** Student summary end */}
        </div>
      )}
      {!teachers && (
        <div className="w-full h-full flex justify-center items-center text-3xl">
          {" "}
          No Teachers Found
        </div>
      )}
    </>
  );
}
