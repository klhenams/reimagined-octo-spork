"use client";
/** react imports */
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";

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
import { useQuery } from "@tanstack/react-query";

import { Country, State, City, IState, ICity } from "country-state-city";

/** prisma imports */
import {
  GENDER,
  FAMILY_SIZE,
  JOB,
  PARENT_STATUS,
  EDUCATION,
  GUARDIAN,
  ADDRESS_TYPE,
  TRAVEL_TIME,
  SCHOOL_CHOICE_REASON,
  WEEKLY_STUDY_TIME,
} from "@prisma/client";

/** server actions */
import {
  addStudent,
  updateStudentDetails,
  getStudentDetails,
} from "@/app/(school)/school_admin/_actions/student";

export default function StudentForm({
  courses,
}: {
  courses: { id: number; code: string; name: string }[];
}) {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const {
    data: studentData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-data"],
    queryFn: async () => {
      if (studentId) return await getStudentDetails(studentId);
      else return null;
    },
    refetchOnWindowFocus: false,
  });


  const [state, action] = useFormState(studentId ? updateStudentDetails.bind(null, studentId, studentData?.imagePath??undefined) : addStudent, {});
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

  if (!state?.success && state?.errorMessage) {
    toast.error(state.errorMessage);
  }

  if(state?.success){
    toast.success(studentId ? "Successfully updated profile" : "Successfully added student")
    delete state.success;
  }

  if (studentId && isLoading) {
    return (
      <div className="flex justify-center items-center">Fetching data ...</div>
    );
  }

  return (
    <form action={action} className="py-4 flex flex-col gap-8 w-full">
      {/************ PROFILE IMAGE [start]****************/}
      <div className="w-full flex justify-center py-4 flex-col items-center gap-4">
        Student Image
        <ProfileImageUpload name="image" defaultValue={studentData?.imagePath as string} />
        <FormError>{state?.fieldErrors?.image}</FormError>
      </div>
      {/************ PROFILE IMAGE [end]****************/}
      {/************ PERSONAL INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input name="first_name" defaultValue={studentData?.first_name} />
            <FormError>{state?.fieldErrors?.first_name}</FormError>
          </div>
          <div>
            <Label>Last Name</Label>
            <Input name="last_name" defaultValue={studentData?.last_name} />
            <FormError>{state?.fieldErrors?.last_name}</FormError>
          </div>
          <div>
            <Label>Other Names</Label>
            <Input name="other_names" defaultValue={studentData?.other_names} />
            <FormError>{state?.fieldErrors?.other_names}</FormError>
          </div>
          <div>
            <Label>Age</Label>
            <Input
              name="age"
              type="number"
              min={5}
              max={30}
              defaultValue={studentData?.age}
            />
            <FormError>{state?.fieldErrors?.age}</FormError>
          </div>
          <div>
            <Label>Gender</Label>
            <SSSelect
              options={objectToOptions(GENDER)}
              name="gender"
              defaultValue={studentData?.gender}
            />
            <FormError>{state?.fieldErrors?.gender}</FormError>
          </div>
          <div>
            <Label>Date of Birth</Label>
            <DateInput
              name="dob"
              defaultValue={studentData?.dob.toDateString()}
            />
            <FormError>{state?.fieldErrors?.dob}</FormError>
          </div>
          <div className="col-span-2">
            <Label>Address Type</Label>
            <SSSelect
              options={objectToOptions(ADDRESS_TYPE)}
              name="address_type"
              defaultValue={studentData?.address_type}
            />
            <FormError>{state?.fieldErrors?.address_type}</FormError>
          </div>
          <div>
            <Label>Country</Label>
            <SSSelect
              disabled
              defaultValue="GH"
              name="country"
              options={countries.map((country) => ({
                name: country.name,
                value: country.isoCode,
              }))}
              onValueChange={setCountryCode}
            />
          </div>
          <div>
            <Label>State</Label>
            <SSSelect
              defaultValue={
                studentData?.state
                  ? studentData?.state
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
            <FormError>{state?.fieldErrors?.state}</FormError>
          </div>
          <div>
            <Label>City</Label>
            <SSSelect
              name="city"
              options={citiesData?.map((city) => ({
                name: city.name,
                value: city.name,
              }))}
              onValueChange={setCity}
              defaultValue={studentData?.city}
            />
            <FormError>{state?.fieldErrors?.city}</FormError>
          </div>
        </div>
      </div>
      {/************ PERSONAL INFORMATION [end]****************/}
      {/************ FAMILY INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Family Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Family Size</Label>
            <SSSelect
              name="family_size"
              options={objectToOptions(FAMILY_SIZE)}
              defaultValue={studentData?.family_size}
            />
            <FormError>{state?.fieldErrors?.family_size}</FormError>
          </div>
          <div>
            <Label>Parent Status</Label>
            <SSSelect
              name="parent_status"
              options={objectToOptions(PARENT_STATUS)}
              defaultValue={studentData?.parent_status}
            />
            <FormError>{state?.fieldErrors?.parent_status}</FormError>
          </div>
          <div>
            <Label>Mother&apos;s Job</Label>
            <SSSelect
              name="mother_job"
              options={objectToOptions(JOB)}
              defaultValue={studentData?.mother_job}
            />
            <FormError>{state?.fieldErrors?.mother_job}</FormError>
          </div>
          <div>
            <Label>Father&apos;s Job</Label>
            <SSSelect
              name="father_job"
              options={objectToOptions(JOB)}
              defaultValue={studentData?.father_job}
            />
            <FormError>{state?.fieldErrors?.father_job}</FormError>
          </div>
          <div>
            <Label>Mother&apos;s Education</Label>
            <SSSelect
              name="mother_education"
              options={objectToOptions(EDUCATION)}
              defaultValue={studentData?.mother_education}
            />
            <FormError>{state?.fieldErrors?.mother_education}</FormError>
          </div>
          <div>
            <Label>Father&apos;s Education</Label>
            <SSSelect
              name="father_education"
              options={objectToOptions(EDUCATION)}
              defaultValue={studentData?.father_education}
            />
            <FormError>{state?.fieldErrors?.father_education}</FormError>
          </div>
          <div>
            <Label>Guardian</Label>
            <SSSelect
              name="guardian"
              options={objectToOptions(GUARDIAN)}
              defaultValue={studentData?.guardian}
            />
            <FormError>{state?.fieldErrors?.guardian}</FormError>
          </div>
          <div>
            <Label>
              Family Relationship <small>(How close are you to family)</small>
            </Label>
            <Input
              type="number"
              name="family_relationship"
              min={1}
              max={5}
              defaultValue={studentData?.family_relationship}
            />
            <FormError>{state?.fieldErrors?.family_relationship}</FormError>
          </div>
        </div>
      </div>
      {/************ FAMILY INFORMATION [end]****************/}
      {/************ EDUCATION INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Education Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              School Choice Reaason <small>(Reason for chooing school)</small>
            </Label>
            <SSSelect
              name="school_choice_reason"
              options={objectToOptions(SCHOOL_CHOICE_REASON)}
              defaultValue={studentData?.school_choice_reason}
            />
            <FormError>{state?.fieldErrors?.school_choice_reason}</FormError>
          </div>
          <div>
            <Label>
              Travel Time <small>(Time to travel to school)</small>
            </Label>
            <SSSelect
              name="travel_time"
              options={objectToOptions(TRAVEL_TIME)}
              defaultValue={studentData?.travel_time}
            />
            <FormError>{state?.fieldErrors?.travel_time}</FormError>
          </div>
          <div>
            <Label>
              Nursery School <small>(Did you attend nursery)</small>
            </Label>
            <SSSelect
              name="nursery_school"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.nursery_school ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.nursery_school}</FormError>
          </div>
          <div>
            <Label>
              Family Support{" "}
              <small>(Does you your family support your education)</small>
            </Label>
            <SSSelect
              name="family_support"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.family_support ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.family_support}</FormError>
          </div>
          <div>
            <Label>
              School Support <small>(Do you receive financial aid)</small>
            </Label>
            <SSSelect
              name="school_support"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.school_support ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.school_support}</FormError>
          </div>
          <div>
            <Label>
              Extracurricular{" "}
              <small>(Do you or will you take extra activities)</small>
            </Label>
            <SSSelect
              name="activities"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.activities ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.activities}</FormError>
          </div>
          <div>
            <Label>
              Extra Paid Classes <small>(Do you take extra classes)</small>
            </Label>
            <SSSelect
              name="extra_paid_classes"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.extra_paid_classes ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.extra_paid_classes}</FormError>
          </div>
          <div>
            <Label>
              Higher Education <small>(Do you plan to go to college)</small>
            </Label>
            <SSSelect
              name="higher_ed"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.higher_ed ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.higher_ed}</FormError>
          </div>
          <div className="col-span-2">
            <Label>
              Study Time <small>(Average weekly study time)</small>
            </Label>
            <SSSelect
              name="study_time"
              options={objectToOptions(WEEKLY_STUDY_TIME)}
              defaultValue={studentData?.study_time}
            />
            <FormError>{state?.fieldErrors?.study_time}</FormError>
          </div>
        </div>
      </div>
      {/************ EDUCATION INFORMATION [end]****************/}
      {/************ OTHER INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Other Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              Internet Access <small>(Do you have internet access)</small>
            </Label>
            <SSSelect
              name="internet_access"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.internet_access ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.internet_access}</FormError>
          </div>
          <div>
            <Label>
              Romantic Relationship{" "}
              <small>(Are you in a romantic relationship)</small>
            </Label>
            <SSSelect
              name="romantic_relationship"
              options={[
                { name: "Yes", value: "yes" },
                { name: "No", value: "no" },
              ]}
              defaultValue={studentData?.romantic_relationship ? "yes" : "no"}
            />
            <FormError>{state?.fieldErrors?.romantic_relationship}</FormError>
          </div>
          <div>
            <Label>
              Free Time{" "}
              <small>(On a scale of 1 to 5, how social are you)</small>
            </Label>
            <Input
              type="number"
              name="free_time"
              min={1}
              max={5}
              defaultValue={studentData?.free_time}
            />
            <FormError>{state?.fieldErrors?.free_time}</FormError>
          </div>
          <div>
            <Label>
              Social <small>On a scale of 1 to 5, how social are you</small>
            </Label>
            <Input
              type="number"
              name="social"
              min={1}
              max={5}
              defaultValue={studentData?.social}
            />
            <FormError>{state?.fieldErrors?.social}</FormError>
          </div>
        </div>
      </div>
      {/************ OTHER INFORMATION [end]****************/}
      {/************ ADMISSION INFORMATION [start]****************/}
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Admission Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Course</Label>
            <SSSelect
              name="courseId"
              options={courses.map((course) => ({
                name: `${course.code}-${course.name}`,
                value: course.id.toString(),
              }))}
              defaultValue={studentData?.courseId.toString()}
            />
            <FormError>{state?.fieldErrors?.courseId}</FormError>
          </div>
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              name="year"
              min={1}
              max={6}
              defaultValue={studentData?.year}
            />
            <FormError>{state?.fieldErrors?.year}</FormError>
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" defaultValue={studentData?.email??undefined} />
            <FormError>{state?.fieldErrors?.email}</FormError>
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input name="phone_number" defaultValue={studentData?.phone_number??undefined} />
            <FormError>{state?.fieldErrors?.phone_number}</FormError>
          </div>
        </div>
      </div>
      {/************ ADMISSION INFORMATION [end]****************/}
      <SubmitButton />
    </form>
  );
}
