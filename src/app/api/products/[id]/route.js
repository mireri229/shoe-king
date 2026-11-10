import { NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(request, { params }) {
  try {
    const id = Number(params.id);
    const product = products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

