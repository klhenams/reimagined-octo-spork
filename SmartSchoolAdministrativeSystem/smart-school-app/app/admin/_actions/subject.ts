"use server";

import { object, z } from "zod";
import db from "@/db/db";
import { redirect } from "next/navigation";

const subjectSchema = z.object({
  code: z
    .string()
    .min(2, "At least 2 characters")
    .max(6, "At most 6 characters")
    .refine((code) => /^[A-Z]+[1-9]+$/.test(code), {
      message:
        "Subject code must begin with at least one capital letter and end with at least 1 number, eg(MAT1)",
    }),
  name: z.string().min(1, "Subject Name must be at least one character long"),
  math_intensive: z.coerce.boolean(),
});

export default async function createSubject(
  prevState: unknown,
  formData: FormData
) {
  const validationResult = subjectSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (validationResult.error)
    return validationResult.error.formErrors.fieldErrors;

  // // check if course code already exists
  const codeExists = !!(await db.subject.findUnique({
    where: { code: validationResult.data.code },
  }));

  if (codeExists) return { errorMessage: "Subject code already exists" };

  // inserts
  await db.subject.create({ data: validationResult.data });

  // redirect after completion
  redirect("/admin/subjects");
}

export async function deleteSubject(subjectId: number) {
  await db.subject.delete({ where: { id: subjectId } });
  redirect("/admin/subjects");
}
