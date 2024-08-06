import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import ExplanationsPlot from "./explanationsPlot";
import SubjectScoresDisplay from "./subjectScoresDisplay";

export default function StatsDrawerContent({
  predictionsData,
  grades,
  subjects,
}: {
  predictionsData?: {
    predictions: { [key: string]: number };
    explanations: [string, number][];
  };
  grades: {
    [key: string]: { score: number; passed: boolean; semester: number };
  };
  subjects: {
    id: number;
    code: string;
    name: string;
    math_intensive: boolean;
  }[];
}) {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="text-center">Predictions Summary</DrawerTitle>
        <DrawerDescription className="text-center">
          Predictions for various subjects and explanations
        </DrawerDescription>
      </DrawerHeader>
      <div className="flex px-8 items-center w-full">
        {predictionsData && (
          <div className="flex gap-32 items-center justify-center w-full">
            <div>
              <div className="text-center"><span className="text-red-600">Red</span> = Negative Effect</div>
              <ExplanationsPlot explanations={predictionsData.explanations} />
            </div>
            <div>
              <SubjectScoresDisplay
                grades={grades}
                predictions={predictionsData.predictions}
                subjects={subjects}
              />
            </div>
          </div>
        )}
        {!predictionsData && <span>No Data Found</span>}
      </div>
    </DrawerContent>
  );
}
