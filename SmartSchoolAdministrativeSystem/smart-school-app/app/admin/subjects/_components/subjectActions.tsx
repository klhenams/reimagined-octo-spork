"use client";
/** react imports */
import { useTransition } from "react";
import { useRouter } from "next/navigation";
/** components imports */
import { Button } from "@/components/ui/button";
/** server action */
import { deleteSubject } from "../../_actions/subject";

export function DeleteSubjectButton({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isePending, startTransition] = useTransition();
  return (
    <Button
      variant="destructive"
      disabled={isePending}
      onClick={() =>
        startTransition(async () => {
          await deleteSubject(id);
          router.refresh();
        })
      }
    >
      {children ?? "Delete"}
    </Button>
  );
}
