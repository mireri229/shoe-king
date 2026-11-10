import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const user = {
      id: 999,
      name: body.name || "Google User",
      email: body.email || "user@gmail.com",
      role: "customer",
    };
    return NextResponse.json({
      token: "google_jwt_token_shoe_king",
      user,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

