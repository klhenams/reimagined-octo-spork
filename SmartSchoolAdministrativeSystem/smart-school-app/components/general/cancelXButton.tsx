import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export default function CancelXButton(props: React.HTMLProps<HTMLElement>) {
  return (
    <span
      onClick={props.onClick}
      className={cn(
        "flex w-5 h-5 border-gray-600 border rounded-full justify-center items-center bg-white cursor-pointer",
        props.className
      )}
    >
      <XIcon className="stroke-black w-3 h-3" />
    </span>
  );
}
