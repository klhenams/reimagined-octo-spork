import fs from "fs/promises"
import path from "path";
import bcrypt from "bcryptjs";
import { existsSync } from "fs";

/** function to save file */
export async function saveFilePublic(
  dirPath: string,
  saveName: string,
  file: File
) {
  const folderPath = path.join("public", dirPath);
  await fs.mkdir(folderPath, { recursive: true });
  const fileName = `${crypto.randomUUID()}-${saveName}`;
  const filePath = path.join(folderPath, fileName);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return path.join(dirPath, fileName);
}

export async function deleteFile(filePath: string){
  if(existsSync(filePath)){
    await fs.unlink(filePath);
  }
}

/** function to hash password */
export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/** function to compare hash with plain text */
export function comparePasswords(plainText: string, hash: string) {
  return bcrypt.compareSync(plainText, hash);
}

/** function to encrypt password */
