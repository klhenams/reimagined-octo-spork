"use server"
import z from "zod";
import db from "@/db/db";
import { redirect } from "next/navigation";

const courseSchema = z.object({
  code: z
    .string()
    .min(2, "At least 2 characters")
    .max(6, "At most 6 characters")
    .refine((code) => /^[A-Z]+[1-9]+$/.test(code), {
      message:
        "Course code must begin with at least one capital letter and end with at least 1 number, eg(MAT1)",
    }),
  name: z.string().min(1, "Field required"),
  subjects: z
    .string()
    .array()
    .min(1, "A course must have at least one subject"),
});

export async function createCourse(data: {
  name: string;
  code: string;
  subjects: string[];
}) {
  const validationResult = courseSchema.safeParse(data);

  if (!validationResult.success)
    return validationResult.error.formErrors.fieldErrors;

  data = validationResult.data;
  // check if course code already exists
  const codeExists = !!(await db.course.findUnique({
    where: { code: data.code },
  }));
  if (codeExists) return { errorMessage: "Course code already exists" };

  try {
    const newCourse = await db.course.create({
      data: {
        code: data.code,
        name: data.name,
      },
    });

    await db.course.update({
      where: { id: newCourse.id },
      data: {
        subjects: {
          set: data.subjects.map((subject) => ({ id: parseInt(subject) })),
        },
      },
    });
  } catch (error: any) {
    return { errorMessage: error.message };
  }

  redirect("/admin/courses")
}

export async function getAllSubjects() {
  return await db.subject.findMany({
    select: {
      id: true,
      code: true,
      name: true,
    },
  });

}
