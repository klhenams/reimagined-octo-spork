"use client";

import React, { useState } from "react";
import axiosInstance from "@/app/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);  
    try {
      const response = await axiosInstance.post("/user/login/", {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        setSuccess("Login successful");
        localStorage.setItem("userAccessToken", response.data.access);
        localStorage.setItem("userRefreshToken", response.data.refresh);
        // Redirect or perform additional actions here
        router.push('../dashboard')
        
      }
    } catch (error) {
      if (error.response.status === 401) {
        setError("Email or password must be incorrect");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);  // Set loading to false when login ends
    }
    
  };

  return (
    <div className="w-full md:w-2/3">
      <h2 className="text-3xl font-medium text-zinc-800 font-poppins mb-8">
        Log in
      </h2>

      <button className="w-full h-12 bg-white border border-zinc-800 rounded-3xl flex items-center justify-center gap-4 mb-4">
        <img src="/images/google.png" alt="Google Icon" className="w-6 h-6" />
        <span className="text-xl font-thin text-zinc-800 font-inter">
          Continue with Google
        </span>
      </button>

      <div className="flex items-center gap-6 my-6">
        <div className="flex-grow h-px bg-stone-500/25"></div>
        <span className="text-lg font-thin text-stone-500 font-inter">OR</span>
        <div className="flex-grow h-px bg-stone-500/25"></div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
            required
          />
        </div>
        <div className="mb-2 flex justify-end text-zinc-800 font-normal underline">
          <Link href="./recovery">Forget password?</Link>
        </div>
        <button
          type="submit"
          className="w-full h-12 bg-blue-700 rounded-3xl text-white text-xl font-medium font-lato"
        >
          {loading && (
            <span className="loading loading-spinner loading-sm mr-2"></span>
          )}
          Log in
        </button>
      </form>
      <div className="mt-4 text-center flex gap-2 justify-center">
        <span className="text-zinc-800 text-base font-normal font-poppins">
          Don&apos;t have an account?
        </span>
        <Link href="./signup">
          <p className="text-neutral-900 text-base font-normal font-poppins underline">
            Sign up
          </p>
        </Link>
      </div>
    </div>
  );
}
