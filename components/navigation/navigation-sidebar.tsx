import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "@/components/navigation/navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-gray-100 dark:bg-[#1E1F22] shadow-2xl">
      <NavigationAction />
      <Separator className="h-2 w-[6px] mx-auto bg-zinc-300 dark:bg-zinc-500 max-w-12 rounded" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div className="mb-4" key={server.id}>
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSwitchSessionUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-20 w-20",
            },
          }}
        />
      </div>
    </div>
  );
};
