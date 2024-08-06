"use client";
/** react imports */
import { useState, useRef } from "react";

/** icon imports */
import { CloudUploadIcon, XIcon } from "lucide-react";

/** component imports */
import { Button } from "@/components/ui/button";
import SubmitButton from "./submitButton";

/** function imports */
import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";

export default function FileUploadForm({
  className,
  name,
  action,
}: {
  className?: string;
  name?: string;
  action?: string | ((formData: FormData) => void) | undefined
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (fileRef.current!.value) {
      const nameList = fileRef.current!.value.split("\\");
      setFileName(nameList[nameList.length - 1]);
    }
    console.log(!!fileName)
  };
  return (
    <form className="relative">
      <label
        htmlFor="file-to-upload"
        className={cn(
          "w-full flex flex-col justify-center items-center rounded-md bg-muted h-96 text-2xl cursor-pointer relative",
          className
        )}
      >
        <CloudUploadIcon className="w-8 h-8" />
        <span>{fileName ? fileName : "Upload"}</span>
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
      {fileName && (
        <Button
          variant="destructive"
          className="absolute right-4 top-4 w-12  h-12 rounded-full"
          onClick={() => {
            fileRef.current!.value = "";
            setFileName("");
          }}
        >
          <XIcon />
        </Button>
      )}
      <SubmitButton className="w-full mt-4 py-12" disabled={!fileName} />
    </form>
  );
}
