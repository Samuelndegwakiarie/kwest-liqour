import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET — fetch orders belonging to the authenticated user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("kwest_session")?.value
      || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin can see all orders
    if (payload.role === "admin") {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { date: "desc" },
      });
      return NextResponse.json(orders);
    }

    // Regular user only sees their own orders
    const orders = await prisma.order.findMany({
      where: { userId: payload.userId },
      include: { items: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err: any) {
    console.error("User orders GET error:", err);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
