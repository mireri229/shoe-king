import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ cart: [] });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Item added to cart", item: body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json({ message: "Cart cleared" });
}

