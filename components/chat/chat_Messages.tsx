"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "@/components/chat/chat_Welcome";
import { ChatItem } from "@/components/chat/chat_Item";

import { useChatQuery } from "@/hooks/use_ChatQuery";
import { useChatSocket } from "@/hooks/use-chat-socket";

import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { format } from "date-fns";

const DATE_FORMAT = "d MMM yyyy , HH:mm";

type messageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessageProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessageProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages.update`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-50">
          Loading Messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-50">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col ">
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse px-4 py-4">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: messageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                member={message.member}
                currentMember={member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
