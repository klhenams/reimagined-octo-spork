/** component imports */
import StatCard from "@/app/(school)/_components/cards/statCard";
import SSCalendar from "@/components/general/ssCalendar";
import { Card } from "@/components/ui/card";
import AttendanceAndEvents from "./_components/attendanceAndEvents";
import FinanceChart from "./_components/financeChart";
import SortedByPredAvgStudents from "./_components/sortedPredictedAvgStudentList";

import { getDashboardStats } from "../../_actions/school_admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSAS | Admin Dashboard",
  description: "administrator dashboard home",
};

export default async function SchoolAdminDashboardPage() {
  const dashboardStats = await getDashboardStats();

  return (
    <div className="w-full min-h-full">
      <span className="text-ssGray-300">Dashboard</span>
      <div className="flex gap-4 flex-wrap mt-4">
        <div className="w-2/3 flex flex-col flex-1 justify-between">
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="flex justify-center items-center">
              <StatCard label="Students" value={dashboardStats.numStudents} />
            </div>
            <div className="flex justify-center items-center border-s-2 border-blue-700">
              <StatCard label="Teachers" value={dashboardStats.numTeachers} />
            </div>
            {/* <div className="flex justify-center items-center">
            <StatCard label="Accounts" value={`GHS ${937}`}/>
            </div> */}
          </div>
          <Card>
            <div className="w-full h-[450px]">
              {/* <FinanceChart /> */}
              <SortedByPredAvgStudents
                students={dashboardStats.leastPredictedAvgStudents ?? []}
              />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <AttendanceAndEvents
              studentPercentagePresent={
                (dashboardStats.totalStudentPresent /
                  dashboardStats.totalMeetings) *
                100
              }
            />
          </div>
          <div className="flex justify-center w-full">
            <SSCalendar className="flex-grow" />
          </div>
        </div>
      </div>
    </div>
  );
}
