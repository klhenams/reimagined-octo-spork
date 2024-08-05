import { Skeleton } from "@/components/ui/skeleton";

export default function StudentProfileLoading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div>
        <Skeleton className="w-64 h-64 rounded-full" />
        <div className="flex flex-col gap-8 justify-center">
          <div className="flex justify-center items-center">
            <Skeleton className="w-12 h-12"/>
            <Skeleton className="w-12 h-12"/>
            <Skeleton className="w-12 h-12"/>
          </div>
        </div>
      </div>
    </div>
  );
}
