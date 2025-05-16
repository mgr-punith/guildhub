"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import React from "react";

export default function dashboard() {
  return (
    <div>
      <p> You ARE SUCCESSFULLTY SIGNED IN</p>
      <ClerkProvider>
        <UserButton />
      </ClerkProvider>

      <ModeToggle />
    </div>
  );
}
