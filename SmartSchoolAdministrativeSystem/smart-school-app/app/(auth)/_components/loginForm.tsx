"use client";
/** next imports */
import { useFormState } from "react-dom";

/** component imports */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/general/forms/submitButton";

/**server actions */
import { authenticate } from "../_actions/authentication";

export default function LoginForm() {
  const [errors, action] = useFormState(authenticate, undefined);
  return (
    <form
      action={action}
      className="p-8 py-24 w-full max-w-lg bg-white flex flex-col justify-center items-center gap-4"
    >
        <Input
          name="email"
          placeholder="Enter your email"
          className="w-full max-w-72 h-10 py-6 text-sm"
        />
        <Input
          name="password"
          type="password"
          placeholder="Enter Password"
          className="w-full max-w-72 h-10 py-6 text-sm"
        />
      <div className="flex justify-center items-center w-full">
        <SubmitButton className="w-full max-w-72 h-10 rounded-md p-0 py-2" />
      </div>
      {errors && <span className="text-red-500">{errors}</span>}
    </form>

  );
}
