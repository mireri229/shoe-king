import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ wishlist: [] });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Wishlist updated", item: body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

