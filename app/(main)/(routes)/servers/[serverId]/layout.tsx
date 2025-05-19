import { ServerSidebar } from "@/components/server/servre-sidebar";
import { db } from "@/lib/db";
// import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentUser();

  if (!profile) {
    return "/";
  }

  const {serverId} = await params;

  if (!serverId) {
    redirect("/");
  }

  const server = await db.server.findMany({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    redirect("/");
  }

  return (
    <div>
      <div className="hidden md:flex z-20 h-full w-60 flex-col fixed inset-y-0">
        <ServerSidebar/>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
