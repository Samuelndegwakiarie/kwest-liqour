import { NextResponse } from "next/server";
import { getHeroImages, updateHeroImageByKey } from "@/lib/db";

export async function GET() {
  try {
    const images = await getHeroImages();
    return NextResponse.json(images);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch hero/card images" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { page, key, url } = body;
    if (!page || !key || !url) {
      return NextResponse.json({ error: "Missing page, key, or url" }, { status: 400 });
    }
    const updated = await updateHeroImageByKey(page, key, url);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update card image" }, { status: 500 });
  }
}
