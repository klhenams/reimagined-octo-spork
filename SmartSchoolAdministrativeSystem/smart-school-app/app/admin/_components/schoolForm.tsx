"use client";
/** next imports */
import { useState } from "react";
import { useFormState } from "react-dom";

/** component imports */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SSSelect from "@/components/general/forms/ssSelect";
import FormError from "@/components/general/forms/formError";
import SubmitButton from "@/components/general/forms/submitButton";

/** function imports */
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** server actions */
import { addSchool } from "../_actions/school";

const regions = [
  { name: "Greater Accra", value: "GreaterAccraRegion" },
  { name: "Ashanti Region", value: "AshantiRegion" },
];

const districts = [
  { name: "Kumasi", value: "Kumasi" },
  { name: "Adenta", value: "Adenta" },
];

export default function SchoolForm() {
  const [errors, setErrors] = useState<any>();
  // const [errors, action] = useFormState(addSchool, {});
  const action = async (formData: FormData) => {
    const response = await addSchool({}, formData);
    console.log(response)
    if (response && ("errorMessage" in response)){
      console.log(response)
      toast.error(response.errorMessage as string);
    }
    else setErrors(response);
  };
  return (
    <form action={action} className="py-4 flex flex-col gap-8">
      <div className="py-4 flex flex-col gap-4">
        <h2 className="font-semibold">School details</h2>
        <div>
          <Label>Name</Label>
          <Input name="name" />
          {errors && "name" in errors && (
            <FormError>{errors.name![0]}</FormError>
          )}
        </div>
        <div>
          <Label>Region</Label>
          <SSSelect
            name="region"
            options={regions}
            placeholder="Select Region"
          />
          {errors && "region" in errors && (
            <FormError>{errors.region![0]}</FormError>
          )}
        </div>
        <div>
          <Label>District</Label>
          <SSSelect
            name="district"
            options={districts}
            placeholder="Select District"
          />
          {errors && "district" in errors && (
            <FormError>{errors.district![0]}</FormError>
          )}
        </div>
        <div>
          <Label>Image of School Badge</Label>
          <Input name="badgeImage" type="file" accept=".png, .jpg, .jpeg" />
          {errors && "badgeImage" in errors && (
            <FormError>{errors.badgeImage![0]}</FormError>
          )}
        </div>
      </div>
      <div className="py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Administrator Details</h2>
        <div>
          <Label>First Name</Label>
          <Input name="firstName" />
          {errors && "firstName" in errors && (
            <FormError>{errors.firstName![0]}</FormError>
          )}
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="lastName" />
          {errors && "lastName" in errors && (
            <FormError>{errors.lastName![0]}</FormError>
          )}
        </div>
        <div>
          <Label>Other Names</Label>
          <Input name="otherNames" />
          {errors && "otherNames" in errors && (
            <FormError>{errors.otherNames![0]}</FormError>
          )}
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" />
          {errors && "email" in errors && (
            <FormError>{errors.email![0]}</FormError>
          )}
        </div>
        <div>
          <Label>Password</Label>
          <Input name="password" type="password" />
          {errors && "password" in errors && (
            <FormError>{errors.password![0]}</FormError>
          )}
        </div>
        <div>
          <Label>Profile Image</Label>
          <Input name="profileImage" type="file" accept=".png, .jpg, .jpeg" />
          {errors && "profileImage" in errors && (
            <FormError>{errors.profileImage![0]}</FormError>
          )}
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
