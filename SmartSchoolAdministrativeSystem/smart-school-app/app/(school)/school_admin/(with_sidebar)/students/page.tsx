/** next imports */
import Link from "next/link";
import { Metadata } from "next";

/** component imports */
import { Button } from "@/components/ui/button";
import StudentsList from "@/app/(school)/_components/students/studentsList";
import { UserIcon } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

/** functions */
import { getAllStudents } from "../../_actions/student";

/** icon imports */
import { PlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: 'SSAS | Students',
  description: 'list of students for on administrator dashboard',
}

export default async function StudentsPage() {
  const students = await getAllStudents();
  return (
    <div className="w-full min-h-full">
      <h1 className="mb-8  mt-4 flex justify-between">
        <span className="text-ssGray-300 text-lg">Students</span>
        <Link
          href="/school_admin/add/student"
          className="text-ssPrimary-100 flex gap-2 p-2 rounded-md hover:bg-ssPrimary-100 transition-all hover:text-white"
        >
          <UserIcon />
          <PlusIcon />
        </Link>
      </h1>
      <div>
        <StudentsList students={students} />
      </div>
    </div>
  );
}
