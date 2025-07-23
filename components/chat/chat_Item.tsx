"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/action-tooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Edit, ShieldAlert, ShieldMinus, Trash } from "lucide-react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldMinus className="h-4 w-4 ml-2 text-sky-700" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-red-700" />,
};

const fromSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      content: content,
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full ">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center ">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionToolTip label={member.role}>
                {roleIconMap[member.role]}
              </ActionToolTip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-lg mt-2 border flex items-center bg-secondary h-64 w-64"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover rounded-lg"
              />
            </a>
          )}
          {isPdf && (
            <div>
              <div className="relative flex items-center p-2 rounded-md bg-background/10 ">
                <FontAwesomeIcon
                  icon={faFilePdf}
                  bounce
                  className="h-10 w-10  fill-red-400 stroke-red-600 "
                />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferer"
                  className="ml-2 text-sm text-red-500 dark:text-red-300 hover:underline"
                >
                  PDF File
                </a>
              </div>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <span
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </span>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2 "
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative w-auto">
                          <Input
                            className="p-2 w-full bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
                            placeholder="Edit your msg..."
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setIsEditing(false);
                              }
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[12px] mt-1 text-zinc-400">
                Press escape to exit, Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex itmes-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-900 border rounded-sm">
          {canEditMessage && (
            <ActionToolTip label="Edit">
              <Edit
                onClick={() => {
                  setIsEditing(true);
                }}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionToolTip>
          )}
          <ActionToolTip label="Delete">
            <Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300" />
          </ActionToolTip>
        </div>
      )}
    </div>
  );
};
