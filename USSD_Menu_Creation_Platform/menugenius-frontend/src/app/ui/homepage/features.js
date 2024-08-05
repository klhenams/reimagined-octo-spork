import Image from "next/image";
import FeatureCard from "./featurecard";
import featureData from "./data";

export default function Features() {
  return (
    <section className="mt-8">
      <div className="flex flex-col justify-center items-center mb-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">Features</h1>
        <Image
          src="/images/about-underline.png"
          alt="About Us underlined"
          width={140}
          height={12}
        />
      </div>
      {/* Card Area */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {featureData.map((feature) => (
          <FeatureCard
            key={feature.img}
            photo={feature.img}
            title={feature.title}
            info={feature.info}
          />
        ))}
      </div>
    </section>
  );
}
