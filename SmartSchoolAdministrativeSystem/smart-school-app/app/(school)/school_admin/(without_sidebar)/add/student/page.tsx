/** component imports */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddMultipleStudentsForm from "./_components/addMultipleStudentsForm";
import StudentForm from "./_components/studentForm";
import db from "@/db/db";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Add | Edit Student"
}

export default async function AddStudentPage() {
  const courses = await db.course.findMany({
    select: { id: true, code: true, name: true },
  });


  return (
    <div className="w-full max-w-3xl">
      <Tabs defaultValue="single" className="w-fill">
        <TabsList className="w-full flex">
          <TabsTrigger value="single" className="flex-grow">
            Single
          </TabsTrigger>
          <TabsTrigger value="multiple" className="flex-grow">
            Multiple
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <StudentForm courses={courses} />
        </TabsContent>
        <TabsContent value="multiple">
          <AddMultipleStudentsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
