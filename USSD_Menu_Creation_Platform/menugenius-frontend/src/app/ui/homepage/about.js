import Image from "next/image";

export default function About() {
  return (
    <section className="">
      <div className="flex flex-col justify-center items-center mb-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-center">About Us</h1>
        <Image
          src="/images/about-underline.png"
          alt="About Us underlined"
          width={140}
          height={12}
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-2.5 items-center lg:items-start">
        <img
          src="/images/woman-mokup.png"
          alt="Woman holding a phone"
          width={500}
          height={400}
          className=""
        />
      
        <div className="flex flex-col mt-8 lg:mt-24 p-4 lg:p-0 lg:max-w-xl text-center lg:text-left">
          <p className="text-lg md:text-xl lg:text-2xl mb-4">
            MenuGenius is an innovative USSD generation platform designed to cater to the diverse and bespoke needs of both individuals and corporate entities. You can easily create dynamic USSD apps that can be accessed anywhere without internet connectivity.
          </p>
        </div>
      </div>
    </section>
  );
}

