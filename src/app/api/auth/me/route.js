import { NextResponse } from "next/server";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: 1,
      name: "James Kingsley",
      email: "james.k@example.com",
      role: "customer",
    },
  });
}

