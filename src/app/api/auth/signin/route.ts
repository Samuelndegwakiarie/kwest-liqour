import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // 1. Check Admin Credentials
    if (email === "admin@kwestliquor.co.ke" && password === "kwest2026") {
      const adminUser = {
        name: "Vault Manager",
        email: "admin@kwestliquor.co.ke",
        phone: "",
        avatar: null,
        tier: "Grand Cellar Administrator",
        memberNo: "ADMIN-0001",
        joinedDate: new Date("2026-01-18T18:18:24Z").toISOString(),
        role: "admin",
      };

      const token = signToken({
        userId: "admin-id",
        email: adminUser.email,
        name: adminUser.name,
        role: "admin",
      });

      const res = NextResponse.json({
        user: adminUser,
        token,
      });

      res.cookies.set("kwest_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return res;
    }

    // 2. Regular User Login
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

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
      role: "user",
    };

    const res = NextResponse.json({
      user: responseUser,
      token,
    });

    res.cookies.set("kwest_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Signin error:", err);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
