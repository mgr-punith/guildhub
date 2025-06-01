import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { ChannelType, MemberRole } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faVideo } from "@fortawesome/free-solid-svg-icons";

import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ScrollArea } from "../ui/scroll-area";
import { MicIcon, ShieldMinusIcon, ShieldUser } from "lucide-react";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: (
    <FontAwesomeIcon className="mr-2 h-4 w-4 text-gray-300" icon={faHashtag} />
  ),
  [ChannelType.AUDIO]: <MicIcon className="mr-2 h-4 w-4 text-gray-300" />,
  [ChannelType.VIDEO]: (
    <FontAwesomeIcon className="mr-2 h-4 w-4 text-gray-300" icon={faVideo} />
  ),
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldMinusIcon className="h-4 w-4 text-sky-600" />,
  [MemberRole.ADMIN]: <ShieldUser className="h-4 w-4 text-rose-700" />,
};
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

  const member = server?.members.find(
    (member) => member.profile.userId === profile.id
  );
  const role = member?.role;

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-zinc-200 shadow-lg">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channel",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channel",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channel",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: server?.members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
