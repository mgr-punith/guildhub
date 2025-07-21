import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    
  } catch (error) {
    console.log("{MESSAGE_GET}", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
