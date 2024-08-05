"use client";
import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); 

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must have a minimum of 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/user/create-user/", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setSuccess("Signup successful!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // console.log(response.status);
      // redirect to login
      router.push("./login");
    } catch (err) {
      if (err.response.status === 400) {
        setError("An account with this email already exists");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);  // Set loading to false when signup ends
    }
    
  };

  return (
    <div className="">
      <h2 className="text-3xl font-medium text-zinc-800 font-poppins mb-8">
        Sign up
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

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col w-1/2">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
            required
          />
        </div>

        <div className="mb-8">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-blue-700 rounded-3xl text-white text-xl font-medium font-lato"
        >
          {loading && (
            <span className="loading loading-spinner loading-sm mr-2"></span>
          )}
          Sign up
        </button>
      </form>

      <div className="mt-4 text-center flex gap-2 justify-center">
        <span className="text-zinc-800 text-base font-normal font-poppins">
          Already have an account?
        </span>
        <Link href="./login">
          <p className="text-neutral-900 text-base font-normal font-poppins underline">
            Log in
          </p>
        </Link>
      </div>
    </div>
  );
}
