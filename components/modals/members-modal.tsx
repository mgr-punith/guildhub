"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldMinus,
  ShieldQuestion,
} from "lucide-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel, faSnowflake } from "@fortawesome/free-solid-svg-icons";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { MemberRole } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldMinus className="h-4 w-4 ml-2 text-sky-700" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-red-700" />,
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          memberId,
        },
      });

      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black  overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-xl text-center font-bold">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-xs font-semibold text-zinc-700">
              {server?.members?.length} MEMBERS
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-6 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div
                className="flex items-center gap-x-2 mb-3 bg-zinc-300 p-2 rounded-md"
                key={member.id}
              >
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-600">
                    {member.profile.email}
                  </p>
                </div>
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-800" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="h-4 w-4 mr-1" />
                              <span>ROLE</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "GUEST")
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4 " />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="h-4 w-4 ml-2" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "MODERATOR")
                                  }
                                >
                                  <ShieldCheck className="h-4 w-4" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="h-4 w-4 ml-2" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onKick(member.id)}> 
                            <FontAwesomeIcon
                              icon={faGavel}
                              bounce
                              size="sm"
                              style={{ color: "#FF0000" }}
                            />
                            <p className="text-red-500 font-bold">KICK</p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <FontAwesomeIcon
                    className="ml-auto"
                    icon={faSnowflake}
                    fade
                    style={{ color: "#3a3e45" }}
                  />
                )}
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
