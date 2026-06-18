"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

interface OrderItem {
  productId: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  volume: string;
}

interface MpesaInfo {
  phone: string;
  receipt: string;
  amount: number;
  status: string;
  timestamp: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
  delivery: string;
  address: string | null;
  status: string;
  date: string;
  mpesa: MpesaInfo;
}

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  Pending: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  Processing: {
    label: "Processing",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  "En Route": {
    label: "En Route",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
  },
  Delivered: {
    label: "Delivered",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
  },
  Cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
};

const TIMELINE_STEPS = ["Pending", "Processing", "En Route", "Delivered"];
const ORDER_STATUSES = ["Pending", "Processing", "En Route", "Delivered", "Cancelled"];

const MPESA_STATUS_CONFIG: Record<
  string,
  { color: string; dot: string; label: string }
> = {
  SUCCESS: { color: "text-green-400", dot: "bg-green-400", label: "Success" },
  PENDING: { color: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
  FAILED: { color: "text-red-400", dot: "bg-red-400", label: "Failed" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) {
    return (
      <span className="text-white/40 text-xs px-2.5 py-1 rounded-lg bg-white/[0.04]">
        {status}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      {status === "Pending" && <Clock className="w-3.5 h-3.5" />}
      {status === "Processing" && <RefreshCw className="w-3.5 h-3.5" />}
      {status === "En Route" && <Truck className="w-3.5 h-3.5" />}
      {status === "Delivered" && <CheckCircle2 className="w-3.5 h-3.5" />}
      {status === "Cancelled" && <AlertCircle className="w-3.5 h-3.5" />}
      {cfg.label}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-white/[0.06] rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <div className="h-4 w-32 bg-white/[0.06] rounded-lg" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-4 bg-white/[0.04] rounded-lg" style={{ width: `${60 + j * 10}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) throw new Error("Order not found");
      const data: Order = await res.json();
      setOrder(data);
      setSelectedStatus(data.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = useCallback(async () => {
    if (!order || selectedStatus === order.status) return;
    setUpdating(true);
    setUpdateSuccess(false);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setOrder((prev) => (prev ? { ...prev, status: selectedStatus } : prev));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch {
      // Update failed
    } finally {
      setUpdating(false);
    }
  }, [order, selectedStatus, id]);

  const getTimelineStep = (orderStatus: string) => {
    if (orderStatus === "Cancelled") return -1;
    return TIMELINE_STEPS.indexOf(orderStatus);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-semibold">{error ?? "Order not found"}</p>
          <button
            onClick={fetchOrder}
            className="mt-4 text-red-400/70 hover:text-red-300 text-sm underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getTimelineStep(order.status);
  const mpesaCfg =
    MPESA_STATUS_CONFIG[order.mpesa.status?.toUpperCase()] ??
    MPESA_STATUS_CONFIG.PENDING;

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#d4af37] text-sm font-medium transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#d4af37] text-sm font-bold tracking-wider">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl tracking-tight">
            Order Details
          </h1>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">
            {new Date(order.date).toLocaleDateString("en-KE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Order Info Card */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                  Order Info
                </p>
                <h2 className="text-white font-bold text-lg">Summary</h2>
              </div>
              <Package className="w-5 h-5 text-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                  Order ID
                </p>
                <p className="font-mono text-[#d4af37] font-bold text-sm tracking-wider">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                  Status
                </p>
                <StatusBadge status={order.status} />
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                  Delivery Method
                </p>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                    order.delivery === "pickup"
                      ? "text-purple-400 bg-purple-400/10 border-purple-400/20"
                      : "text-sky-400 bg-sky-400/10 border-sky-400/20"
                  }`}
                >
                  {order.delivery === "pickup" ? "Store Pickup" : "Home Delivery"}
                </span>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                  Date Placed
                </p>
                <p className="text-white/70 text-sm">
                  {new Date(order.date).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                  Customer
                </p>
                <h2 className="text-white font-bold text-lg">Contact Details</h2>
              </div>
              <User className="w-5 h-5 text-white/20" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 py-3 border-b border-white/[0.04]">
                <div className="w-8 h-8 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">
                    Full Name
                  </p>
                  <p className="text-white font-semibold text-sm mt-0.5">
                    {order.customer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-white/[0.04]">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">
                    Email
                  </p>
                  <p className="text-white/80 text-sm mt-0.5">{order.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-white/[0.04]">
                <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">
                    Phone
                  </p>
                  <p className="text-white/80 text-sm mt-0.5">{order.phone}</p>
                </div>
              </div>
              {order.address && (
                <div className="flex items-start gap-3 py-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest">
                      Delivery Address
                    </p>
                    <p className="text-white/80 text-sm mt-0.5">{order.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items Breakdown Table */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="p-6 pb-4 flex items-center justify-between">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                  Order Contents
                </p>
                <h2 className="text-white font-bold text-lg">
                  Items Breakdown
                </h2>
              </div>
              <span className="text-white/30 text-xs bg-white/[0.04] px-2.5 py-1 rounded-lg">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left px-6 py-3 text-white/30 text-[10px] uppercase tracking-widest font-semibold">
                      Product
                    </th>
                    <th className="text-center px-4 py-3 text-white/30 text-[10px] uppercase tracking-widest font-semibold">
                      Volume
                    </th>
                    <th className="text-center px-4 py-3 text-white/30 text-[10px] uppercase tracking-widest font-semibold">
                      Qty
                    </th>
                    <th className="text-right px-4 py-3 text-white/30 text-[10px] uppercase tracking-widest font-semibold">
                      Unit Price
                    </th>
                    <th className="text-right px-6 py-3 text-white/30 text-[10px] uppercase tracking-widest font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr
                      key={`${item.productId}-${idx}`}
                      className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-medium text-sm">
                          {item.name}
                        </div>
                        <div className="text-white/30 text-xs mt-0.5">
                          {item.brand}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-white/50 text-xs bg-white/[0.04] px-2 py-1 rounded-lg">
                          {item.volume}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-white/70 text-sm font-semibold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-white/60 text-sm">
                          KES {item.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white font-semibold text-sm">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/[0.08] bg-[#d4af37]/[0.03]">
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-right text-white/50 text-xs uppercase tracking-widest font-semibold"
                    >
                      Order Total
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[#d4af37] font-bold text-lg">
                        KES {order.total.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                  {itemsTotal !== order.total && (
                    <tr className="border-t border-white/[0.04]">
                      <td
                        colSpan={4}
                        className="px-6 py-3 text-right text-white/30 text-xs"
                      >
                        (Items subtotal: KES {itemsTotal.toLocaleString()})
                      </td>
                      <td />
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          {/* M-Pesa Debug Panel */}
          <div className="bg-[#0d0d0d] border border-[#d4af37]/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.06)]">
            <div className="px-6 py-4 border-b border-[#d4af37]/20 bg-[#d4af37]/[0.04] flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-[#d4af37]" />
              <div>
                <h3 className="text-[#d4af37] font-bold text-sm">
                  M-Pesa STK Push Log
                </h3>
                <p className="text-[#d4af37]/40 text-[10px] uppercase tracking-widest">
                  Payment Record
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${mpesaCfg.dot} ${
                    order.mpesa.status?.toUpperCase() === "PENDING"
                      ? "animate-pulse"
                      : ""
                  }`}
                />
                <span className={`text-xs font-bold ${mpesaCfg.color}`}>
                  {mpesaCfg.label}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  Receipt Number
                </p>
                <p className="font-mono text-[#d4af37] font-bold text-sm tracking-widest">
                  {order.mpesa.receipt || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  M-Pesa Phone
                </p>
                <p className="text-white/80 text-sm font-medium">
                  {order.mpesa.phone}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  Amount Charged
                </p>
                <p className="text-white font-bold text-lg">
                  KES {order.mpesa.amount?.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  Payment Status
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${mpesaCfg.dot}`}
                  />
                  <span className={`text-sm font-bold ${mpesaCfg.color}`}>
                    {order.mpesa.status?.toUpperCase() ?? "UNKNOWN"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  Timestamp
                </p>
                <p className="text-white/60 text-xs font-mono">
                  {order.mpesa.timestamp
                    ? new Date(order.mpesa.timestamp).toLocaleString("en-KE")
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Status Update Card */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-white/30" />
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest">
                  Fulfilment
                </p>
                <h3 className="text-white font-bold text-base">
                  Update Status
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">
                  Current Status
                </p>
                <StatusBadge status={order.status} />
              </div>

              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">
                  Change To
                </p>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all cursor-pointer pr-10"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-[#0d0d0d] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>

              {updateSuccess && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-green-400 text-xs font-semibold">
                    Status updated successfully
                  </span>
                </div>
              )}

              <button
                onClick={handleStatusUpdate}
                disabled={updating || selectedStatus === order.status}
                className="w-full bg-[#d4af37] hover:bg-[#b8960c] disabled:bg-[#d4af37]/30 disabled:cursor-not-allowed text-[#080808] disabled:text-[#080808]/40 font-bold text-sm py-3 rounded-xl transition-all duration-200 tracking-wide flex items-center justify-center gap-2 cursor-pointer"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
            <div className="mb-5">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                Progress
              </p>
              <h3 className="text-white font-bold text-base">
                Order Timeline
              </h3>
            </div>

            {order.status === "Cancelled" ? (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-4">
                <div className="w-8 h-8 rounded-full bg-red-400/20 border-2 border-red-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-red-400 font-bold text-sm">Order Cancelled</p>
                  <p className="text-red-400/50 text-xs mt-0.5">
                    This order was cancelled and will not be fulfilled.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  const isLast = idx === TIMELINE_STEPS.length - 1;

                  return (
                    <div key={step} className="flex gap-4">
                      {/* Dot + Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isCompleted
                              ? "bg-[#d4af37] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                              : "bg-white/[0.03] border-white/10"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#080808]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-10 transition-all duration-300 ${
                              isCompleted && idx < currentStep
                                ? "bg-[#d4af37]/40"
                                : "bg-white/[0.06]"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Label */}
                      <div className={`pb-${isLast ? "0" : "2"} pt-1.5 flex-1`}>
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            isCompleted ? "text-white" : "text-white/25"
                          }`}
                        >
                          {step}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">
                              Current
                            </span>
                          )}
                        </p>
                        {isCompleted && (
                          <p className="text-white/30 text-[10px] mt-0.5">
                            {idx === 0
                              ? new Date(order.date).toLocaleString("en-KE", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Completed"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
