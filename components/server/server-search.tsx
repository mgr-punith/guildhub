"use client";

import { Search } from "lucide-react";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data: {
      icon: React.ReactNode;
      name: string;
      id: string;
    }[];
  }[];
}
export const ServerSearch = ({ data }: ServerSearchProps) => {
  return (
    <>
      <button className="px-4 py-2 rounded-md flex justify-between items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition border ">
        <p className="text-sm">Search....</p>
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </button>
    </>
  );
};
