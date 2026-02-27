import { NextResponse } from "next/server";
import { buildClearCookieHeader } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out" });
    response.headers.set("Set-Cookie", buildClearCookieHeader());
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
