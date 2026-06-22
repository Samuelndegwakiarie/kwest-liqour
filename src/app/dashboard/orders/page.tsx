"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  ChevronDown,
  ExternalLink,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Filter,
  ArrowUpDown,
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

type StatusKey = "all" | "Pending" | "Processing" | "En Route" | "Delivered" | "Cancelled";

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
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

const STATUSES: StatusKey[] = [
  "all",
  "Pending",
  "Processing",
  "En Route",
  "Delivered",
  "Cancelled",
];
const ORDER_STATUSES = ["Pending", "Processing", "En Route", "Delivered", "Cancelled"];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) {
    return (
      <span className="text-white/40 text-xs px-2 py-1 rounded-lg bg-white/[0.04]">
        {status}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      {status === "Pending" && <Clock className="w-3 h-3" />}
      {status === "Processing" && <RefreshCw className="w-3 h-3" />}
      {status === "En Route" && <Truck className="w-3 h-3" />}
      {status === "Delivered" && <CheckCircle2 className="w-3 h-3" />}
      {status === "Cancelled" && <XCircle className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div
            className="h-4 bg-white/[0.06] rounded-lg animate-pulse"
            style={{ width: `${55 + (i % 4) * 15}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: string) => {
      setUpdatingId(orderId);
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("Status update failed");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } catch {
        // Status update failed silently
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  const filtered = orders.filter((o) => {
    const matchSearch =
      search.trim() === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const enRoute = orders.filter((o) => o.status === "En Route").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const stats = [
    {
      label: "Total Orders",
      value: total,
      color: "text-white",
      bg: "bg-white/[0.04]",
      border: "border-white/[0.08]",
      accent: "text-white/50",
    },
    {
      label: "Pending",
      value: pending,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      accent: "text-amber-400/60",
    },
    {
      label: "En Route",
      value: enRoute,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20",
      accent: "text-cyan-400/60",
    },
    {
      label: "Delivered",
      value: delivered,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
      accent: "text-green-400/60",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-[#d4af37]" />
            </div>
            <h1 className="text-white font-bold text-2xl tracking-tight">
              Order Processing
            </h1>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest ml-12">
            Manage &amp; fulfil customer orders
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-[#0d0d0d] border ${s.border} rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-all duration-200`}
          >
            <div>
              <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">
                {s.label}
              </div>
              {loading ? (
                <div className="h-8 w-12 bg-white/[0.06] rounded-lg animate-pulse" />
              ) : (
                <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              )}
            </div>
            <div
              className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}
            >
              {s.label === "Total Orders" && (
                <ShoppingCart className={`w-4 h-4 ${s.accent}`} />
              )}
              {s.label === "Pending" && <Clock className={`w-4 h-4 ${s.accent}`} />}
              {s.label === "En Route" && <Truck className={`w-4 h-4 ${s.accent}`} />}
              {s.label === "Delivered" && (
                <CheckCircle2 className={`w-4 h-4 ${s.accent}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Order ID or customer name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/[0.02] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-white/30 text-xs px-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">Filter by Status</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => {
            const cfg = s !== "all" ? STATUS_CONFIG[s] : null;
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? s === "all"
                      ? "bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]"
                      : `${cfg!.bg} ${cfg!.border} ${cfg!.color}`
                    : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white hover:border-white/20"
                }`}
              >
                {s === "all" ? "All Orders" : s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 flex items-center gap-3">
          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-red-400 text-sm flex-1">{error}</span>
          <button
            onClick={fetchOrders}
            className="text-red-300 text-xs underline hover:text-red-200 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* ── Desktop Table (sm and above) ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[940px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[
                  { label: "Order ID", sortable: true },
                  { label: "Customer", sortable: false },
                  { label: "Items", sortable: false },
                  { label: "Total", sortable: false },
                  { label: "Delivery", sortable: false },
                  { label: "Status", sortable: false },
                  { label: "Date", sortable: true },
                  { label: "Actions", sortable: false },
                ].map((col) => (
                  <th
                    key={col.label}
                    className="text-left px-4 py-3.5 text-white/30 text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <Package className="w-7 h-7 text-white/20" />
                      </div>
                      <div>
                        <p className="text-white/50 font-semibold">
                          No orders found
                        </p>
                        <p className="text-white/25 text-xs mt-1">
                          {search.trim() !== "" || statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Orders will appear here once customers place them"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const itemsSummary =
                    order.items.length === 1
                      ? `${order.items[0].name} ×${order.items[0].quantity}`
                      : `${order.items[0].name} +${order.items.length - 1} more`;

                  const isUpdating = updatingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-4 py-4">
                        <span className="font-mono text-[#d4af37] text-sm font-bold tracking-wider">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="text-white text-sm font-medium leading-tight">
                          {order.customer}
                        </div>
                        <div className="text-white/30 text-xs mt-0.5">
                          {order.phone}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-4">
                        <span className="text-white/70 text-sm">
                          {itemsSummary}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4">
                        <span className="text-white font-semibold text-sm whitespace-nowrap">
                          KES {order.total.toLocaleString()}
                        </span>
                      </td>

                      {/* Delivery */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                            order.delivery === "pickup"
                              ? "text-purple-400 bg-purple-400/10 border-purple-400/20"
                              : "text-sky-400 bg-sky-400/10 border-sky-400/20"
                          }`}
                        >
                          {order.delivery === "pickup" ? "Pickup" : "Delivery"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-white/60 text-xs">
                          {new Date(order.date).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-white/30 text-[10px] mt-0.5">
                          {new Date(order.date).toLocaleTimeString("en-KE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {/* Inline status dropdown */}
                          <div className="relative">
                            <select
                              value={order.status}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg pl-3 pr-7 py-1.5 text-white/60 text-xs focus:outline-none focus:border-[#d4af37]/50 hover:border-white/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option
                                  key={s}
                                  value={s}
                                  className="bg-[#0d0d0d] text-white"
                                >
                                  {s}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                              {isUpdating ? (
                                <RefreshCw className="w-3 h-3 text-[#d4af37] animate-spin" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-white/30" />
                              )}
                            </div>
                          </div>

                          {/* View link */}
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="flex items-center gap-1.5 text-[#d4af37]/60 hover:text-[#d4af37] border border-[#d4af37]/20 hover:border-[#d4af37]/50 bg-[#d4af37]/[0.03] hover:bg-[#d4af37]/[0.08] rounded-lg px-2.5 py-1.5 text-xs transition-all duration-200 whitespace-nowrap"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Card List (below sm) ── */}
        <div className="sm:hidden">
          {loading ? (
            <div className="divide-y divide-white/[0.04]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 space-y-3">
                  <div className="h-4 bg-white/[0.06] rounded-lg animate-pulse w-2/5" />
                  <div className="h-3 bg-white/[0.06] rounded-lg animate-pulse w-3/4" />
                  <div className="h-3 bg-white/[0.06] rounded-lg animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Package className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white/50 font-semibold">No orders found</p>
              <p className="text-white/25 text-xs">
                {search.trim() !== "" || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here once customers place them"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((order) => {
                const itemsSummary =
                  order.items.length === 1
                    ? `${order.items[0].name} ×${order.items[0].quantity}`
                    : `${order.items[0].name} +${order.items.length - 1} more`;
                const isUpdating = updatingId === order.id;

                return (
                  <div key={order.id} className="p-4 space-y-3">
                    {/* Row 1: ID + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[#d4af37] text-sm font-bold tracking-wider">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Row 2: Customer */}
                    <div>
                      <div className="text-white text-sm font-medium">{order.customer}</div>
                      <div className="text-white/35 text-xs mt-0.5">{order.phone}</div>
                    </div>

                    {/* Row 3: Items + Total */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/60 text-xs truncate flex-1">{itemsSummary}</span>
                      <span className="text-white font-semibold text-sm whitespace-nowrap">
                        KES {order.total.toLocaleString()}
                      </span>
                    </div>

                    {/* Row 4: Delivery + Date */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-lg border ${
                          order.delivery === "pickup"
                            ? "text-purple-400 bg-purple-400/10 border-purple-400/20"
                            : "text-sky-400 bg-sky-400/10 border-sky-400/20"
                        }`}
                      >
                        {order.delivery === "pickup" ? "Pickup" : "Delivery"}
                      </span>
                      <span className="text-white/35 text-xs">
                        {new Date(order.date).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Row 5: Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="relative flex-1">
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-lg pl-3 pr-8 py-2 text-white/60 text-xs focus:outline-none focus:border-[#d4af37]/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-[#0d0d0d] text-white">{s}</option>
                          ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isUpdating ? (
                            <RefreshCw className="w-3 h-3 text-[#d4af37] animate-spin" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-white/30" />
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="flex items-center gap-1.5 text-[#d4af37]/60 hover:text-[#d4af37] border border-[#d4af37]/20 hover:border-[#d4af37]/50 bg-[#d4af37]/[0.03] hover:bg-[#d4af37]/[0.08] rounded-lg px-3 py-2 text-xs transition-all duration-200 whitespace-nowrap min-h-[36px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Table Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-white/30 text-xs">
              Showing{" "}
              <span className="text-white/50 font-medium">{filtered.length}</span>{" "}
              of{" "}
              <span className="text-white/50 font-medium">{orders.length}</span>{" "}
              orders
            </span>
            <span className="text-white/20 text-xs">Sorted newest first ↓</span>
          </div>
        )}
      </div>
    </div>
  );
}
