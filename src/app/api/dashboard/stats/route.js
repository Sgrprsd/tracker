import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getApplicationStats } from "@/models/Application";

// GET /api/dashboard/stats
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getApplicationStats(user.userId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
