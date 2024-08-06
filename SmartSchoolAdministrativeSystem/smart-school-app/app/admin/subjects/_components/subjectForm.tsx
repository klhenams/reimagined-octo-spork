"use client";

/** react imports */
import { useFormState } from "react-dom";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import SubmitButton from "@/components/general/forms/submitButton";
import FormError from "@/components/general/forms/formError";
import { toast } from "sonner";

/** actions */
import createSubject from "../../_actions/subject";

export default function SubjectForm() {
  const [errors, action] = useFormState(createSubject, {});
  if(errors && "errorMessage" in errors){
    toast.error(errors.errorMessage);
  }
  return (
    <form action={action} className="py-4 flex flex-col gap-8">
      <div>
        <Label>Subject Code</Label>
        <Input name="code" />
        {errors && ("code" in errors) && <FormError>{errors.code![0]}</FormError>}
      </div>
      <div>
        <Label>Subject Name</Label>
        <Input name="name" />
        {errors && ("name" in errors) && <FormError>{errors.name![0]}</FormError>}
      </div>
      <div className="flex gap-4 items-center">
        <Checkbox id="math_intensive_check" name="math_intensive" />
        <Label htmlFor="math_intensive_check">Math Intensive</Label>
        {errors && ("math_intensive" in errors) && <FormError>{errors.math_intensive![0]}</FormError>}
      </div>
      <SubmitButton />
    </form>
  );
}
