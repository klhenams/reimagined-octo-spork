"use client";
/** react imports */
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";

/** component imports */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SSSelect from "@/components/general/forms/ssSelect";
import DateInput from "@/components/general/forms/dateInput";
import SubmitButton from "@/components/general/forms/submitButton";
import { objectToOptions } from "@/lib/utils";
import { ProfileImageUpload } from "@/components/general/forms/imageUpload";
import FormError from "@/components/general/forms/formError";
import { toast } from "sonner";

import { Country, State, City, IState, ICity } from "country-state-city";

/** prisma imports */
import { GENDER, EDUCATION } from "@prisma/client";

/** server actions */
import {
  addTeacher,
  getTeacherDetails,
  updateTeacher,
} from "@/app/(school)/school_admin/_actions/teachers";
import { redirect, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function TeacherForm({
  subjects,
}: {
  subjects: { id: number; code: string; name: string }[];
}) {
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");

  const {
    data: teacherData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teacher-data"],
    queryFn: async () => {
      if (teacherId) return await getTeacherDetails(teacherId);
    },
    refetchOnWindowFocus: false,
  });

  const [state, action] = useFormState(
    teacherId
      ? updateTeacher.bind(null, teacherId, teacherData?.imagePath)
      : addTeacher,
    {}
  );
  const countries = Country.getAllCountries();
  const [statesData, setstatesData] = useState<IState[]>();
  const [citiesData, setCitiesData] = useState<ICity[]>();

  const [countryCode, setCountryCode] = useState<string>("GH");
  const [stateCode, setStateCode] = useState<string>(
    State.getStatesOfCountry("GH")[0].isoCode
  );
  const [city, setCity] = useState<string>(
    City.getCitiesOfState("GH", State.getStatesOfCountry("GH")[0].isoCode)[0]
      .name
  );

  useEffect(() => {
    setstatesData(State.getStatesOfCountry(countryCode ?? undefined));
  }, [countryCode]);

  useEffect(() => {
    setCitiesData(
      City.getCitiesOfState(countryCode ?? undefined, stateCode ?? undefined)
    );
  }, [stateCode]);

  useEffect(() => {
    statesData && setStateCode(statesData[0].isoCode);
  }, [statesData]);

  useEffect(() => {
    citiesData && setCity(citiesData[0].name);
  }, [citiesData]);

  if (!state.success && state.errorMessage) {
    toast.error(state.errorMessage);
    delete state.errorMessage;
  }

  if (state?.success) {
    setTimeout(() => {
      redirect("/school_admin/teachers");
    }, 1000);
    toast.success(
      teacherId ? "Successfully updated profile" : "Successfully added teacher"
    );
    delete state.success;
  }

  if (teacherId && isLoading) {
    return (
      <div className="flex justify-center items-center">Fetching data ...</div>
    );
  }

  return (
    <form action={action} className="py-4 flex flex-col gap-8 w-full">
      {/************ PROFILE IMAGE [start]****************/}
      <div className="w-full flex justify-center py-4 flex-col items-center gap-4">
        Teacher's Image
        <ProfileImageUpload
          name="image"
          defaultValue={teacherData?.imagePath}
        />
        <FormError>{state.fieldErrors?.image}</FormError>
      </div>
      {/************ PROFILE IMAGE [end]****************/}
      {/************ PERSONAL INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input name="first_name" defaultValue={teacherData?.first_name} />
            <FormError>{state.fieldErrors?.first_name}</FormError>
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="last_name" defaultValue={teacherData?.last_name} />
            <FormError>{state.fieldErrors?.last_name}</FormError>
          </div>
          <div>
            <Label>Other Names</Label>
            <Input name="other_names" defaultValue={teacherData?.other_names} />
            <FormError>{state.fieldErrors?.other_names}</FormError>
          </div>
          <div>
            <Label>Age</Label>
            <Input
              name="age"
              type="number"
              min={5}
              max={50}
              defaultValue={teacherData?.age}
            />
            <FormError>{state.fieldErrors?.age}</FormError>
          </div>
          <div>
            <Label>Gender</Label>
            <SSSelect
              options={objectToOptions(GENDER)}
              name="gender"
              defaultValue={teacherData?.gender}
            />
            <FormError>{state.fieldErrors?.gender}</FormError>
          </div>
          <div>
            <Label>Date of Birth</Label>
            <DateInput
              name="dob"
              defaultValue={teacherData?.dob.toDateString()}
            />
            <FormError>{state.fieldErrors?.dob}</FormError>
          </div>
          <div>
            <Label>Country</Label>
            <SSSelect
              defaultValue={teacherData?.country ? teacherData.state : "GH"}
              name="country"
              options={countries.map((country) => ({
                name: country.name,
                value: country.isoCode,
              }))}
              onValueChange={setCountryCode}
            />
            <FormError>{state.fieldErrors?.country}</FormError>
          </div>
          <div>
            <Label>State</Label>
            <SSSelect
              defaultValue={
                teacherData?.state
                  ? teacherData?.state
                  : statesData
                  ? statesData[0].isoCode
                  : ""
              }
              name="state"
              options={statesData?.map((state) => ({
                name: state.name,
                value: state.isoCode,
              }))}
              onValueChange={setStateCode}
            />
            <FormError>{state.fieldErrors?.state}</FormError>
          </div>
          <div>
            <Label>City</Label>
            <SSSelect
              name="city"
              defaultValue={teacherData?.city}
              options={citiesData?.map((city) => ({
                name: city.name,
                value: city.name,
              }))}
              onValueChange={setCity}
            />
            <FormError>{state.fieldErrors?.city}</FormError>
          </div>
        </div>
      </div>
      {/************ EDUCATION INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Education Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Highest Educational Level</Label>
            <SSSelect
              name="educational_level"
              options={objectToOptions(EDUCATION)}
              defaultValue={teacherData?.educational_level}
            />
            <FormError>{state.fieldErrors?.educational_level}</FormError>
          </div>
          <div>
            <Label>Length of Service</Label>
            <Input
              type="number"
              min={0}
              name="length_of_service"
              defaultValue={teacherData?.length_of_service}
            />
            <FormError>{state.fieldErrors?.length_of_service}</FormError>
          </div>
          <div>
            <Label>Number of Educational Seminars Attended</Label>
            <Input
              type="number"
              min={0}
              name="num_seminars_attended"
              defaultValue={teacherData?.num_seminars_attended}
            />
            <FormError>{state.fieldErrors?.num_seminars_attended}</FormError>
          </div>
          <div>
            <Label>Subject</Label>
            <SSSelect
              name="subjectId"
              defaultValue={teacherData?.subjectId.toString()}
              options={subjects.map((subject) => ({
                name: `${subject.code}-${subject.name}`,
                value: subject.id.toString(),
              }))}
            />
            <FormError>{state.fieldErrors?.subjectId}</FormError>
          </div>
        </div>
      </div>
      {/************ EDUCATION INFORMATION [end]****************/}
      {/************ ACCOUNT INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input
              type="text"
              min={0}
              name="email"
              defaultValue={teacherData?.user.email}
            />
            <FormError>{state.fieldErrors?.email}</FormError>
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              type="text"
              min={0}
              name="phone_number"
              defaultValue={teacherData?.phone_number ?? undefined}
            />
            <FormError>{state.fieldErrors?.email}</FormError>
          </div>
          {!teacherId && (
            <div>
              <Label>Password</Label>
              <Input type="password" min={0} name="password" />
              <FormError>{state.fieldErrors?.password}</FormError>
            </div>
          )}
        </div>
      </div>
      {/************ ACCOUNT INFORMATION [end]****************/}
      <SubmitButton />
    </form>
  );
}
