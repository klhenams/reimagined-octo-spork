import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { cn } from "@/lib/utils";
  import React from "react";
  
  type SSDialogProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactNode;
    title?: string;
  };
  
  export default function SSDialog(props: SSDialogProps) {
    return (
      <DialogContent
        className={cn(
          "sm:max-w-screen-md max-h-[100%] flex flex-col",
          props.className
        )}
      >
        <DialogHeader className="mb-3">
          <DialogTitle className="text-ssPrimary-100">
            {props.title}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto px-2 py-8">{props.children}</div>
      </DialogContent>
    );
  }
  