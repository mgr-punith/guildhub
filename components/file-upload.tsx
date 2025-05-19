"use client";

import { UploadDropzone } from "@/lib/uploadthing";
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
  return (
    <div>
      <UploadDropzone
        className="h-52 w-52 shadow-xl text-black bg-indigo-200 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 ut-ready:bg-black"
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
