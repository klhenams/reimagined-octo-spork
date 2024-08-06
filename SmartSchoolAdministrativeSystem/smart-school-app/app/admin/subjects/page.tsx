/** component imports */
import { Button } from "@/components/ui/button";
import SSDialog from "@/components/general/ssDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SubjectList, SubjectCard } from "./_components/subjectList";
import SubjectForm from "./_components/subjectForm";

/** icon imports */
import { PlusIcon } from "lucide-react";

//db
import db from "@/db/db";


export default async function AdminSubjectsPage() {
  const subjects = await db.subject.findMany();
  return (
    <>
      <div className="flex justify-end mb-8 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Add Subject
            </Button>
          </DialogTrigger>
          <SSDialog title="Add Subject">
            <SubjectForm />
          </SSDialog>
        </Dialog>
      </div>
      <div>
        <SubjectList>
          {subjects.map((subject, index) => (
            <SubjectCard key={index} {...subject} />
          ))}
        </SubjectList>
      </div>
    </>
  );
}
