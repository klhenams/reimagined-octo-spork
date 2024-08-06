"use client";
import { useTransition } from "react";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

import { deleteStudent } from "@/app/(school)/school_admin/_actions/student";

export function DeleteStudentButton({
  studentId,
}: { studentId: string } & React.HTMLProps<HTMLElement>) {
  const [pending, startTransition] = useTransition();
  return <Button variant="destructive">Delete</Button>;
}

export function DeleteStudentAlert({
  studentId,
}: { studentId: string } & React.HTMLProps<HTMLElement>) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="!p-0 bg-transparent w-fit h-fit hover:bg-transparent"
          disabled={pending}
        >
          <Trash2Icon className="w-6 h-6 stroke-red-700" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            student's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                const response = await deleteStudent(studentId);
                if (!response.success) toast.error(response.errorMessage);
                else router.replace("/school_admin/students");
              })
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
