import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name, phone, avatar } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    // Generate unique member number
    let memberNo = "";
    let isUnique = false;
    while (!isUnique) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      memberNo = `KWC-2026-${rand}`;
      const duplicate = await prisma.user.findUnique({
        where: { memberNo },
      });
      if (!duplicate) {
        isUnique = true;
      }
    }

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        avatar: avatar || null,
        memberNo,
        tier: "Amber Private Reserve",
      },
    });

    // Create token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: "user",
    });

    const responseUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      tier: user.tier,
      memberNo: user.memberNo,
      joinedDate: user.joinedDate.toISOString(),
    };

    const res = NextResponse.json({
      user: responseUser,
      token,
    }, { status: 201 });

    // Set HTTPOnly cookie for secure session handling
    res.cookies.set("kwest_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Failed to register user." }, { status: 500 });
  }
}
