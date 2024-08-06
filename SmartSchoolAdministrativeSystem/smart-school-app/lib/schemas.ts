import z from "zod";

export const csvFileSchema = z
  .instanceof(File, { message: "Please select a file" })
  .refine((file) => file.size > 0 && file.name.split(".").pop() === "csv", {
    message: "Please select a csv file",
  });

export const fileSchema = z.instanceof(File, { message: "Invalid data" });

export const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
  { message: "Please select an image" }
);

export const phoneNumberSchema = z
  .string()
  .refine((value) =>
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(value)
  );
