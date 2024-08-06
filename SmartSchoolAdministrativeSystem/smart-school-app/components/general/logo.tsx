import { BrainIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo(props: React.HTMLProps<HTMLElement>) {
  return (
    <h1
      className={cn(
        props.className,
        "w-20 h-20 bg-white text-ssPrimary-100 rounded-full flex justify-center items-center font-semibold text-lg flex-col"
      )}
    >
      <BrainIcon className="fill-ssPrimary-100 stroke-white" />
      SSA
    </h1>
  );
}
