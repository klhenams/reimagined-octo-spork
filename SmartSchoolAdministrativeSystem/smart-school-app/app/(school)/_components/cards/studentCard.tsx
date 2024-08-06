/** next imports */
import Link from "next/link";

/** component imports */
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/** icon imports */
import { ChevronRight } from "lucide-react";

/** function imports */
import { cn } from "@/lib/utils";



type StudentCardProps = {
  studentId: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  contact?: string;
  course: string;
  status?: string;
  image?: string;
};

export default function StudentCard({
  studentId,
  firstName = "Victor",
  lastName = "Roque",
  contact = "+23324576892",
  status = "present",
  course = "General Science",
  image = "https://github.com/shadcn.png"
}: StudentCardProps) {
  return (
    <Card className="w-full flex h-24 overflow-hidden">
      <div className="h-full flex justify-between items-center flex-grow px-8 py-4">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={image}/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            {firstName}
            <br />
            {lastName}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400">Contact</span>
          <span>{contact}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400">Course</span>
          <span>{course}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-400">Present</span>
          <span
            className={cn(
              "w-4 h-4 rounded-full ring-1 ring-ssPrimary-100 ring-offset-2 self-center",
              status == "present" ? "bg-green-600" : "bg-red-600"
            )}
          ></span>
        </div>
      </div>
      <Link
        href={`/teacher/students/profile/${studentId}`}
        target="_blank"
        className="h-full w-12 flex justify-center items-center bg-ssPrimary-100 self-stretch"
      >
        <ChevronRight className="w-6 h-6 stroke-white" />
      </Link>
    </Card>
  );
}
