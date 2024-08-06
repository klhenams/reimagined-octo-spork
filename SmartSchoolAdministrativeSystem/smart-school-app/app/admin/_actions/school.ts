"use server";
import { z } from "zod";

/** function imports */
import { saveFilePublic, hashPassword } from "@/app/_utils/utils";

/** database imports */
import db from "@/db/db";
import { redirect } from "next/navigation";

/** types */
import { USER_ROLE } from "@prisma/client";

const requiredMessage = "This field is required";
const fileSizeMessage = "File must be less than 10mb";
const fileSchema = z.instanceof(File, { message: requiredMessage });

const imageSchema = fileSchema.refine(
  (file) => file.size !== 0 || file.type.startsWith("/image"),
  { message: "Please select an image" }
);

const addSchoolSchema = z.object({
  name: z.string().min(1, { message: requiredMessage }),
  region: z.string().min(1, { message: requiredMessage }),
  district: z.string().min(1, { message: requiredMessage }),
  badgeImage: imageSchema.refine(
    (file) => file.size > 0 && file.size < 10 * 1000000,
    {
      message: fileSizeMessage,
    }
  ),
  // section for admin details
  firstName: z.string().min(1, { message: requiredMessage }),
  lastName: z.string().min(1, { message: requiredMessage }),
  otherNames: z
    .string({ message: "This field must only containt alphabets" })
    .optional(),
  email: z.string().email(),
  password: z.string(),
  profileImage: imageSchema.refine(
    (file) => file.size > 0 && file.size < 10 * 1000000,
    { message: fileSizeMessage }
  ),
});

export async function addSchool(prevState: unknown, formData: FormData) {
  const validationResult = addSchoolSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  /** delete all entries */
  // await db.schoolAdministrator.deleteMany();
  // await db.school.deleteMany();
  // await db.user.deleteMany()

  if (!validationResult.success) {
    return validationResult.error.formErrors.fieldErrors;
  }


  const data = validationResult.data;


  // checking if user with that email exists
  const exists = !!(await db.user.findUnique({ where: { email: data.email } }));
  if (exists) return { errorMessage: "user already exists" };



  // add images to appropriate folders
  const badgeImagePath = await saveFilePublic(
    "/images/school_badges",
    data.badgeImage.name,
    data.badgeImage
  );

  const adminImagePath = await saveFilePublic(
    "/images/school_admins",
    data.profileImage.name,
    data.profileImage
  );

  // creating school
  const school = await db.school.create({
    data: {
      name: data.name,
      region: data.region,
      district: data.district,
      badgeImagePath: badgeImagePath,
    },
  });

  // creating user
  const user = await db.user.create({
    data: {
      email: data.email,
      password: hashPassword(data.password),
      role: USER_ROLE.schoolAdmin,
    },
  });

  // creating administrator
  await db.schoolAdministrator.create({
    data: {
      id: user.id,
      first_name: data.firstName,
      last_name: data.lastName,
      other_names: data.otherNames ? data.otherNames : "",
      schoolId: school.id,
      imagePath: adminImagePath,
    },
  });

  redirect("/admin");
}
