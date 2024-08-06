"use client";
import { useTransition, useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { markStudentAttendance } from "../../school_admin/_actions/student";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// server actions
import { getTodaysAttendenceStudent } from "../../school_admin/_actions/student";

export default function StudentAttendanceSwitch({
  studentId,
  meeting,
}: {
  studentId: string;
  meeting: number;
}) {
  const {
    data: todaysAttendance,
    error,
    isLoading,
  } = useQuery({
    queryKey: [studentId, meeting],
    queryFn: async () => await getTodaysAttendenceStudent(studentId, meeting),
    refetchOnWindowFocus: false,
  });
  const [pending, startTransition] = useTransition();
  const [checked, setChecked] = useState<boolean>(false);


  useEffect(() => {
    setChecked(!!todaysAttendance && todaysAttendance?.present);
  }, [todaysAttendance]);

  return (
    <Switch
      checked={checked}
      disabled={pending || isLoading}
      onCheckedChange={() => {
        startTransition(async () => {
          await markStudentAttendance(meeting, studentId, !checked);
          toast.success("Attendance");
          setChecked((prev) => !prev);
        });
      }}
    />
  );
}
