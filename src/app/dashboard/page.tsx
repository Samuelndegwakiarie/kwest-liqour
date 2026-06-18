"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AlertTriangle,
  Package,
  ExternalLink,
  Calendar,
  RefreshCw,
  DollarSign,
  Activity,
  Award,
  BarChart2,
} from "lucide-react";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface TopProduct {
  name: string;
  brand: string;
  sold: number;
  revenue: number;
}

interface CategoryBreakdown {
  category: string;
  percentage: number;
}

interface Demographic {
  label: string;
  value: number;
  color: string;
}

interface RecentSale {
  id: string;
  product: string;
  customer: string;
  amount: number;
  date: string;
  status: "Pending" | "Processing" | "En Route" | "Delivered" | "Cancelled";
}

interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  activeOrders: number;
  lowStockCount: number;
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  categoryBreakdown: CategoryBreakdown[];
  demographics: Demographic[];
  recentSales: RecentSale[];
}

type SalesFilter = "today" | "7days" | "30days" | "all";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompact(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
}

function getStatusStyle(status: RecentSale["status"]): string {
  switch (status) {
    case "Delivered":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "En Route":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    case "Processing":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "Pending":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "Cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    default:
      return "bg-white/10 text-white/50 border-white/10";
  }
}

function filterSalesByPeriod(sales: RecentSale[], filter: SalesFilter): RecentSale[] {
  const now = new Date();
  return sales.filter((s) => {
    const saleDate = new Date(s.date);
    if (filter === "today") {
      return saleDate.toDateString() === now.toDateString();
    } else if (filter === "7days") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      return saleDate >= cutoff;
    } else if (filter === "30days") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 30);
      return saleDate >= cutoff;
    }
    return true;
  });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-white/[0.03] relative overflow-hidden ${className ?? ""}`}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <ShimmerBlock className="h-8 w-56" />
          <ShimmerBlock className="h-4 w-40" />
        </div>
        <ShimmerBlock className="h-9 w-28" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <ShimmerBlock className="h-10 w-10" />
              <ShimmerBlock className="h-5 w-16" />
            </div>
            <div className="space-y-1.5">
              <ShimmerBlock className="h-7 w-24" />
              <ShimmerBlock className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <ShimmerBlock className="h-5 w-40" />
          <ShimmerBlock className="h-52 w-full" />
        </div>
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <ShimmerBlock className="h-5 w-40" />
          <div className="flex justify-center">
            <ShimmerBlock className="h-52 w-52 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Monthly Revenue Bar Chart (pure SVG) ──────────────────────────────────────

function RevenueBarChart({ data }: { data: MonthlyRevenue[] }) {
  const last6 = data.slice(-6);
  const maxRev = Math.max(...last6.map((d) => d.revenue), 1);
  const chartH = 160;
  const barW = 36;
  const gap = 20;
  const paddingX = 10;
  const totalW = last6.length * (barW + gap) - gap + paddingX * 2;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalW} ${chartH + 54}`}
        width="100%"
        height={chartH + 54}
        className="min-w-[320px]"
      >
        <defs>
          <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
            <stop offset="100%" stopColor="#b8960c" stopOpacity="0.7" />
          </linearGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = chartH - frac * chartH;
          return (
            <line
              key={frac}
              x1={paddingX}
              y1={y}
              x2={totalW - paddingX}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          );
        })}

        {last6.map((d, i) => {
          const barH = Math.max((d.revenue / maxRev) * chartH, 4);
          const x = paddingX + i * (barW + gap);
          const y = chartH - barH;

          return (
            <g key={d.month}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={6}
                fill="#d4af37"
                opacity={0.12}
                filter="url(#goldGlow)"
              />
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={6}
                fill="url(#barGold)"
              >
                <title>
                  {d.month}: {formatKES(d.revenue)}
                </title>
              </rect>
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="8"
                fill="#d4af37"
                fontWeight="600"
              >
                {formatCompact(d.revenue)}
              </text>
              <text
                x={x + barW / 2}
                y={chartH + 18}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(255,255,255,0.35)"
                fontWeight="500"
              >
                {d.month.slice(0, 3)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Demographics Donut Chart (pure SVG) ──────────────────────────────────────

function DonutChart({ data }: { data: Demographic[] }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 74;
  const innerR = 46;
  const total = data.reduce((s, d) => s + d.value, 0);

  let cumAngle = -Math.PI / 2;

  interface Segment {
    d: string;
    color: string;
    label: string;
    value: number;
  }

  const segments: Segment[] = data.map((item) => {
    const frac = item.value / total;
    const angle = frac * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const pathD = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    return { d: pathD, color: item.color, label: item.label, value: item.value };
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="segGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.d}
            fill={seg.color}
            opacity={0.9}
            filter="url(#segGlow)"
            stroke="#080808"
            strokeWidth="2"
          >
            <title>
              {seg.label}: {seg.value}%
            </title>
          </path>
        ))}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.4)"
          fontWeight="500"
        >
          BREAKDOWN
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize="14"
          fill="#d4af37"
          fontWeight="700"
        >
          {total}%
        </text>
      </svg>

      <div className="grid grid-cols-3 gap-x-4 gap-y-2 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-white/50 truncate">{item.label}</span>
            <span className="text-[10px] text-white/80 font-bold ml-auto">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────

export default function CommandCenterPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesFilter, setSalesFilter] = useState<SalesFilter>("all");
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/orders"),
      ]);

      if (!analyticsRes.ok) {
        throw new Error(`Analytics API returned ${analyticsRes.status}`);
      }

      const analyticsData: AnalyticsData = await analyticsRes.json();

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData?.recentSales)) {
          analyticsData.recentSales = ordersData.recentSales;
        }
      }

      setAnalytics(analyticsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formattedDate = now.toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-8">
        <style>{`
          @keyframes shimmer {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
        <LoadingSkeleton />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-[#0d0d0d] border border-[#d4af37]/30 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_40px_rgba(212,175,55,0.08)]">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Data Load Failed</h2>
          <p className="text-white/40 text-sm mb-6">
            {error ?? "Could not load dashboard analytics. Please try again."}
          </p>
          <button
            onClick={() => fetchData()}
            className="bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── KPI Cards ─────────────────────────────────────────────────────────────

  const kpiCards = [
    {
      label: "Total Revenue",
      value: formatKES(analytics.totalRevenue),
      icon: DollarSign,
      description: "Lifetime earnings",
      badge: analytics.revenueGrowth,
      link: null as string | null,
      accentClass: "from-[#d4af37]/20 to-[#d4af37]/5",
    },
    {
      label: "Active Orders",
      value: String(analytics.activeOrders),
      icon: ShoppingCart,
      description: "Awaiting fulfilment",
      badge: null as number | null,
      link: "/dashboard/orders",
      accentClass: "from-blue-500/15 to-blue-500/5",
    },
    {
      label: "Low Stock Alerts",
      value: String(analytics.lowStockCount),
      icon: AlertTriangle,
      description: "Products need restocking",
      badge: null as number | null,
      link: "/dashboard/products",
      accentClass: "from-amber-500/15 to-amber-500/5",
    },
    {
      label: "Total Products",
      value: "10",
      icon: Package,
      description: "Listed in catalogue",
      badge: null as number | null,
      link: "/dashboard/products",
      accentClass: "from-emerald-500/15 to-emerald-500/5",
    },
  ];

  const maxSold = Math.max(...analytics.topProducts.map((p) => p.sold), 1);

  const filterLabels: { key: SalesFilter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "7days", label: "7 Days" },
    { key: "30days", label: "30 Days" },
    { key: "all", label: "All Time" },
  ];

  const filteredSales = filterSalesByPeriod(analytics.recentSales, salesFilter);

  const goldShades = [
    "#d4af37",
    "#c9a227",
    "#be9617",
    "#a07810",
    "#876308",
    "#6e4f06",
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 pb-10">
      {/* ── PAGE HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
              Admin Dashboard
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Command Center
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <Calendar className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/35">{formattedDate}</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-[#d4af37]/60 font-mono">{formattedTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 rounded-xl px-4 py-2.5 text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/products"
            target="_blank"
            className="flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 hover:border-[#d4af37]/50 text-[#d4af37] rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Store
          </Link>
        </div>
      </div>

      {/* ── KPI CARDS ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, description, badge, link, accentClass }) => {
          const CardInner = (
            <div
              className={`relative bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5 overflow-hidden group transition-all duration-300 hover:border-white/[0.10] hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] h-full ${link ? "cursor-pointer" : ""}`}
            >
              {/* Hover background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${accentClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />
              {/* Gold top-edge glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <Icon className="w-[18px] h-[18px] text-[#d4af37]" />
                  </div>
                  {badge !== null && badge !== undefined && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
                        badge >= 0
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/15 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {badge >= 0 ? (
                        <TrendingUp className="w-2.5 h-2.5" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5" />
                      )}
                      {Math.abs(badge).toFixed(1)}%
                    </div>
                  )}
                  {link && badge === null && (
                    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-xl lg:text-2xl font-bold text-white tracking-tight leading-none">
                    {value}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold pt-1">
                    {label}
                  </div>
                  <div className="text-[11px] text-white/25">{description}</div>
                </div>
              </div>
            </div>
          );

          return link ? (
            <Link key={label} href={link} className="block">
              {CardInner}
            </Link>
          ) : (
            <div key={label}>{CardInner}</div>
          );
        })}
      </div>

      {/* ── CHARTS ROW ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1">
                Revenue Trend
              </div>
              <h2 className="text-white font-bold text-lg">Monthly Revenue</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
              <span className="text-[11px] text-white/40">KES</span>
            </div>
          </div>

          {analytics.monthlyRevenue.length > 0 ? (
            <RevenueBarChart data={analytics.monthlyRevenue} />
          ) : (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm">
              No revenue data available yet
            </div>
          )}
        </div>

        {/* Demographics Donut Chart */}
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1">
              Customer Insights
            </div>
            <h2 className="text-white font-bold text-lg">Demographics</h2>
          </div>

          {analytics.demographics.length > 0 ? (
            <DonutChart data={analytics.demographics} />
          ) : (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm">
              No demographics data available
            </div>
          )}
        </div>
      </div>

      {/* ── TWO-COL SECTION ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Products */}
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                Best Sellers
              </div>
              <h2 className="text-white font-bold text-[15px]">Top Performing Products</h2>
            </div>
          </div>

          {analytics.topProducts.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-10">No product data yet</p>
          ) : (
            <div className="space-y-5">
              {analytics.topProducts.map((product, idx) => {
                const pct = (product.sold / maxSold) * 100;
                const rankBg =
                  idx === 0
                    ? "bg-[#d4af37] text-[#080808]"
                    : idx === 1
                    ? "bg-white/10 text-white/60"
                    : idx === 2
                    ? "bg-amber-700/30 text-amber-600"
                    : "bg-white/[0.04] text-white/30";

                return (
                  <div key={product.name}>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${rankBg}`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-white/35 truncate">
                          {product.brand}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-white">{product.sold}</div>
                        <div className="text-[9px] text-white/30">units</div>
                      </div>
                    </div>

                    <div className="ml-9 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8960c] transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          boxShadow: "0 0 6px rgba(212,175,55,0.5)",
                        }}
                      />
                    </div>

                    <div className="ml-9 flex items-center justify-between mt-1.5">
                      <span className="text-[9px] text-white/20">
                        {pct.toFixed(0)}% of top seller
                      </span>
                      <span className="text-[10px] text-[#d4af37]/70 font-medium">
                        {formatKES(product.revenue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                Portfolio
              </div>
              <h2 className="text-white font-bold text-[15px]">Category Breakdown</h2>
            </div>
          </div>

          {analytics.categoryBreakdown.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-10">No category data yet</p>
          ) : (
            <div className="space-y-5">
              {analytics.categoryBreakdown.map((cat, idx) => {
                const color = goldShades[idx % goldShades.length];
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-white/80 font-medium">
                          {cat.category}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {cat.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${cat.percentage}%`,
                          background: `linear-gradient(90deg, ${color}bb, ${color})`,
                          boxShadow: `0 0 8px ${color}55`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── RECENT SALES TABLE ───────────────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1">
              Transactions
            </div>
            <h2 className="text-white font-bold text-lg">Recent Sales</h2>
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
            {filterLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSalesFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  salesFilter === key
                    ? "bg-[#d4af37] text-[#080808]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Body */}
        {filteredSales.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-5 h-5 text-white/20" />
            </div>
            <p className="text-white/20 text-sm">No sales for this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {[
                    "Order ID",
                    "Product",
                    "Customer",
                    "Amount",
                    "Date",
                    "Status",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-[9px] uppercase tracking-widest text-white/25 font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale, i) => (
                  <tr
                    key={sale.id}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                      i % 2 !== 0 ? "bg-white/[0.01]" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-[#d4af37] text-xs font-bold tracking-wider">
                        {sale.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/80 font-medium">
                        {sale.product}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/50">{sale.customer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white font-semibold">
                        {formatKES(sale.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-white/35">
                        {new Date(sale.date).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusStyle(
                          sale.status
                        )}`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filteredSales.length > 0 && (
          <div className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-white/25">
              Showing {filteredSales.length} record
              {filteredSales.length !== 1 ? "s" : ""}
            </span>
            <Link
              href="/dashboard/orders"
              className="text-[11px] text-[#d4af37]/60 hover:text-[#d4af37] transition-colors font-medium"
            >
              View all orders →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
