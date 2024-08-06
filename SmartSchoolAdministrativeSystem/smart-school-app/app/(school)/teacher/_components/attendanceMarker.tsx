"use client";
import { useState, useEffect, useTransition } from "react";

import StudentAttendanceSwitch from "./studentAttendanceSwitch";
import { useQuery } from "@tanstack/react-query";

// server actions
import {
  getTodaysAttendance,
  getNumberOfMeetings,
  createMeeting,
  deleteMeeting,
} from "../../school_admin/_actions/student";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import CancelXButton from "@/components/general/cancelXButton";

export default function AttendanceMarker({
  students,
}: {
  students: {
    id: string;
    first_name: string;
    other_names: string;
    last_name: string;
  }[];
}) {
  const [meeting, setMeeting] = useState<number>(1);
  const [meetings, setMeetings] = useState<number[]>([]);
  const [createMeetingPending, startCreateMeetingTransition] = useTransition();
  const [deleteMeetingPending, startDeleteMeetingTransition] = useTransition();

  const { data, error, isLoading } = useQuery({
    queryKey: ["meetings_array"],
    queryFn: async () => await getNumberOfMeetings(),
    refetchOnWindowFocus: false,
  });

  // if(!isLoading && !error && data) setMeetings(data);
  useEffect(() => {
    if (!isLoading && !error && data) setMeetings(data);
  }, [data]);

  const addMeeting = async () => {
    const createMeetingResponse = await createMeeting(
      meetings.length ? meetings.length + 1 : 1
    );
    if (createMeetingResponse.errorMessage) {
      toast.error(createMeetingResponse.errorMessage);
    } else {
      setMeetings((prev) => {
        const newState = [...prev];
        if (newState.length < 1) newState.push(1);
        else newState.push(newState[newState.length - 1] + 1);

        return newState;
      });
    }
  };

  const removeMeeting = async () => {
    const deleteMeetingResponse = await deleteMeeting(meeting);
    if (deleteMeetingResponse.errorMessage)
      toast.error(deleteMeetingResponse.errorMessage);
    if (deleteMeetingResponse.success) {
      setMeetings((prev) => {
        const index = prev.indexOf(meeting);
        const newState = [...prev];
        newState.splice(index, 1);

        return newState;
      });
      toast.success("Sucessfully Deleted Meeting");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center gap-4 mb-8">
        <Button
          onClick={() => startCreateMeetingTransition(addMeeting)}
          disabled={createMeetingPending}
        >
          New Meeting
        </Button>
      </div>
      <div className="w-full flex gap-4 flex-wrap">
        {meetings &&
          meetings.map((currentMeeting, index) => (
            <div className="relative">
              <Button
                key={index}
                variant={currentMeeting === meeting ? "destructive" : "default"}
                onClick={() => setMeeting(currentMeeting)}
              >
                {currentMeeting}
              </Button>
              <CancelXButton
                className="absolute -top-2 -right-2"
                onClick={removeMeeting}
              />
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-4">
        {students &&
          students.map((student, index) => (
            <div className="flex justify-between p-4 rounded-md">
              <div>
                {student.first_name} {student.other_names} {student.last_name}
              </div>
              <div>
                <StudentAttendanceSwitch
                  key={index}
                  studentId={student.id}
                  meeting={meeting}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function MeetingItem({ meeting }: { meeting: number }) {}
