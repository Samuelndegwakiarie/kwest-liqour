import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, email, name, phone, avatar } = await req.json();

    if (!id || !email) {
      return NextResponse.json({ error: "Missing user ID or email" }, { status: 400 });
    }

    // Check if user already exists in PostgreSQL by ID or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id },
          { email }
        ]
      }
    });

    if (existingUser) {
      // If the ID matches, or email matches but has different ID (e.g. from local tests)
      // we'll update the user and ensure ID is linked to the Supabase ID
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          id: id, // Link/migrate to Supabase ID
          email,
          name: name || existingUser.name,
          phone: phone !== undefined ? phone : existingUser.phone,
          avatar: avatar !== undefined ? avatar : existingUser.avatar,
        }
      });
      return NextResponse.json({ user: updatedUser });
    }

    // Generate unique member number
    let memberNo = "";
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 15) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      memberNo = `KWC-2026-${rand}`;
      const duplicate = await prisma.user.findUnique({
        where: { memberNo },
      });
      if (!duplicate) {
        isUnique = true;
      }
      attempts++;
    }
    if (!isUnique) {
      memberNo = `KWC-2026-${Math.floor(Math.random() * 1000000)}`;
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        name: name || "Noble Guest",
        phone: phone || null,
        avatar: avatar || null,
        memberNo,
        password: "SUPABASE_AUTH_NO_LOCAL_PASSWORD",
        tier: "Amber Private Reserve",
      }
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err: any) {
    console.error("Error in create-user API:", err);
    return NextResponse.json({ error: "Failed to sync user database profile." }, { status: 500 });
  }
}
