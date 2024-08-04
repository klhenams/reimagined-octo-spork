import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-evenly items-center gap-2 pt-20 px-4 lg:px-0 mb-8 sm:mb-4">
      <div className="text-center lg:text-left lg:ml-[20px] lg:pr-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
          <span className="text-blue-600">USSD</span> Solutions
          <br />
          for Africa
        </h1>
        <p className="text-base md:text-lg lg:text-xl mt-4">
          Reach a broader audience by rapidly
          <br /> generating USSD menus for your business.
        </p>
        <Link href="/auth/signup">
          <button className="bg-blue-700 rounded-full px-6 py-2.5 mt-4 text-white mx-auto lg:mx-0">
            Get Started
          </button>
        </Link>
      </div>
      <div className="mt-10 lg:mt-[25px]">
        <Image
          src="/images/hero-sect-a.png"
          alt="Man checking his phone"
          width={600}
          height={800}
          className="mx-auto"
        />
      </div>
    </div>
  );
}


