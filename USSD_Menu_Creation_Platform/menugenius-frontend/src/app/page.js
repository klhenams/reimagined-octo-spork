import Image from "next/image";
import Navbar from "@/app/ui/homepage/navbar";
import Hero from "@/app/ui/homepage/hero";
import About from "./ui/homepage/about";
import Footer from "./ui/homepage/footer";
import Features from "./ui/homepage/features";

export default function Home() {
  return (
    <div>
    <Navbar />
    <Hero />
    <About />
    <Features />
    <Footer />
    </div>
    
  );
}
