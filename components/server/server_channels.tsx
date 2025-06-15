"use client";

import { cn } from "@/lib/utils";
import {
  faPencil,
  faTrashCan,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Hash, Lock, Mic, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionToolTip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerChannelsProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const IconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannels = ({
  channel,
  server,
  role,
}: ServerChannelsProps) => {
  const {onOpen} = useModal();
  const router = useRouter();
  const params = useParams();

  const Icon = IconMap[channel.type];

  return (
    <button
      onClick={() => {}}
      className={cn(
        "group relative px-2 py-1.5 w-full rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10  hover:dark:bg-zinc-700/50  transition ",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm   text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2 ">
          <ActionToolTip label="Edit">
            <FontAwesomeIcon
              onClick={()=>onOpen("editChannel", {server, channel})}
              className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300  opacity-0 group-hover:opacity-100 transition-opacity duration-200 "
              icon={faPencil}
            />
          </ActionToolTip>
          <ActionToolTip label="Delete">
            <FontAwesomeIcon
              onClick={()=>onOpen("deleteChannel", {server, channel})}
              className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300  opacity-0 group-hover:opacity-100 transition-opacity duration-200 "
              icon={faTrashCan}
            />
          </ActionToolTip>
        </div>
      )}

      {channel.name === "general" && (
        <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400 ml-auto" />
      )}
    </button>
  );
};
