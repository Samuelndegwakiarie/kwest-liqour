"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Bike,
  Store,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ParticleField } from "@/components/ParticleField";
import { GlassCard } from "@/components/GlassCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useReviews } from "@/context/ReviewContext";

interface OrderItem {
  name: string;
  brand: string;
  price: number;
  qty: number;
  volume: string;
  img: string;
}

interface Order {
  id: string;
  date: string;
  status: "processing" | "en route" | "delivered";
  items: OrderItem[];
  trackingNo: string;
  deliveryMethod: "rider" | "shop";
  eta: string;
  actualDeliveryDate?: string;
  address: string;
  paymentMode: string;
}

const mockOrders: Order[] = [
  {
    id: "KW-9812-2026",
    date: "2026-06-18",
    status: "en route",
    items: [
      {
        name: "Blanco Tequila",
        brand: "DON JULIO",
        price: 12500,
        qty: 1,
        volume: "750ml",
        img: "/don_julio_blanco_noir_1778448639327.png",
      },
      {
        name: "Special Dry Gin",
        brand: "GILBEY'S",
        price: 1795,
        qty: 1,
        volume: "750ml",
        img: "/gilbeys_gin_noir_1778448582122.png",
      },
    ],
    trackingNo: "TRK-MPESA-882190",
    deliveryMethod: "rider",
    eta: "June 18, 2026 by 7:30 PM (Today)",
    address: "Signature Towers, Suite 4B, Westlands Road, Nairobi",
    paymentMode: "M-Pesa Verified",
  },
  {
    id: "KW-9412-2026",
    date: "2026-06-18",
    status: "delivered",
    items: [
      {
        name: "Irish Whiskey",
        brand: "JAMESON",
        price: 3200,
        qty: 1,
        volume: "750ml",
        img: "/jameson_whiskey_noir_1778448618517.png",
      },
    ],
    trackingNo: "TRK-MPESA-990815",
    deliveryMethod: "rider",
    eta: "Delivered",
    actualDeliveryDate: "June 18, 2026 at 2:30 PM",
    address: "Westlands, Nairobi",
    paymentMode: "M-Pesa Verified",
  },
  {
    id: "KW-8834-2026",
    date: "2026-06-17",
    status: "processing",
    items: [
      {
        name: "Black Label Scotch",
        brand: "JOHNNIE WALKER",
        price: 5800,
        qty: 2,
        volume: "750ml",
        img: "/johnnie_walker_black_noir_1778448563770.png",
      },
    ],
    trackingNo: "TRK-MPESA-774890",
    deliveryMethod: "rider",
    eta: "June 19, 2026 (Tomorrow)",
    address: "Lavington Green Mall, Block C, Nairobi",
    paymentMode: "M-Pesa Verified",
  },
  {
    id: "KW-7291-2026",
    date: "2026-06-10",
    status: "delivered",
    items: [
      {
        name: "VS Cognac",
        brand: "HENNESSY",
        price: 6500,
        qty: 1,
        volume: "750ml",
        img: "/hennessy_vs_noir_1778448600750.png",
      },
      {
        name: "London Dry Gin",
        brand: "TANQUERAY",
        price: 3500,
        qty: 1,
        volume: "1000ml",
        img: "/tanqueray_london_dry_noir.png",
      },
    ],
    trackingNo: "TRK-MPESA-123456",
    deliveryMethod: "shop",
    eta: "Delivered",
    actualDeliveryDate: "June 10, 2026 at 2:15 PM",
    address: "Pickup: Westlands Flagship Vault Cellar",
    paymentMode: "M-Pesa Verified",
  },
  {
    id: "KW-5192-2026",
    date: "2026-05-24",
    status: "delivered",
    items: [
      {
        name: "Irish Whiskey",
        brand: "JAMESON",
        price: 3200,
        qty: 3,
        volume: "750ml",
        img: "/jameson_whiskey_noir_1778448618517.png",
      },
    ],
    trackingNo: "TRK-MPESA-990812",
    deliveryMethod: "rider",
    eta: "Delivered",
    actualDeliveryDate: "May 24, 2026 at 4:50 PM",
    address: "Kileleshwa, Gichugu Road, House No. 12",
    paymentMode: "M-Pesa Verified",
  },
];

