import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("Order creation failed API:", err);
    return NextResponse.json({ error: "Failed to create order: " + err.message }, { status: 500 });
  }
}
