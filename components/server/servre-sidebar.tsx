import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentUser();

  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const currentMember = server?.members.find(
    (member) => member.profile.userId === profile.id
  );
  const role = currentMember?.role

  if (!server) {
    return redirect("/");
  }
  

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-zinc-200 shadow-lg">
      <ServerHeader server={server} role={role} />
    </div>
  );
};
