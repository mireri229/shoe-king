import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    orders: [
      { id: "#SK-1042", date: "Sep 18, 2026", status: "Delivered", items: 2, total: "$378.00", product: "Air Monarch Elite" },
      { id: "#SK-0987", date: "Sep 01, 2026", status: "In Transit", items: 1, total: "$215.00", product: "Velocity Pro X" },
      { id: "#SK-0856", date: "Aug 14, 2026", status: "Delivered", items: 3, total: "$602.00", product: "Crown Classic Oxford" },
    ],
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orderId = `#SK-${Math.floor(1000 + Math.random() * 9000)}`;
    return NextResponse.json({
      message: "Order placed successfully",
      orderId,
      ...body,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

