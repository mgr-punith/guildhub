"use client";

import { CheckCircle, Copy, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useOrigin } from "@/hooks/use-origin";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const invteLink = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(invteLink);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
      console.log("okay",response.data)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-xl text-center font-semibold">
              Invite Your Squad
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">
              Server Invite Link
            </Label>
            <div className="flex items-center mt-2 gap-x-2">
              <Input
                disabled={isLoading}
                className="border border-gray-600 shadow-lg bg-zinc-400 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                value={invteLink}
                readOnly
              />
              <Button
                disabled={isLoading}
                onClick={onCopy}
                size="icon"
                className="cursor-pointer"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 " />
                ) : (
                  <Copy className="w-4 h-4 " />
                )}
              </Button>
            </div>
            <Button
            onClick={onNew}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-xs text-zinc-500 mt-3 cursor-pointer"
            >
              Generate a new link
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
