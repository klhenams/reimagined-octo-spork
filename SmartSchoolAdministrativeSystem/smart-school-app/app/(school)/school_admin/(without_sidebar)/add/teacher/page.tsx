/** component imports */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/db/db";
import MultiTeachersUpload from "./_components/multileTeachersUploadForm";
import TeacherForm from "./_components/teacherForm";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Add | Edit Teacher"
}

export default async function AddStudentPage() {
  const subjects = await db.subject.findMany({
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
          {/* <TeacherForm subjects={subjects} /> */}
          <TeacherForm subjects={subjects} />
        </TabsContent>
        <TabsContent value="multiple">
          <MultiTeachersUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
}
