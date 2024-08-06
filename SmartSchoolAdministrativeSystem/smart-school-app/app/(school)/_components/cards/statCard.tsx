/** react imports */
import { ReactNode } from "react";

/** function imports */
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col gap-1 py-4">
      <span className="text-sm text-ssGray-200">
        {label}
      </span>
      <div className="text-4xl text-blue-700">
        {value}
      </div>
    </div>
  );
}
