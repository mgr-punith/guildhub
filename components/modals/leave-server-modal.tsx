"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    onClose();
    router.refresh();
    router.push("/");
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-xl text-center font-bold">
              LEAVE SERVER !
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure wanna leave{" "}
              <span className="font-semibold text-sky-600">{server?.name}</span>{" "}
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button disabled={isLoading} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button disabled={isLoading} variant="primary" onClick={onClick}>
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
