import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, LogOutIcon, PlusCircle, Settings, Trash, Trash2, User, UserPlus, Users } from "lucide-react";

interface ServerHeaderProp {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProp) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className=" w-full text-md font-semibold px-3 flex items-center h-12 shadow-lg dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10  dark:hover:bg-zinc-700/50 transition">
            {server.name}
            <ChevronDown className="h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && ( 
            <DropdownMenuItem 
             className="text-sky-600 dark:text-sky-400 px-3 py-2 text-sm cursor-pointer"
            >
                Invite friends
                <UserPlus className="h-4 w-4 ml-auto"/>
            </DropdownMenuItem>
        )}

        {isAdmin && ( 
            <DropdownMenuItem 
             className=" px-3 py-2 text-sm cursor-pointer"
            >
                Server settings
                <Settings className="h-4 w-4 ml-auto"/>
            </DropdownMenuItem>
        )}

        {isAdmin && ( 
            <DropdownMenuItem 
             className=" px-3 py-2 text-sm cursor-pointer"
            >
                Manage members
                <Users className="h-4 w-4 ml-auto"/>
            </DropdownMenuItem>
        )}

        {isModerator && ( 
            <DropdownMenuItem 
             className=" px-3 py-2 text-sm cursor-pointer"
            >
                Create Channels
                <PlusCircle className="h-4 w-4 ml-auto"/>
            </DropdownMenuItem>
        )}
        {isModerator && (
            <DropdownMenuSeparator/>
        )}

        {isAdmin && ( 
            <DropdownMenuItem 
             className=" text-rose-500 focus:bg-transparent focus:text-rose-600 px-3 py-2 text-sm cursor-pointer"
            >
                Delete Channels
                <Trash2 className="h-4 w-4 ml-auto text-rose-500 "/>
            </DropdownMenuItem>
        )}

        {!isAdmin && ( 
            <DropdownMenuItem 
             className=" px-3 py-2 text-sm cursor-pointer"
            >
                Leave Server
                <LogOutIcon className="h-4 w-4 ml-auto"/>
            </DropdownMenuItem>
        )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
