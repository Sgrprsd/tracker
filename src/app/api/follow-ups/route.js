import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getUpcomingFollowUps } from "@/models/Application";

// GET /api/follow-ups
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followUps = await getUpcomingFollowUps(user.userId);
    return NextResponse.json({ followUps });
  } catch (error) {
    console.error("Follow-ups error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
