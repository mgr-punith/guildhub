// app/(main)/(routes)/servers/page.tsx (or wherever this file lives)

import { ModeToggle } from "@/components/mode-toggle";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

export default async function Page() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      <p> You ARE SUCCESSFULLTY SIGNED IN</p>
      <ClerkProvider>
        <UserButton />
      </ClerkProvider>
      <ModeToggle />

      <div>
        <InitialModal />
      </div>
    </div>
  );
}
