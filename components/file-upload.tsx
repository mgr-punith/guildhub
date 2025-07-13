"use client";

import { UploadDropzone } from "@/lib/uploadthing";

import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

export const FileUplaod = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-28 w-28">
        <Image
          fill
          style={{ objectFit: "cover" }}
          src={value}
          alt="upload"
          className="rounded-full"
        />
        <button
          onClick={() => {
            onChange("");
          }}
          className="bg-red-600 text-white p-1 rounded-full absolute top-0 right-0 shadow-2xl"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 rounded-md bg-background/10 ">
        <FontAwesomeIcon
          icon={faFilePdf}
          bounce
          className="h-10 w-10  fill-red-400 stroke-red-600 "
        />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferer"
          className="ml-2 text-sm text-red-500 dark:text-red-300 hover:underline"
        >
          {value}
        </a>
      </div>
    );
  }
  return (
    <div>
      <UploadDropzone
        className="h-52 w-52 shadow-xl text-black bg-indigo-200 
           ut-label:text-lg 
           ut-allowed-content:ut-uploading:text-red-300 
           ut-ready:bg-black"
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].ufsUrl);
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
        }}
        onUploadBegin={(name) => {
          console.log("Uploading: ", name);
        }}
      />
    </div>
  );
};
