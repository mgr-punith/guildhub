import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProp {
  params: { serverId: string };
}

const serverIdPage = async ({ params }: ServerIdPageProp) => {
  const profile = await currentProfile();
  const { redirectToSignIn } = await auth();
  const { serverId } = await params;

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    console.log("CREATE THE NEW SERVER");
  }
  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
};
export default serverIdPage;
