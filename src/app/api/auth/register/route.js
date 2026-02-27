import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validate, registerSchema } from "@/lib/validators";
import { createUser, findUserByEmail, ensureUserIndexes } from "@/models/User";
import { signToken, buildSetCookieHeader } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { success, data, errors } = validate(registerSchema, body);

    if (!success) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    await ensureUserIndexes();

    const existing = await findUserByEmail(data.email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const result = await createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const payload = {
      userId: result.insertedId.toString(),
      email: data.email,
      name: data.name,
    };
    const token = signToken(payload);

    const response = NextResponse.json(
      {
        message: "Account created",
        user: {
          id: result.insertedId.toString(),
          name: data.name,
          email: data.email,
        },
      },
      { status: 201 },
    );

    response.headers.set("Set-Cookie", buildSetCookieHeader(token));
    console.log("🔑 Register cookie set for:", data.email);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
