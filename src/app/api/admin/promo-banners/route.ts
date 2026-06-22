import { NextResponse } from "next/server";
import { getBanners, createBanner, deleteBanner, updateBanner } from "@/lib/db";

export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, img, discountAmount, price, active, color, endsAt } = body;
    if (!title || !description || !img || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const banner = await createBanner({
      title,
      description,
      img,
      discountAmount: Number(discountAmount) || 0,
      price: Number(price),
      active: active ?? true,
      color: color || "#d4af37",
      endsAt: endsAt || null
    });
    return NextResponse.json(banner, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const success = await deleteBanner(Number(id));
    if (!success) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, img, discountAmount, price, active, color, endsAt } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing required banner ID" }, { status: 400 });
    }
    const banner = await updateBanner(Number(id), {
      title,
      description,
      img,
      discountAmount,
      price,
      active,
      color,
      endsAt
    });
    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}
