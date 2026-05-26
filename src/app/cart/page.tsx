"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Lock,
  ShieldCheck,
  Check,
  MapPin,
  CreditCard,
  Tag,
  ChevronLeft,
  Calendar,
  Sparkles,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";

interface CartItem {
  id: number;
  brand: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  tag?: string | null;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      brand: "JOHNNIE WALKER",
      name: "Black Label Scotch",
      price: 5800,
      img: "/johnnie_walker_black_noir_1778448563770.png",
      quantity: 1,
      tag: "BEST SELLER",
    },
    {
      id: 3,
      brand: "HENNESSY",
      name: "VS Cognac",
      price: 6500,
      img: "/hennessy_vs_noir_1778448600750.png",
      quantity: 1,
      tag: "LUXURY",
    },
    {
      id: 6,
      brand: "TANQUERAY",
      name: "London Dry Gin",
      price: 3500,
      img: "/tanqueray_london_dry_noir.png",
      quantity: 2,
      tag: null,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [giftWrap, setGiftWrap] = useState(false);
  const [waxSeal, setWaxSeal] = useState(false);

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Details, 2 = Success
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("Same-Day Evening");
  const [customNotes, setCustomNotes] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    if (promoCode.trim().toUpperCase() === "KWESTVIP") {
      setAppliedDiscount(15);
      setPromoSuccess("VIP 15% Discount applied successfully!");
    } else if (promoCode.trim() !== "") {
      setPromoError("Invalid concierge code");
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const giftWrapFee = giftWrap ? 1000 : 0;
  const waxSealFee = waxSeal ? 2500 : 0;
  const deliveryFee = subtotal > 15000 || subtotal === 0 ? 0 : 1500;
  const total = subtotal - discountAmount + giftWrapFee + waxSealFee + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert("Please fill in all required fields.");
      return;
    }
    setCheckoutStep(2);
  };

  const handleResetCart = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    setCheckoutStep(1);
    setFullName("");
    setPhone("");
    setAddress("");
    setGiftWrap(false);
    setWaxSeal(false);
    setAppliedDiscount(0);
    setPromoCode("");
  };

  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-16 overflow-x-hidden">
      {/* ═══ Hero ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
            alt="Bar Spirits Background"
          />
        </div>
        <ParticleField count={30} className="z-[5]" />

        <ScrollReveal className="relative z-20 max-w-4xl text-center px-6">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter mb-4 leading-none">
            Your <span className="gradient-text-static">Cellar</span> Cart
          </h1>
          <p className="text-text-muted caps-label text-[10px] tracking-[0.4em] max-w-md mx-auto">
            SECURE CONCIERGE DISPATCH PREPARATION
          </p>
        </ScrollReveal>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-[2px] h-10 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* ═══ Main Cart Interface ═══ */}
      <section className="px-6 md:px-12 max-w-[1280px] mx-auto py-12">
        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center py-20 max-w-lg mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,240,255,0.02)]">
                <ShoppingBag className="w-8 h-8 text-white/20" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Your Cellar is Empty
              </h2>
              <p className="text-text-muted mb-10 text-sm leading-relaxed">
                You have not selected any fine spirits to be prepared. Explore our reserve to choose your bottles.
              </p>
              <Link href="/products">
                <button className="px-8 py-4 rounded-full bg-primary text-background font-bold text-xs caps-label tracking-widest hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-pointer">
                  Explore The Reserve
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Left Column: Cart Items list */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                  <span className="caps-label text-text-muted text-[10px]">Product details</span>
                  <span className="caps-label text-text-muted text-[10px] hidden sm:block">Subtotal</span>
                </div>

                <StaggerContainer className="space-y-4">
                  {cartItems.map((item) => (
                    <StaggerItem key={item.id}>
                      <GlassCard padding="p-5 md:p-6" hover={false} className="relative group">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          {/* Image container */}
                          <div className="w-24 h-24 shrink-0 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-center p-2 relative overflow-hidden group">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 text-center sm:text-left min-w-0">
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2">
                              <span className="text-[9px] font-bold text-primary tracking-widest uppercase">
                                {item.brand}
                              </span>
                              {item.tag && (
                                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold tracking-widest uppercase">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-serif font-bold text-white mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-text-muted text-xs font-semibold mb-4 sm:mb-0">
                              KES {item.price.toLocaleString()}
                            </p>
                          </div>

                          {/* Controls & Subtotal */}
                          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                            {/* Quantity selector */}
                            <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-full p-1">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-white text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Total price for item */}
                            <div className="sm:w-28 text-right hidden sm:block">
                              <span className="text-sm font-bold text-white text-glow">
                                KES {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-white/20 hover:text-destructive transition-colors duration-300 cursor-pointer p-2 rounded-full hover:bg-white/[0.02]"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Continue shopping link */}
                <div className="pt-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-[10px] caps-label text-primary hover:text-white transition-colors group cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    Continue Cellar Exploration
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="space-y-6">
                <GlassCard padding="p-6 md:p-8" hover={false} glow={true} className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight border-b border-white/[0.06] pb-4">
                    Concierge Invoice
                  </h3>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">
                        KES {subtotal.toLocaleString()}
                      </span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>VIP Discount ({appliedDiscount}%)</span>
                        <span>- KES {discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Premium Options */}
                    <div className="pt-2 border-t border-white/[0.04] space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="pt-0.5">
                          <input
                            type="checkbox"
                            checked={giftWrap}
                            onChange={(e) => setGiftWrap(e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                              giftWrap
                                ? "bg-primary border-primary shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                                : "border-white/[0.15] group-hover:border-primary/50"
                            }`}
                          >
                            {giftWrap && <Check className="w-2.5 h-2.5 text-background stroke-[3]" />}
                          </div>
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="text-white font-medium flex items-center gap-1.5">
                            Premium Box Packaging <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
                          </div>
                          <p className="text-text-subtle mt-0.5">Custom velvet lining (+ KES 1,000)</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="pt-0.5">
                          <input
                            type="checkbox"
                            checked={waxSeal}
                            onChange={(e) => setWaxSeal(e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                              waxSeal
                                ? "bg-primary border-primary shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                                : "border-white/[0.15] group-hover:border-primary/50"
                            }`}
                          >
                            {waxSeal && <Check className="w-2.5 h-2.5 text-background stroke-[3]" />}
                          </div>
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="text-white font-medium">Custom Engraved Wax Seal</div>
                          <p className="text-text-subtle mt-0.5">Bespoke monogram sealing (+ KES 2,500)</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between text-text-muted pt-2 border-t border-white/[0.04]">
                      <span>Delivery Fee</span>
                      {deliveryFee === 0 ? (
                        <span className="text-primary font-bold tracking-widest text-[10px] caps-label">
                          COMPLIMENTARY
                        </span>
                      ) : (
                        <span className="text-white font-medium">
                          KES {deliveryFee.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-text-subtle border-b border-white/[0.06] pb-4">
                      * Complimentary courier for selections above KES 15,000
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-white font-medium">Grand Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary text-glow font-serif">
                          KES {total.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-text-subtle tracking-wider uppercase mt-0.5">
                          16% VAT Included
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Promo Input */}
                  <div className="pt-4 border-t border-white/[0.06]">
                    <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-primary" /> Concierge Access Code
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter VIP / Curator Code"
                        className="bg-black/30 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 flex-1 transition-all"
                      />
                      <button
                        onClick={applyPromo}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-primary/30 transition-all text-xs font-semibold text-white cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-destructive text-[10px] mt-1.5 font-medium">{promoError}</p>
                    )}
                    {promoSuccess && (
                      <p className="text-emerald-400 text-[10px] mt-1.5 font-medium">{promoSuccess}</p>
                    )}
                    <p className="text-text-subtle text-[9px] mt-1">Try the VIP code: <span className="text-primary font-bold font-mono">KWESTVIP</span></p>
                  </div>

                  {/* Checkout Action */}
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    Proceed to Concierge Dispatch
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-text-subtle mt-4">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    <span>Luminous Secure Dispatch Guarantee</span>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══ Concierge Checkout Modal ═══ */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => checkoutStep === 1 && setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-xl relative z-10"
            >
              <GlassCard padding="p-6 md:p-8 animate-pulse-glow" hover={false} glow={true}>
                {checkoutStep === 1 ? (
                  /* Form Step */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                    <div className="flex justify-between items-start border-b border-white/[0.06] pb-4">
                      <div>
                        <span className="caps-label text-primary text-[9px]">CONCIERGE COURIER</span>
                        <h3 className="text-2xl font-serif font-bold text-white mt-1">Dispatch Details</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCheckoutOpen(false)}
                        className="text-white/40 hover:text-white cursor-pointer text-xs uppercase tracking-widest font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Recipient Name *</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Arthur Pendragon"
                            className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Contact Phone *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+254 700 000 000"
                            className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Nairobi Delivery Address *</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Suite 4B, Signature Towers, Westlands"
                            className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Schedule Selection */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Dispatch Timing</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: "Immediate", desc: "Under 90 min" },
                            { name: "Same-Day Evening", desc: "6 PM - 9 PM" },
                            { name: "Scheduled Tasting", desc: "Select Date" },
                          ].map((t) => (
                            <button
                              key={t.name}
                              type="button"
                              onClick={() => setDeliveryTime(t.name)}
                              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                                deliveryTime === t.name
                                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                                  : "bg-black/20 border-white/[0.06] text-text-muted hover:border-white/20"
                              }`}
                            >
                              <p className="text-[10px] font-bold uppercase tracking-wider">{t.name.split(" ")[0]}</p>
                              <p className="text-[8px] text-text-subtle mt-0.5">{t.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Curator Notes */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Notes for Curated Prep (Optional)</label>
                        <textarea
                          value={customNotes}
                          onChange={(e) => setCustomNotes(e.target.value)}
                          placeholder="e.g. Leave with reception, wrap as anniversary gift, dial down chill temperature..."
                          rows={2}
                          className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Summary row */}
                    <div className="bg-black/30 border border-white/[0.04] rounded-xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-text-muted uppercase tracking-widest text-[9px]">INVOICE TOTAL</p>
                        <p className="text-lg font-bold text-white font-serif mt-0.5">KES {total.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-[9px] uppercase tracking-wider">CONCIERGE ASSISTANCE</p>
                        <p className="text-[9px] text-text-subtle">Payment verified upon call/dispatch</p>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      Confirm Concierge Dispatch
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* Success Step */
                  <div className="text-center py-6 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      >
                        <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-emerald-400 tracking-[0.3em] uppercase">
                        Dispatch Confirmed
                      </span>
                      <h3 className="text-3xl font-serif font-bold text-white">Cellar Request Received</h3>
                      <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                        Your request has been dispatched to the Kwest Master Cellar. A curator is compiling your bottles now.
                      </p>
                    </div>

                    {/* Order summary info */}
                    <div className="max-w-md mx-auto bg-black/40 border border-white/[0.06] rounded-2xl p-5 text-left text-xs space-y-3.5">
                      <div className="flex justify-between border-b border-white/[0.04] pb-2 text-[10px] caps-label text-text-muted">
                        <span>Invoice Reference</span>
                        <span className="text-white font-mono font-bold text-glow">
                          KW-{Math.floor(1000 + Math.random() * 9000)}-2026
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Recipient</span>
                        <span className="text-white font-medium">{fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Phone</span>
                        <span className="text-white font-medium">{phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Delivery Address</span>
                        <span className="text-white font-medium text-right truncate max-w-[200px]" title={address}>
                          {address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Dispatch Schedule</span>
                        <span className="text-primary font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {deliveryTime}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-left max-w-md mx-auto">
                      <p className="text-xs font-semibold text-white flex items-center gap-1.5 mb-1">
                        <Phone className="w-3.5 h-3.5 text-primary" /> Curatorial Verification
                      </p>
                      <p className="text-text-muted text-[11px] leading-relaxed">
                        To maintain secure concierge dispatch protocols, a Kwest curator will call or WhatsApp you at <span className="text-white font-bold">{phone}</span> within 10 minutes to verify your order details, discuss payment options (M-Pesa / Card / Bank transfer), and initiate immediate cellar release.
                      </p>
                    </div>

                    <div className="pt-4 flex gap-4 justify-center">
                      <button
                        onClick={handleResetCart}
                        className="px-8 py-3.5 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                      >
                        Return to Gallery
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
