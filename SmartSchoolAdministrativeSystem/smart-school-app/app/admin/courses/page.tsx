/** component imports */
import { Button } from "@/components/ui/button";
import SSDialog from "@/components/general/ssDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CourseForm from "./_components/courseForm";
import { CourseList, CourseCard } from "./_components/courseList";
import { getAllSubjects } from "../_actions/course";


/** icon imports */
import { PlusIcon } from "lucide-react";

//db
import db from "@/db/db";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    select: { code: true, name: true, subjects: true },
  });
  const subjects = await getAllSubjects();
  return (
    <>
      <div className="flex justify-end mb-8 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Add Course
            </Button>
          </DialogTrigger>
          <SSDialog title="Add Course">
            <CourseForm subjects={subjects} />
          </SSDialog>
        </Dialog>
      </div>
      <div>
        <CourseList>
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              code={course.code}
              name={course.name}
              subjects={course.subjects.map(
                (subject) => `${subject.code}-${subject.name}`
              )}
            />
          ))}
        </CourseList>
      </div>
    </>
  );
}
