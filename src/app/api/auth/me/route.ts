import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Find the user in PostgreSQL
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    // If not found in PostgreSQL, sync/create profile record automatically
    if (!dbUser) {
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

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.user_metadata?.full_name || "Noble Guest",
          phone: user.user_metadata?.phone || user.phone || null,
          avatar: user.user_metadata?.avatar || null,
          memberNo,
          password: "SUPABASE_AUTH_NO_LOCAL_PASSWORD",
          tier: "Amber Private Reserve",
        }
      });
    }

    const role = dbUser.email === "admin@kwestliquor.co.ke" ? "admin" : "user";

    const responseUser = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      phone: dbUser.phone,
      avatar: dbUser.avatar,
      tier: dbUser.email === "admin@kwestliquor.co.ke" ? "Grand Cellar Administrator" : dbUser.tier,
      memberNo: dbUser.email === "admin@kwestliquor.co.ke" ? "ADMIN-0001" : dbUser.memberNo,
      joinedDate: dbUser.joinedDate.toISOString(),
      role,
    };

    return NextResponse.json({ user: responseUser });
  } catch (err: any) {
    console.error("Error in /api/auth/me:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
