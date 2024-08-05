/** component imports */
import { Card } from "@/components/ui/card";
import { TrashIcon, EditIcon, InfoIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import React from "react";

export function CourseList({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-4">{children}</div>;
}

export function CourseCard({
  code,
  name,
  subjects,
}: {
  code: string;
  name: string;
  subjects: string[];
}) {
  return (
    <div className="shadow-neutral-500 shadow-sm p-4 rounded-sm flex flex-col gap-8">
      <div className="flex gap-4">
        <h2 className=" text-gray-600">{code}-{name}</h2>
        <HoverCard>
          <HoverCardTrigger>
            <InfoIcon className="cursor-pointer hover:stroke-ssPrimary-100" />
          </HoverCardTrigger>
          <HoverCardContent>
            <ul>
              {subjects.map((subject, index) => (
                <li className="text-xs flex flex-col gap-4" key={index}>{subject}</li>
              ))}
            </ul>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex justify-end gap-4 ">
        <TrashIcon className="cursor-pointer stroke-red-500 hover:stroke-ssPrimary-100" />
        <EditIcon className="cursor-pointer hover:stroke-ssPrimary-100" />
      </div>
    </div>
  );
}
