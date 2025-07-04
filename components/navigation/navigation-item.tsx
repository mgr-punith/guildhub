"use client";

import { useParams, useRouter } from "next/navigation";
import { ActionToolTip } from "../action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <ActionToolTip side="right" align="center" label={name}>
      <button onClick={onClick} className="relative group flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full  transition-all w-1",
            params?.serverId !== id && "group-hover:h-5",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />

        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover: rouded-[16px] transition-all overflow-hidden ",
            params?.serverId === id &&
              "bg-primary/10 rounded-[16px] text-primary "
          )}
        >
          <Image
            src={imageUrl}
            alt="Cover image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </button>
    </ActionToolTip>
  );
};
