import { NextResponse } from "next/server";

// Registered users store in memory for Next.js API
const registeredUsers = new Map([
  ["james.k@example.com", { id: 1, name: "James Kingsley", email: "james.k@example.com", password: "password123", role: "customer" }],
  ["admin@shoeking.com", { id: 2, name: "Shoe King Admin", email: "admin@shoeking.com", password: "admin", role: "admin" }],
]);

export function registerUserInMemory(user) {
  registeredUsers.set(user.email.toLowerCase(), user);
}

export function getUserInMemory(email) {
  return registeredUsers.get(email.toLowerCase());
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = registeredUsers.get(normalizedEmail);

    if (!existing) {
      return NextResponse.json(
        { error: "No account found with this email. Please create an account first." },
        { status: 404 }
      );
    }

    if (existing.password && existing.password !== password) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const { password: _pw, ...safeUser } = existing;

    return NextResponse.json({
      token: "jwt_token_" + safeUser.id,
      user: safeUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
