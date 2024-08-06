/** components */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import TeacherCard from "@/app/(school)/_components/cards/teacherCard";
import TeacherList from "@/app/(school)/_components/teachers/teacherList";

/**server functions */
import { getTeachers } from "../../_actions/teachers";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'SSAS | Teachers',
  description: 'list of teachers for on administrator dashboard',
}

export default async function TeachersPage() {
  const response = await getTeachers();
  return (
  <div className="w-full min-h-full">
      <h1 className="text-lg mb-8  mt-4 flex justify-between text-ssGray-300">
        Teachers
        <Link href="/school_admin/add/teacher">
          <Button>
            <PlusIcon /> New Teacher
          </Button>
        </Link>
      </h1>
      {/* {response.data && response.data.length > 0 && (
        <div className="flex flex-col gap-6">
          {response.data.map(
            (
              teacher,
              index: number
            ) => (
              <TeacherCard
                key={index}
                firstName={teacher.first_name}
                lastName={teacher.last_name}
                otherNames={teacher.other_names}
                subject={teacher.subject.name}
                image={teacher.imagePath ?? undefined}
              />
            )
          )}
        </div>
      )} */}
      <TeacherList teachers={response.data}/>
    </div>
  );
}
