import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/general/logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSAS"
}

export default function Home() {
  return (
    <main className="w-screen h-screen relative">
      <Image
        fill
        src="/assets/images/smart_school_bg.jpg"
        alt="background"
        objectFit="cover"
        className="-z-10"
      />
      <div className="h-full w-full flex flex-col">
        <div className="flex justify-between items-center px-8 py-8 bg-ssPrimary-300/40">
          <Logo />
          <div className="flex justify-center items-center">
            <Link href="/login" className="text-2xl text-white hover:text-ssPrimary-200">
              Login
            </Link>
          </div>
        </div>
        <div className="flex-grow flex-col flex justify-center items-center text-center text-white px-8">
          <span className="text-6xl">Smart School</span>
          <br />
          <p className="text-3xl">School Administration Through Data-Informed Decision Making</p>
        </div>
      </div>
    </main>
  );
}
