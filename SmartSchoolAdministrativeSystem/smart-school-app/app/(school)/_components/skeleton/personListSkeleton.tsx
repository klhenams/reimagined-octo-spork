import { Skeleton } from "@/components/ui/skeleton";

export default function PersonListSkeleton(){
    return (
        <div className="grid grid-cols-3">
            <div className="col-span-2">
                {Array(5).fill(0).map((_, index) => 
                <Skeleton key={index} className="w-full h-16"/>
                )}
            </div>
            <div>

            </div>
        </div>
    )
}