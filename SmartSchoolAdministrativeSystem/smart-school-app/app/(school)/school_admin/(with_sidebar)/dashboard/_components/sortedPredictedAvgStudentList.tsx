"use client"
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function SortedByPredAvgStudents({
  students,
}: {
  students: {
    id: string;
    index_number: number;
    first_name: string;
    last_name: string;
    class: string;
    email: string | null;
    imagePath: string | null;
    predictedAverage: number;
  }[];
}) {
  const router = useRouter();
  return (
    <div className="w-full">
      {students.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center pt-12">
          No Students
        </div>
      ) : (
        <div className="p-4">
          <h1 className="mb-4 text-center text-xl">
            Students With Least Predicted Average
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Index Number</TableHead>
                <TableHead>Parent Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Predicted Average</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow
                  key={student.id}
                  className={cn(
                    "cursor-pointer hover:bg-ssPrimary-300 hover:text-white"
                  )}
                  onClick={() => router.push(`/school_admin/students/profile/${student.id}`)}
                >
                  <TableCell className="font-medium flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          student.imagePath ?? "https://github.com/shadcn.png"
                        }
                        className="object-cover"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>
                      {student.first_name} {student.last_name}
                    </span>
                  </TableCell>
                  <TableCell>{student.index_number}</TableCell>
                  <TableCell>{student.email ?? "Unavailable"}</TableCell>
                  <TableCell>SC1</TableCell>
                  <TableCell className="font-bold text-red-700">
                    {student.predictedAverage.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
