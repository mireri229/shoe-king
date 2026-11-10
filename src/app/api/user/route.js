import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    user: {
      id: 1,
      name: "James Kingsley",
      email: "james.k@example.com",
      role: "customer",
    },
  });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      user: {
        id: 1,
        name: body.name || "James Kingsley",
        email: body.email || "james.k@example.com",
        role: "customer",
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

