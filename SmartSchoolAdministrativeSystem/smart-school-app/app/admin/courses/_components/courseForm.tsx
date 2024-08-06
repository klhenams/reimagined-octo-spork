"use client";
/** react imports */
import { useState, useEffect } from "react";

/** component imports */
import SubmitButton from "@/components/general/forms/submitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormError from "@/components/general/forms/formError";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { toast } from "sonner";

import { createCourse } from "../../_actions/course";

export default function CourseForm({
  subjects,
}: {
  subjects?: { id: number; code: string; name: string }[];
}) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>();
  if(errors && "errorMessage" in errors){
    toast.error(errors.errorMessage);
    setErrors(null);
  }


  const action = async (formData: FormData) => {
    const data = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      subjects: selectedSubjects,
    };
    const response = await createCourse(data);
    setErrors(response);
  };


  return (
    <form action={action} className="py-4 flex flex-col gap-8">
      <div>
        <Label>Course Code</Label>
        <Input name="code" />
        {errors && "code" in errors && <FormError>{errors.code![0]}</FormError>}
      </div>
      <div>
        <Label>Course Name</Label>
        <Input name="name" />
        {errors && "name" in errors && <FormError>{errors.name![0]}</FormError>}
      </div>

      <div>
        <MultiSelector
          values={selectedSubjects}
          onValuesChange={setSelectedSubjects}
          loop
          className="w-full"
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select course subjects" />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {subjects &&
                subjects.map((subject, index) => (
                  <MultiSelectorItem key={index} value={subject.id.toString()} >
                    {subject.code}-{subject.name}
                  </MultiSelectorItem>
                ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
        {errors && "subjects" in errors && (
          <FormError>{errors.subjects![0]}</FormError>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
