"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PhoneCallIcon, MailIcon, ChevronRight, EditIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { getTeacherDetails } from "../../school_admin/_actions/teachers";

export default function TeacherBrief({
  teacherId,
  ...props
}: { teacherId?: string } & React.HTMLProps<HTMLElement>) {
  if (!teacherId)
    return (
      <div className="flex justify-center items-center">
        No Teacher Selected
      </div>
    );
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["student data", teacherId],
    queryFn: async () => {
      if (teacherId) return await getTeacherDetails(teacherId);
    },
  });

  console.log(data);

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
        <Avatar className="w-40 h-40 my-6">
          <AvatarImage src={data?.imagePath ?? ""} className="object-cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-center">
            {data!.first_name} {data!.last_name}
          </h2>
          <div className="text-ssGray-200 text-sm text-center">
            {data!.subject.code}-{data!.subject.name}
          </div>
        </div>
      </div>

      {/** Icons */}
      <div className="flex justify-center gap-4">
        {data!.phone_number && (
          <Link href={`tel:${data!.phone_number}`}>
            <PhoneCallIcon className="w-6 h-6 stroke-ssGray-300" />
          </Link>
        )}
        <Link href={`mailto:${data!.user.email}`}>
          <MailIcon className="w-6 h-6 stroke-ssGray-300" />
        </Link>
        <Link href={`add/teacher?teacherId=${teacherId}`} target="_blank">
          <EditIcon className="w-6 h-6 stroke-ssGray-300" />
        </Link>
        <Link href={`teachers/profile/${teacherId}`} target="_blank">
          <ChevronRight className="w-6 h-6 stroke-ssGray-300" />
        </Link>
      </div>
      {/** Icons */}
    </div>
  );
}
