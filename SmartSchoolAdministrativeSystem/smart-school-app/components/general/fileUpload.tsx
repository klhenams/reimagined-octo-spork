"use client";
/** react imports */
import { useState, useRef } from "react";

/** icon imports */
import { CloudUploadIcon, XIcon } from "lucide-react";

/** import button */
import { Button } from "../ui/button";

/** function imports */
import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";

export default function FileUpload({
  className,
  name,
}: {
  className?: string;
  name?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    } else setFile(undefined);
  };
  return (
    <div className="relative">
      <label
        htmlFor="file-to-upload"
        className={cn(
          "w-full flex flex-col justify-center items-center rounded-md bg-muted h-96 text-2xl cursor-pointer relative",
          className
        )}
      >
        <CloudUploadIcon className="w-8 h-8" />
        <span>{file ? file.name : "Upload"}</span>
        <input
          name={name}
          onChange={handleChange}
          ref={fileRef}
          id="file-to-upload"
          className="hidden"
          type="file"
          accept=".csv"
        />
      </label>
      {file && (
        <Button
          variant="destructive"
          className="absolute right-4 top-4 w-12  h-12 rounded-full"
          onClick={() => {
            fileRef.current!.value = "";
            setFile(undefined);
          }}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}
