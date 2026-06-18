import { NextResponse } from "next/server";

// Mock admin credentials — swap for real auth provider (NextAuth, Clerk, etc.)
const ADMIN_EMAIL = "admin@kwestliquor.co.ke";
const ADMIN_PASSWORD = "kwest2026";

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
