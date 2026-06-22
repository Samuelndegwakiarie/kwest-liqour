import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brand, name, price, discountPrice, tag, img, category, volume, stock, visible, description } = body;
    if (!brand || !name || !price || !category || !volume) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const product = await createProduct({
      brand, name, price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      tag: tag || null,
      img: img || "/placeholder.png", category, volume,
      stock: Number(stock) || 0, visible: visible !== false,
      description: description || "",
    });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
