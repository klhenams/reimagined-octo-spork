'use client'
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname= usePathname();

  let heading, description, imgUrl
  if (pathname === '/auth/signup') {
    heading = 'Boost your business with MenuGenius';
    description = 'Create an account to get started.';
    imgUrl = '/images/signup.jpg'
  } else if (pathname === '/auth/login') {
    heading = 'Welcome Back';
    description = 'Sign in to continue.';
    imgUrl = '/images/login.jpg'
  } else if (pathname === '/auth/admin') {
    heading = 'Welcome Back';
    description = 'Sign in to continue.';
    imgUrl = '/images/login.jpg'
  }else if (pathname === '/auth/recovery') {
    heading = "Let's help you recover your account";
    description = 'Follow simple steps to reset your password.';
    imgUrl = '/images/recovery.jpg'
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2 justify-start">
      <img 
      src={imgUrl}
      alt="Background Image" 
      className="absolute h-full object-cover" 
      />

      <div className="z-10 flex flex-col justify-start mt-16 py-5 px-20 p-8">
      <div className="bg-zinc-800 w-12 h-12 rounded-full py-4 mb-4"></div>
      <div className="">
          <h1 className="text-4xl font-bold text-zinc">{heading}</h1>
          <p className="text-xl text-zinc mt-4">{description}</p>
      </div>
      </div>

      </div>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        {children}
      </div>
    </div>
  );
}
