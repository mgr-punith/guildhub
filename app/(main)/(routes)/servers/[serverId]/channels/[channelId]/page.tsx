import { ChatHeader } from "@/components/chat/chat_header";
import { ChatInput } from "@/components/chat/chat_Input";
import { ChatMessages } from "@/components/chat/chat_Messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  const { redirectToSignIn } = await auth();
  const { channelId } = await params;
  const { serverId } = await params;

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />

      <div className="flex-1  hide-scrollbar ">
        <ChatMessages
          name={channel.name}
          chatId={channel.id}
          member={member}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="api/socket/messages"
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
          paramKey="channelId"
          paramValue={channel.id}
        />
      </div>

      <div className="px-4 pb-4">
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      </div>
    </div>
  );
};
export default ChannelIdPage;
