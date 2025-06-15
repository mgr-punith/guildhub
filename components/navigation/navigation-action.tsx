"use client";

import { Plus } from "lucide-react";
import { ActionToolTip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <ActionToolTip side="right" align="center" label="Add a server">
        <button
          onClick={() => onOpen("createServer")}
          className="group flex items-center "
        >
          <div className="flex mx-3 mt-3 h-[48px] w-[48px] rounded-lg group-hover:rounded-lg transition-all overflow-hidden items-center justify-center bg-zinc-700 group-hover:bg-zinc-600">
            <Plus
              className="group-hover:text-white transition text-zinc-200"
              size={25}
            />
          </div>
        </button>
      </ActionToolTip>
    </div>
  );
};
