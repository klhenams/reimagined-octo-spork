"use client"

/** next imports */
import { useRouter } from "next/navigation";
/** icon button */
import { ChevronLeft } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <div className="h-screen overflow-y-auto flex flex-col">
      <div className="flex justify-start py-12 ps-24">
        <ChevronLeft
          className="w-8 h-8 stroke-ssPrimary-100 cursor-pointer hover:scale-150 transition-all"
          onClick={() => router.back()}
        />
      </div>
      <div className="flex-grow overflow-y-auto flex justify-center">
        {children}
      </div>
    </div>
  );
}
