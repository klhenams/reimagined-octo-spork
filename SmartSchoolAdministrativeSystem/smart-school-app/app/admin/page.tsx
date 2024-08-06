/** component imports */
import { SchoolList, SchoolCard } from "./_components/schoolList";
import { Button } from "@/components/ui/button";
import SSDialog from "@/components/general/ssDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

/** formts */
import SchoolForm from "./_components/schoolForm";

/** icon imports */
import { PlusIcon } from "lucide-react";

/** database imports */
import db from "@/db/db";

const fakeSchools = [
  {
    name: "Great School",
    region: "Greater Accra Region",
    district: "Adenta",
  },
];
export default async function AdminHomePage() {
  const schools = await db.school.findMany();
  return (
    <>
      <div className="flex justify-end mb-8 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Add School
            </Button>
          </DialogTrigger>
          <SSDialog title="Add School">
            <SchoolForm />
          </SSDialog>
        </Dialog>
      </div>
      {schools && schools.length > 0 && (
        <SchoolList>
          {schools.map((school, index) => (
            <SchoolCard key={index} {...school} />
          ))}
        </SchoolList>
      )}
    </>
  );
}
