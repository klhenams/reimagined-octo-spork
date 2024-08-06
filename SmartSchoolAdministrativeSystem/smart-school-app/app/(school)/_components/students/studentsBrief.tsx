"use client";
import { useQuery } from "@tanstack/react-query";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PhoneCallIcon, MailIcon, ChevronRight, EditIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { getStudentDetails } from "../../school_admin/_actions/student";

export default function StudentBrief({
  studentId,
  edit = true,
  ...props
}: { studentId?: string, edit?: boolean } & React.HTMLProps<HTMLElement>) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["student data", studentId],
    queryFn: async () => {
      if (studentId) return await getStudentDetails(studentId);
      else return null;
    },
  });

  if (!studentId)
    return (
      <div className="flex justify-center items-center">
        No Student Selected
      </div>
    );

  if (isError) {
    return (
      <div className="flex justify-center items-center text-ssPrimary-100">
        {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  if (!isLoading && !isError && !data) {
    return <div>No data found</div>;
  }

  return (
    <div
      className={cn(
        props.className,
        "flex flex-col items-center justify-center gap-12"
      )}
    >
      <div>
        <div className="text-center">{data?.index_number}</div>
        <Avatar className="w-40 h-40 my-6">
          <AvatarImage src={data?.imagePath ?? ""} className="object-cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-center">
            {data!.first_name} {data!.last_name}
          </h2>
          <div className="text-ssGray-200 text-sm text-center">
            {data!.course.code}-{data!.course.name}
          </div>
        </div>
      </div>

      {/** Icons */}
      <div className="flex justify-center gap-4">
        <Link href={`tel:${data!.phone_number}`}>
          <PhoneCallIcon className="w-6 h-6 stroke-ssGray-300" />
        </Link>
        <Link href={`mailto:${data!.email}`}>
          <MailIcon className="w-6 h-6 stroke-ssGray-300" />
        </Link>
        {edit && <Link href={`add/student?studentId=${studentId}`} target="_blank">
          <EditIcon className="w-6 h-6 stroke-ssGray-300" />
        </Link>}
        <Link href={`students/profile/${studentId}`} target="_blank">
          <ChevronRight className="w-6 h-6 stroke-ssGray-300" />
        </Link>
      </div>
      {/** Icons */}
    </div>
  );
}
