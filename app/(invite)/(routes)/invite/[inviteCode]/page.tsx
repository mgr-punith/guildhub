import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface INVITECODEPROP {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: INVITECODEPROP) => {
  const profile = await currentProfile();

  const {inviteCode} = await params;

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

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }
  return null;
};

export default InviteCodePage;
