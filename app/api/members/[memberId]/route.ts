import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { memberId } = await params;
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data:{
                role
            }
          },
        },
      },
      include:{
        members:{
            include:{
                profile:true,
            },
            orderBy:{
                role:"asc"
            }
        }
      }
    });

    return NextResponse.json(server)
  } catch (error) {
    console.log("[MEMBER_ID]", error);
    return new NextResponse("Internal Server Error ", { status: 500 });
  }
}
