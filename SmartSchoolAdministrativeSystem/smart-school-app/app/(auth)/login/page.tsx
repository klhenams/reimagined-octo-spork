/** component imports */
import LoginForm from "../_components/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSAS | Login"
}

export default async function LoginPage() {
  return (
    <div className="w-screen h-screen flex flex-col gap-8 justify-center items-center bg-gray-200">
      <h1 className="text-ssGray-300 text-4xl">
        Welcome, Log into you account
      </h1>
      <LoginForm />
    </div>
  );
}
