import Image from "next/image";
import Link from "next/link";

export default function FeatureCard({ photo, title, info }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:border-gray-500 hover:shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <Image 
        src={photo} 
        alt="card image" 
        width={85}
        height={110}
        className="mb-4"
      />
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">{title}</h2>
      <p className="text-sm md:text-md text-gray-600 text-center uppercase mb-4">{info}</p>
      <Link href="/about"> <p className="text-lg md:text-xl font-bold uppercase text-[#254DD9] text-center cursor-pointer">Learn more</p></Link>
     
    </div>
  );
}
