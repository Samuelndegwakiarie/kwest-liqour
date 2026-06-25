import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

// Mock admin credentials
const ADMIN_EMAIL = "admin@kwestliquor.co.ke";
const ADMIN_PASSWORD = "kwest2026";

// POST — legacy credential check for admin dashboard
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({ authenticated: true, role: "admin", name: "Vault Manager" });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Auth verification failed" }, { status: 500 });
  }
}

// GET — verify session cookie (used by cart / orders page auth guard)
export async function GET(req: NextRequest) {
  try {
    // 1. Check Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const role = user.email === ADMIN_EMAIL ? "admin" : "user";
      return NextResponse.json({ authenticated: true, userId: user.id, role });
    }

    // 2. Check legacy kwest_session
    const token = req.cookies.get("kwest_session")?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        return NextResponse.json({ authenticated: true, userId: payload.userId, role: payload.role });
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

