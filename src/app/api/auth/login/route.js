import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validate, loginSchema } from "@/lib/validators";
import { findUserByEmail } from "@/models/User";
import { signToken, buildSetCookieHeader } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { success, data, errors } = validate(loginSchema, body);

    if (!success) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const user = await findUserByEmail(data.email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    const token = signToken(payload);

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });

    response.headers.set("Set-Cookie", buildSetCookieHeader(token));
    console.log("🔑 Login cookie set for:", user.email);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
