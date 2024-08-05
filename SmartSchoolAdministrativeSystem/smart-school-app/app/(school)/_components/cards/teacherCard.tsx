/** next imports */
import Link from "next/link";
import Image from "next/image";

/** component imports */
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/** icon imports */
import { ChevronRight } from "lucide-react";

/** function imports */
import { cn } from "@/lib/utils";

type TeacherCardProps = {
  id?: string;
  firstName?: string;
  lastName?: string;
  otherNames?: string;
  contact?: string;
  subject?: string;
  image?: string;
};

export default function TeacherCard({
  id,
  firstName = "Victor",
  lastName = "Roque",
  otherNames = "Jackson",
  contact = "+23324576892",
  subject = "Core Mathematics",
  image = "https://github.com/shadcn.png",
}: TeacherCardProps) {
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
          <span className="text-gray-400">Subject</span>
          <span>{subject}</span>
        </div>
      </div>
      <Link
        href="#"
        className="h-full w-12 flex justify-center items-center bg-ssPrimary-100 self-stretch"
      >
        <ChevronRight className="w-6 h-6 stroke-white" />
      </Link>
    </Card>
  );
}
