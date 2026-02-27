import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { validate, createApplicationSchema } from "@/lib/validators";
import { createApplication, getApplicationsByUser } from "@/models/Application";

// GET /api/applications — List all with optional filters
export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || "createdAt",
      order: searchParams.get("order") || "desc",
    };

    const applications = await getApplicationsByUser(user.userId, filters);
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("GET applications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/applications — Create new
export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { success, data, errors } = validate(createApplicationSchema, body);

    if (!success) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const application = await createApplication(user.userId, data);
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("POST application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
