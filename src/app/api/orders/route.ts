import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

// GET — fetch orders belonging to the authenticated user
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let userId = "";
    let role = "user";

    if (authUser) {
      userId = authUser.id;
      const dbUser = await prisma.user.findUnique({
        where: { id: authUser.id }
      });
      role = dbUser?.isAdmin || authUser.email === "admin@kwestliquor.co.ke" ? "admin" : "user";
    } else {
      const token = req.cookies.get("kwest_session")?.value
        || req.headers.get("authorization")?.replace("Bearer ", "");
      if (token) {
        const payload = verifyToken(token);
        if (payload && payload.userId) {
          userId = payload.userId;
          role = payload.role;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin can see all orders
    if (role === "admin") {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { date: "desc" },
      });
      return NextResponse.json(orders);
    }

    // Regular user only sees their own orders
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err: any) {
    console.error("User orders GET error:", err);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}

