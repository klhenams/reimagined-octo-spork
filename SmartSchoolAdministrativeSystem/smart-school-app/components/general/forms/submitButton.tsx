"use client";
/** react imports */
import React from "react";
import { useFormStatus } from "react-dom";

/** function imports */
import { cn } from "@/lib/utils";

/** component imports */
import { Button } from "@/components/ui/button";

/** props import */
import { ButtonProps } from "@/components/ui/button";

export default function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn("text-2xl py-8", props.className)}
      aria-disabled={pending || props.disabled}
      disabled={pending || props.disabled}
    >
      {pending ? "Loading..." : props.children ? props.children : "Submit"}
    </Button>
  );
}
