import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SubjectScoresDisplay({
  grades,
  predictions,
  subjects,
}: {
  grades: {
    [key: string]: { score: number; passed: boolean; semester: number };
  };
  predictions: { [key: string]: number };
  subjects: {
    id: number;
    code: string;
    name: string;
    math_intensive: boolean;
  }[];
}) {

  return (
    <Table className=" w-96">
      <TableHeader>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Actual</TableCell>
          <TableCell>Predicted</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject, index) => (
          <TableRow className="h-9" key={index}>
            <TableCell>
              {subject.code}-{subject.name}
            </TableCell>
            <TableCell>
              {grades[subject.id] ? grades[subject.id].score : "?"}
            </TableCell>
            <TableCell>
              {predictions[subject.id] ? predictions[subject.id].toFixed(2) : "?"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// function ScoreItemDisplay({
//   score,
//   predictedScore,
//   subjectName,
//   ...props
// }: {
//   score?: number;
//   predictedScore?: number;
//   subjectName: string;
// } & React.HTMLProps<HTMLElement>) {
//   const maxWidth = 200;

//   return (
//     <div className="flex gap-2 items-center">
//       <span>73/23</span>
//       <div className={cn(`w-[${maxWidth}px]`, " h-7 text-sm relative")}>
//         {subjectName}
//         {score && (
//           <div
//             className={cn(
//               "h-full bg-ssSecondary-100 absolute left-0 top-0",
//               `w-[${(score / 100) * maxWidth}px]`
//             )}
//           ></div>
//         )}
//       </div>
//     </div>
//   );
// }