export default function TrackOrdersPage() {
  const { reviews, addReview, hasReviewedOrder } = useReviews();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoverRatings, setHoverRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [localReviewed, setLocalReviewed] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({
    "KW-9812-2026": true, // Expand the most recent by default
  });
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});

  const checkIsWithin24Hours = (dateStr?: string) => {
    if (!dateStr) return false;
    try {
      const parsedDate = new Date(dateStr.replace(" at ", " "));
      const now = new Date();
      const refTime = now.getFullYear() === 2026 ? now.getTime() : new Date("2026-06-18T18:18:24").getTime();
      const diffMs = refTime - parsedDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours >= 0 && diffHours <= 24;
    } catch (e) {
      return false;
    }
  };

  const handleOrderReviewSubmit = (orderId: string, productNames: string[]) => {
    const rating = ratings[orderId] || 5;
    const comment = comments[orderId] || "";
    if (!comment.trim()) {
      alert("Please enter a short review message.");
      return;
    }
    addReview({
      orderId,
      name: "Sir Samuel Ndegwa",
      rating,
      comment: comment.trim(),
      productNames,
    });
    setLocalReviewed((prev) => ({ ...prev, [orderId]: true }));
  };

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Subtotal calculator
  const getOrderTotal = (items: OrderItem[]) => {
    return items.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  // Filters logic
  const filteredOrders = mockOrders.filter((order) => {
    // Search query
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) return false;

    // Date filter
    if (dateFilter === "30days") {
      const orderDate = new Date(order.date);
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - 30);
      if (orderDate < limitDate) return false;
    } else if (dateFilter === "6months") {
      const orderDate = new Date(order.date);
      const limitDate = new Date();
      limitDate.setMonth(limitDate.getMonth() - 6);
      if (orderDate < limitDate) return false;
    } else if (dateFilter === "2026") {
      if (!order.date.startsWith("2026")) return false;
    }

    return true;
  });

  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-16 overflow-x-hidden">
      {/* ═══ Hero ═══ */}
      <section className="relative h-[45vh] lg:h-[50vh] flex items-center justify-center pt-20 lg:pt-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/45 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-15 select-none pointer-events-none"
            alt="Cellar Vault"
          />
        </div>
        <ParticleField count={25} className="z-[5]" />

        <ScrollReveal className="relative z-20 max-w-4xl text-center px-6 space-y-4">
          <span className="text-[9px] font-bold text-primary tracking-[0.3em] uppercase block">
            Cellar Logistics
          </span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter leading-none">
            Track My <span className="gradient-text-static">Orders</span>
          </h1>
          <p className="text-text-muted text-xs tracking-widest max-w-md mx-auto">
            REAL-TIME DISPATCH & HISTORICAL RECORD
          </p>
        </ScrollReveal>
      </section>

      {/* ═══ Main Interface Section ═══ */}
      <section className="px-6 md:px-12 max-w-[1000px] mx-auto py-8">
        <ScrollReveal>
          <div className="space-y-8">
            {/* Search and Filters Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl backdrop-blur-md">
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search order ID or item name..."
                  aria-label="Search orders by ID or item name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                />
              </div>

              {/* Dropdowns / Layout Filters */}
              <div className="flex w-full md:w-auto gap-4 items-center justify-between sm:justify-end">
                <div className="relative flex items-center gap-2 text-xs text-text-muted">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                  <span>Timeframe:</span>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-lg px-3 py-2 text-xs text-white appearance-none cursor-pointer pr-8 font-semibold tracking-wider uppercase"
                  >
                    <option value="all">All Time</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="2026">Year 2026</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Status Filters Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-white/[0.04] pb-4">
              {[
                { val: "all", label: "All Orders", count: mockOrders.length },
                {
                  val: "processing",
                  label: "Processing",
                  count: mockOrders.filter((o) => o.status === "processing").length,
                  color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
                },
                {
                  val: "en route",
                  label: "En Route",
                  count: mockOrders.filter((o) => o.status === "en route").length,
                  color: "border-primary/30 text-primary bg-primary/5",
                },
                {
                  val: "delivered",
                  label: "Delivered",
                  count: mockOrders.filter((o) => o.status === "delivered").length,
                  color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
                },
              ].map((tab) => {
                const active = statusFilter === tab.val;
                return (
                  <button
                    key={tab.val}
                    onClick={() => setStatusFilter(tab.val)}
                    className={`px-5 py-3 rounded-full text-xs font-semibold caps-label tracking-widest border transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? tab.val === "processing"
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          : tab.val === "en route"
                          ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                          : tab.val === "delivered"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                          : "bg-white/10 border-white/30 text-white"
                        : "bg-black/20 border-white/[0.06] text-text-muted hover:text-white hover:border-white/20"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })}
            </div>

            {/* Orders Stack */}
            <AnimatePresence mode="popLayout">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-white/[0.01] border border-white/[0.04] rounded-3xl p-8"
                >
                  <p className="text-text-muted text-sm leading-relaxed">
                    No orders match your search or filter parameters.
                  </p>
                </motion.div>
              ) : (
                <StaggerContainer className="space-y-6">
                  {filteredOrders.map((order) => {
                    const isExpanded = !!expandedOrders[order.id];
                    const orderTotal = getOrderTotal(order.items);

                    // Status Timeline Details
                    let progressWidth = "0%";
                    let activeStep = 0; // 0: Processing, 1: En Route, 2: Delivered
                    if (order.status === "en route") {
                      progressWidth = "50%";
                      activeStep = 1;
                    } else if (order.status === "delivered") {
                      progressWidth = "100%";
                      activeStep = 2;
                    }

                    return (
                      <StaggerItem key={order.id}>
                        <GlassCard
                          padding="p-0"
                          hover={false}
                          className="rounded-3xl border-white/[0.06] overflow-hidden bg-white/[0.01] shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
                        >
                          {/* COLLAPSIBLE HEADER BLOCK */}
                          <div
                            onClick={() => toggleExpand(order.id)}
                            className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="grid grid-cols-2 md:flex md:items-center gap-6 md:gap-12 w-full md:w-auto">
                              <div>
                                <span className="text-[9px] font-bold text-text-subtle tracking-wider uppercase block">
                                  Order Number
                                </span>
                                <h3 className="text-sm font-bold text-white font-mono tracking-tight mt-0.5">
                                  {order.id}
                                </h3>
                              </div>

                              <div>
                                <span className="text-[9px] font-bold text-text-subtle tracking-wider uppercase block">
                                  Date Placed
                                </span>
                                <p className="text-xs font-semibold text-white mt-0.5">
                                  {new Date(order.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>

                              <div>
                                <span className="text-[9px] font-bold text-text-subtle tracking-wider uppercase block">
                                  Total Due
                                </span>
                                <p className="text-xs font-bold text-primary text-glow mt-0.5">
                                  KES {orderTotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                                </p>
                              </div>

                              <div>
                                <span className="text-[9px] font-bold text-text-subtle tracking-wider uppercase block">
                                  Dispensation
                                </span>
                                <span className="text-xs font-semibold text-white mt-0.5 flex items-center gap-1">
                                  {order.deliveryMethod === "rider" ? (
                                    <>
                                      <Bike className="w-3.5 h-3.5 text-primary" /> Rider
                                    </>
                                  ) : (
                                    <>
                                      <Store className="w-3.5 h-3.5 text-secondary" /> Pickup
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t border-white/[0.04] pt-4 md:border-0 md:pt-0">
                              {/* Status Badge */}
                              <span
                                className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border backdrop-blur-sm ${
                                  order.status === "processing"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : order.status === "en route"
                                    ? "bg-primary/10 text-primary border-primary/30"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                }`}
                              >
                                {order.status}
                              </span>

                              {/* Toggle Arrow */}
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-white/30" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-white/30" />
                              )}
                            </div>
                          </div>

                          {/* TIMELINE EXPANSION DETAILS */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden border-t border-white/[0.04]"
                              >
                                <div className="p-6 md:p-8 space-y-8 bg-black/20">
                                  {/* Progress bar timeline */}
                                  <div className="space-y-6 max-w-2xl mx-auto py-4">
                                    <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-visible">
                                      {/* Background filling line */}
                                      <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: progressWidth }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="h-full bg-primary shadow-[0_0_12px_rgba(0,240,255,0.6)]"
                                      />

                                      {/* Steps */}
                                      <div className="absolute inset-0 flex justify-between items-center -top-2">
                                        {[
                                          { label: "Cellar Release", icon: Clock },
                                          { label: "Rider Dispatch", icon: Bike },
                                          { label: "Vault Secured", icon: ShieldCheck },
                                        ].map((step, idx) => {
                                          const reached = idx <= activeStep;
                                          const active = idx === activeStep;
                                          return (
                                            <div key={idx} className="flex flex-col items-center">
                                              <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 ${
                                                  reached
                                                    ? active
                                                      ? "bg-background border-primary text-primary scale-110 shadow-[0_0_10px_rgba(0,240,255,0.4)] animate-pulse"
                                                      : "bg-primary border-primary text-background"
                                                    : "bg-background-elevated border-white/10 text-white/20"
                                                }`}
                                              >
                                                <step.icon className="w-3.5 h-3.5 stroke-[2.5]" />
                                              </div>
                                              <span
                                                className={`text-[9px] font-bold caps-label tracking-widest mt-2 transition-colors ${
                                                  reached ? "text-white" : "text-text-subtle"
                                                }`}
                                              >
                                                {step.label}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Details breakdown */}
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                                    {/* Items List (Col span 7) */}
                                    <div className="md:col-span-7 space-y-4">
                                      <h4 className="text-[10px] caps-label text-text-muted tracking-wider border-b border-white/[0.04] pb-2">
                                        Consolidated Items
                                      </h4>
                                      <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                          <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-14 h-14 bg-black/40 border border-white/[0.06] rounded-xl flex items-center justify-center p-1.5 shrink-0">
                                              <img src={item.img} alt={item.name} className="h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <span className="text-[9px] font-bold text-primary tracking-widest uppercase">
                                                {item.brand}
                                              </span>
                                              <h5 className="text-xs font-bold text-white leading-tight mt-0.5">
                                                {item.name}
                                              </h5>
                                              <p className="text-[9px] text-text-subtle mt-0.5 font-semibold">
                                                {item.volume} • Qty: {item.qty}
                                              </p>
                                            </div>
                                            <span className="text-xs font-bold text-white shrink-0 font-mono">
                                              KES {(item.price * item.qty).toLocaleString()}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Delivery Logistics Details (Col span 5) */}
                                    <div className="md:col-span-5 bg-black/30 border border-white/[0.04] rounded-2xl p-6 space-y-4 text-xs">
                                      <h4 className="text-[10px] caps-label text-text-muted tracking-wider border-b border-white/[0.04] pb-2">
                                        Vault Delivery Details
                                      </h4>
                                      <div className="space-y-3">
                                        <div>
                                          <span className="text-[9px] text-text-subtle uppercase block">Recipient Address</span>
                                          <p className="text-white font-medium mt-0.5">{order.address}</p>
                                        </div>
                                        <div className="flex justify-between border-t border-white/[0.04] pt-2">
                                          <div>
                                            <span className="text-[9px] text-text-subtle uppercase block">Tracking Reference</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <span className="text-white font-mono font-semibold">{order.trackingNo}</span>
                                              <button
                                                onClick={() => handleCopy(order.id, order.trackingNo)}
                                                className="text-primary hover:text-white transition-colors cursor-pointer"
                                                title="Copy Tracking Number"
                                              >
                                                {copyStates[order.id] ? (
                                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                ) : (
                                                  <Copy className="w-3.5 h-3.5" />
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex justify-between border-t border-white/[0.04] pt-2">
                                          <div>
                                            <span className="text-[9px] text-text-subtle uppercase block">Estimated Delivery / ETA</span>
                                            <p className="text-white font-medium mt-0.5">{order.eta}</p>
                                          </div>
                                        </div>
                                        {order.actualDeliveryDate && (
                                          <div className="flex justify-between border-t border-white/[0.04] pt-2">
                                            <div>
                                              <span className="text-[9px] text-text-subtle uppercase block">Delivered Date</span>
                                              <p className="text-emerald-400 font-bold mt-0.5">{order.actualDeliveryDate}</p>
                                            </div>
                                          </div>
                                        )}

                                        {/* Inline Feedback / Review System */}
                                        {order.status === "delivered" && (
                                          <div className="border-t border-white/[0.04] pt-4 mt-2">
                                            {hasReviewedOrder(order.id) || localReviewed[order.id] ? (
                                              /* Feedback Submitted */
                                              (() => {
                                                const rev = reviews.find((r) => r.orderId === order.id) || {
                                                  rating: ratings[order.id] || 5,
                                                  comment: comments[order.id] || "",
                                                };
                                                return (
                                                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 space-y-2">
                                                    <span className="text-[8px] font-bold text-emerald-400 tracking-wider uppercase block">
                                                      Feedback Logged
                                                    </span>
                                                    <div className="flex gap-1">
                                                      {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                          key={i}
                                                          className={`w-3 h-3 ${
                                                            i < rev.rating
                                                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                                                              : "text-white/10"
                                                          }`}
                                                        />
                                                      ))}
                                                    </div>
                                                    <p className="text-white/80 text-[11px] italic leading-relaxed">
                                                      &ldquo;{rev.comment}&rdquo;
                                                    </p>
                                                  </div>
                                                );
                                              })()
                                            ) : checkIsWithin24Hours(order.actualDeliveryDate) ? (
                                              /* Review prompt form (within 24h) */
                                              <div className="space-y-3">
                                                <span className="text-[9px] font-bold text-primary tracking-wider uppercase block">
                                                  Share Your Feedback
                                                </span>
                                                <div className="flex gap-1.5 py-1">
                                                  {[1, 2, 3, 4, 5].map((starVal) => (
                                                    <button
                                                      key={starVal}
                                                      type="button"
                                                      onClick={() => setRatings(prev => ({ ...prev, [order.id]: starVal }))}
                                                      onMouseEnter={() => setHoverRatings(prev => ({ ...prev, [order.id]: starVal }))}
                                                      onMouseLeave={() => setHoverRatings(prev => ({ ...prev, [order.id]: 0 }))}
                                                      className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                                    >
                                                      <Star
                                                        className={`w-4 h-4 transition-all ${
                                                          starVal <= (hoverRatings[order.id] || ratings[order.id] || 5)
                                                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                                                            : "text-white/20"
                                                        }`}
                                                      />
                                                    </button>
                                                  ))}
                                                </div>
                                                <textarea
                                                  value={comments[order.id] || ""}
                                                  onChange={(e) => setComments(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                  placeholder="Feedback comment (text-only)..."
                                                  aria-label="Feedback comment text"
                                                  maxLength={150}
                                                  rows={2}
                                                  className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-lg p-2.5 text-base md:text-xs text-white placeholder:text-white/20 resize-none transition-all"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleOrderReviewSubmit(
                                                      order.id,
                                                      order.items.map((i) => `${i.brand} ${i.name}`)
                                                    )
                                                  }
                                                  className="w-full py-2 bg-primary text-background font-bold text-[9px] caps-label tracking-widest rounded-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
                                                >
                                                  Submit Review
                                                </button>
                                              </div>
                                            ) : (
                                              /* Exceeded 24 hours */
                                              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-center text-text-subtle text-[10px]">
                                                Review period has expired (24h limit)
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex gap-2.5 pt-4 border-t border-white/[0.04]">
                                        <Link
                                          href={`/contact?ref=${order.id}`}
                                          className="flex-1 text-center py-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-primary/30 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all text-primary flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                          Get Help
                                          <ExternalLink className="w-3 h-3" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </GlassCard>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
