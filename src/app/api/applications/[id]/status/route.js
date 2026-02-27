import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { validate, updateStatusSchema } from "@/lib/validators";
import { updateApplicationStatus } from "@/models/Application";

// PATCH /api/applications/[id]/status — Quick status update (Kanban drag)
export async function PATCH(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { success, data, errors } = validate(updateStatusSchema, body);

    if (!success) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const application = await updateApplicationStatus(
      user.userId,
      id,
      data.status,
    );

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("PATCH status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
