import { NextResponse } from "next/server";
import { getBanners, createBanner, deleteBanner } from "@/lib/db";

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
    const { text, active, color } = body;
    if (!text) return NextResponse.json({ error: "Banner text is required" }, { status: 400 });
    const banner = await createBanner({ text, active: active ?? true, color: color || "#d4af37" });
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
