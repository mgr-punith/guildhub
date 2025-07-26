import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Option 1: Use Next.js built-in PageProps type
// type PageProps = {
//   params: Promise<{ inviteCode: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// Option 2: Or define it more explicitly
interface INVITECODEPROP {
  params: Promise<{ inviteCode: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const InviteCodePage = async ({ params }: INVITECODEPROP) => {
  const profile = await currentProfile();

  // Await the params Promise
  const { inviteCode } = await params;

  if (!profile) {
    return <RedirectToSignIn />;
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // Check if user is already a member before creating a new membership
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;