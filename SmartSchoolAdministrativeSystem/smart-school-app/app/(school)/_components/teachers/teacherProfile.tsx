import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MailIcon, PhoneCallIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type TeacherProfileProps = {
  teacherData: {
    id: string;
    first_name: string;
    last_name: string;
    other_names: string;
    imagePath: string | null;
    phone_number: string | null;
    user: { email: string | null };
    subject: { name: string; code: string };
  };
  stats: {
    totalLessons: number;
    totalTodaysLessons: number;
    averageStudentPerformance: number;
    averagePredictedStudentPerformance: number;
  };
};

export default function TeacherProfile({
  teacherData,
  stats,
}: TeacherProfileProps) {
  return (
    <div className="flex items-center gap-32 justify-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center flex-col">
          <Avatar className="w-52 h-52 my-6">
            <AvatarImage
              src={teacherData?.imagePath ?? ""}
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-center">
              {teacherData!.first_name} {teacherData!.last_name}
            </h2>
            <div className="text-ssGray-200 text-sm text-center">
              {teacherData!.subject.code}-{teacherData!.subject.name}
            </div>
          </div>
        </div>
        {/** Icons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href={`tel:${teacherData!.phone_number}`}>
            <PhoneCallIcon className="w-6 h-6 stroke-ssGray-300" />
          </Link>
          <Link href={`mailto:${teacherData!.user.email}`}>
            <MailIcon className="w-6 h-6 stroke-ssGray-300" />
          </Link>
        </div>
        {/** Icons */}
      </div>
      {/** Stats start */}
      <div className="flex flex-col justify-center gap-8">
        <div>
          <h3 className="text-2xl text-ssGray-300">SUMMARY</h3>
          <div className="flex gap-12">
            <div>
              <span className="text-ssGray-200 text-sm">Total Lessons</span>

              <div className={cn("text-5xl")}>{stats.totalLessons}</div>
            </div>
            <div>
              <span className="text-ssGray-200 text-sm">
                Average Performance
              </span>
              <div
                className={cn(
                  "text-5xl",
                  stats.averageStudentPerformance > 50
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {stats.averageStudentPerformance}
              </div>
            </div>
            <div>
              <span className="text-ssGray-200 text-sm">
                Predicted Average Performance
              </span>
              <div
                className={cn(
                  "text-5xl",
                  stats.averagePredictedStudentPerformance > 50
                    ? "text-green-700"
                    : "text-red-700"
                )}
              >
                {stats.averagePredictedStudentPerformance === -1 ? "..." : stats.averagePredictedStudentPerformance.toFixed(2)}
              </div>
              {/* <Drawer>
                  <DrawerTrigger asChild>
                    <div className="text-5xl text-purple-700 cursor-pointer">
                      {isLoading && "..."}
                      {!isLoading && predictedAvg.toFixed(2)}
                    </div>
                  </DrawerTrigger>
                  <StatsDrawerContent
                    predictionsData={predictionsResponse?.success}
                    grades={grades}
                    subjects={studentData.course.subjects}
                  />
                </Drawer> */}
            </div>
            <div></div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl text-ssGray-300">LIVE UPDATES</h3>
          <div className="flex gap-12">
            <div>
              <span className="text-ssGray-200 text-sm">Lessons Today</span>
              <div className="text-5xl text-black">
                {stats.totalTodaysLessons}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/** Stats end */}
    </div>
  );
}
