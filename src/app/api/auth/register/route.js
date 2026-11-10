import { NextResponse } from "next/server";
import { registerUserInMemory, getUserInMemory } from "../login/route";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (getUserInMemory(normalizedEmail)) {
      return NextResponse.json({ error: "An account already exists with this email." }, { status: 409 });
    }

    const user = {
      id: Math.floor(Math.random() * 1000) + 10,
      name,
      email: normalizedEmail,
      password,
      role: "customer",
    };

    registerUserInMemory(user);

    const { password: _pw, ...safeUser } = user;

    return NextResponse.json({
      token: "jwt_token_" + safeUser.id,
      user: safeUser,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
