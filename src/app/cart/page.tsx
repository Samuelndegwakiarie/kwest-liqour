"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Lock,
  ChevronLeft,
  Store,
  Bike,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<"shop" | "rider">("rider");
  const [isClient, setIsClient] = useState(false);
  const [showRiderAlert, setShowRiderAlert] = useState(false);
  const alertTimerRef = useRef<any>(null);

  // Avoid Next.js hydration issues with local storage
  useEffect(() => {
    setIsClient(true);
    const savedMethod = localStorage.getItem("kwest_delivery_method") as "shop" | "rider" | null;
    if (savedMethod) {
      setDeliveryMethod(savedMethod);
    }
  }, []);

  const handleDeliveryChange = (method: "shop" | "rider") => {
    setDeliveryMethod(method);
    localStorage.setItem("kwest_delivery_method", method);
    
    // Clear any active timer
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }
    
    if (method === "rider") {
      setShowRiderAlert(false);
      setTimeout(() => {
        setShowRiderAlert(true);
        alertTimerRef.current = setTimeout(() => {
          setShowRiderAlert(false);
        }, 5000);
      }, 50);
    } else {
      setShowRiderAlert(false);
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  if (!isClient) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-16 overflow-x-hidden">
      {/* ═══ Hero ═══ */}
      <section className="relative h-[50vh] flex items-center justify-center pt-20 lg:pt-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background z-10" />
          <Image
            src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80"
            fill
            priority
            className="object-cover opacity-30 select-none pointer-events-none"
            alt="Bar Spirits Background"
            sizes="100vw"
            quality={70}
          />
        </div>
        <ParticleField count={30} className="z-[5]" />

        <ScrollReveal className="relative z-20 max-w-4xl text-center px-6">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter mb-4 leading-none">
            Your <span className="gradient-text-static">Cellar</span> Cart
          </h1>
          <p className="text-text-muted caps-label text-[10px] tracking-[0.4em] max-w-md mx-auto">
            SECURE CHECKOUT PREPARATION
          </p>
        </ScrollReveal>
      </section>

      {/* ═══ Main Cart Interface ═══ */}
      <section className="px-6 md:px-12 max-w-[1280px] mx-auto py-12">
        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
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
                  {cart.map((item) => (
                    <StaggerItem key={item.id}>
                      <GlassCard padding="p-5 md:p-6" hover={false} className="relative group">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          {/* Image container */}
                          <div className="w-24 h-24 shrink-0 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-center p-2 relative overflow-hidden group">
                            <Image
                              src={item.img}
                              fill
                              sizes="96px"
                              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                              alt={item.name}
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
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-white text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                              onClick={() => removeFromCart(item.id)}
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
                <GlassCard padding="p-6 md:p-8" hover={false} glow={true} className="space-y-6 relative overflow-hidden border-white/[0.08]">
                  {/* Subtle top-right ambient gold/cyan gradient glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08)_0%,transparent_70%)] pointer-events-none" />
                  
                  <div className="flex justify-between items-start border-b border-white/[0.06] pb-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white tracking-tight">
                        Checkout Invoice
                      </h3>
                      <p className="text-[8px] text-text-subtle tracking-widest uppercase mt-0.5">
                        Secure Cellar Summary
                      </p>
                    </div>
                    {/* Mock Invoice Serial Barcode tag */}
                    <div className="text-[8px] font-mono border border-white/[0.08] px-2.5 py-1 rounded bg-black/40 text-white/30 tracking-widest uppercase">
                      KW-582-X
                    </div>
                  </div>

                  {/* Delivery Selection */}
                  <div className="space-y-3">
                    <h4 className="text-[9px] caps-label text-text-muted tracking-wider">Delivery Option</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pick at Shop */}
                      <button
                        onClick={() => handleDeliveryChange("shop")}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between h-24 relative overflow-hidden ${
                          deliveryMethod === "shop"
                            ? "bg-primary/[0.04] border-primary text-primary shadow-[0_0_20px_rgba(0,240,255,0.08)]"
                            : "bg-black/30 border-white/[0.05] text-text-muted hover:border-white/20 hover:bg-white/[0.02] hover:text-white"
                        }`}
                      >
                        {deliveryMethod === "shop" && (
                          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
                        )}
                        <Store className={`w-4 h-4 transition-transform duration-300 ${deliveryMethod === "shop" ? "scale-110" : ""}`} />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider">Pick at Shop</p>
                          <p className="text-[8px] text-text-subtle mt-1">Complimentary</p>
                        </div>
                      </button>

                      {/* Rider */}
                      <button
                        onClick={() => handleDeliveryChange("rider")}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between h-24 relative overflow-hidden ${
                          deliveryMethod === "rider"
                            ? "bg-primary/[0.04] border-primary text-primary shadow-[0_0_20px_rgba(0,240,255,0.08)]"
                            : "bg-black/30 border-white/[0.05] text-text-muted hover:border-white/20 hover:bg-white/[0.02] hover:text-white"
                        }`}
                      >
                        {deliveryMethod === "rider" && (
                          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
                        )}
                        <Bike className={`w-4 h-4 transition-transform duration-300 ${deliveryMethod === "rider" ? "scale-110" : ""}`} />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider">Rider</p>
                          <p className="text-[8px] text-text-subtle mt-1">Pay on Delivery</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Rider Alert Banner */}
                  <AnimatePresence>
                    {showRiderAlert && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{
                          opacity: [0, 1, 0, 1], // dynamic flash effect (flashes 2 times)
                          height: "auto",
                          marginTop: 16,
                        }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{
                          opacity: { times: [0, 0.35, 0.7, 1], duration: 1.5 },
                          height: { duration: 0.3 },
                          marginTop: { duration: 0.3 }
                        }}
                        className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-3.5 text-xs flex items-start gap-3 shadow-[0_0_20px_rgba(245,158,11,0.02)] relative overflow-hidden"
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-primary animate-pulse" />
                        <div className="text-left">
                          <p className="font-bold tracking-wider uppercase text-[8px] text-primary">Rider Fees Alert</p>
                          <p className="mt-0.5 text-text-muted leading-relaxed">
                            You will pay the rider fees upon delivery.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 pt-5 border-t border-dashed border-white/[0.08]">
                    <div className="flex justify-between text-xs text-text-muted tracking-wide">
                      <span>Subtotal</span>
                      <span className="text-white font-semibold">
                        KES {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-text-muted tracking-wide">
                      <span>Delivery Service</span>
                      {deliveryMethod === "shop" ? (
                        <span className="text-primary font-bold tracking-widest text-[9px] caps-label text-glow">
                          FREE
                        </span>
                      ) : (
                        <span className="text-primary font-bold tracking-widest text-[9px] caps-label text-right leading-tight text-glow">
                          PAY RIDER ON DELIVERY
                        </span>
                      )}
                    </div>

                    {/* Total Box */}
                    <div className="bg-black/45 border border-white/[0.04] p-4 rounded-xl flex items-center justify-between mt-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                      <div>
                        <span className="text-xs font-semibold text-text-muted tracking-wide block">Grand Total</span>
                        <span className="text-[9px] text-text-subtle tracking-wider uppercase mt-0.5 block">
                          16% VAT Included
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary text-glow font-serif tracking-tight">
                          KES {total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Action */}
                  <Link href="/checkout" className="block w-full pt-2">
                    <button
                      className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-[#060B18] font-bold text-xs caps-label tracking-widest rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:shadow-[0_0_35px_rgba(0,240,255,0.45)] hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      Checkout
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-[9px] caps-label tracking-wider text-text-subtle mt-4">
                    <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                    <span>Luminous Secure Dispatch Guarantee</span>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
