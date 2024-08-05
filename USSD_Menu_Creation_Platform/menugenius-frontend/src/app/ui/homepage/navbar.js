'use client'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full h-24 shadow-md fixed z-10 bg-white">
      <div className="flex items-center w-full h-full px-4 2xl:px-16">
      <div className="w-1/3">
        <Link href="/">
          <div className="lg:ml-[30px]">
            <Image
              src="/images/navbar-logo.png"
              alt="Menugenius-logo"
              width={150}
              height={80}
              className="cursor-pointer" 
            />
          </div>
        </Link>
        </div>
        <div className="w-1/3 flex justify-center hidden lg:flex">
      <ul className="flex justify-center gap-5 font-medium">
        <Link href="/about">
          <li>About</li>
        </Link>
        <Link href="/contact">
          <li>Contact Us</li>
        </Link>
      </ul>
    </div>
    <div className="w-1/3 flex justify-end gap-5 hidden lg:flex">
      <Link href="/auth/login">
        <button className="border border-black rounded-full px-8 py-2 font-medium">
          Sign In
        </button>
      </Link>
      <Link href="/auth/signup">
        <button className="bg-blue-700 rounded-full px-6 py-2.5 text-white">
          Get Started
        </button>
      </Link>
    </div>
        <div className="lg:hidden bg-white ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden bg-white pb-4">
          <ul className="flex flex-col items-center gap-5 font-medium">
            <Link href="/about">
              <li>About</li>
            </Link>
          {/* <Link href="/demo"> 
              <li>Demo</li>
            </Link> */} 
            <Link href="/contact">
              <li>Contact Us</li>
            </Link>
            <Link href="/auth/login">
              <li>
                <button className="border border-black rounded-full px-8 py-2 font-medium w-full">
                  Sign In
                </button>
              </li>
            </Link>
            <Link href="/auth/signup">
              <li>
                <button className="bg-blue-700 rounded-full px-6 py-2.5 text-white w-full">
                  Get Started
                </button>
              </li>
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
}
