"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLoading(true);
      // Wait for 3 seconds before redirecting
      const timeout = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      // Clean up timeout if component unmounts
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-fuchsia-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-e-white border-solid" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div>
        <p className="text-center bg-gray-900 px-16 py-16 font-bold rounded-2xl text-white text-8xl">
          This is our guildhub site
        </p>
      </div>
      <div className="mt-10 hover:cursor-pointer">
        <Button
          onClick={() => {
            router.push(`/signin`);
          }}
        >
          Click
        </Button>
      </div>
    </div>
  );
}
