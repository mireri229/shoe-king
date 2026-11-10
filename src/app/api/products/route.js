import { NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let list = [...products];

    if (category && category !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (gender && gender !== "All") {
      list = list.filter((p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender.toLowerCase() === "unisex");
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      products: list,
      total: list.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

