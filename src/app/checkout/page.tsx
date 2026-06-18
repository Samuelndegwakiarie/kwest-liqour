"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  MapPin,
  ChevronLeft,
  Calendar,
  Phone,
  User as UserIcon,
  Mail,
  Locate,
  CreditCard,
  QrCode,
  DollarSign,
  ArrowRight,
  Loader2,
  Bike,
  Store,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/CartContext";
import { useReviews } from "@/context/ReviewContext";
import { ParticleField } from "@/components/ParticleField";
import { GlassCard } from "@/components/GlassCard";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { addReview } = useReviews();
  const [deliveryMethod, setDeliveryMethod] = useState<"shop" | "rider">("rider");
  const [isClient, setIsClient] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  const [paymentOption, setPaymentOption] = useState<"mpesa" | "paypal">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");

  // UI States
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<"idle" | "stk" | "pin" | "verify" | "success">("idle");
  const [orderRef, setOrderRef] = useState("");
  const [stkProgress, setStkProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const savedMethod = localStorage.getItem("kwest_delivery_method") as "shop" | "rider" | null;
    if (savedMethod) {
      setDeliveryMethod(savedMethod);
    }
  }, []);

  // Geocoding Coordinates lookup
  const handleDetectLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setIsGeolocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coordsStr = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setCoordinates(coordsStr);
          await lookupCoordinates(latitude, longitude);
          setIsGeolocating(false);
        },
        (error) => {
          console.error("Geolocation error", error);
          setIsGeolocating(false);
          // Fallback to manual entry alert
          alert("Could not detect location automatically. Please enter coordinates manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleCoordinatesChange = async (val: string) => {
    setCoordinates(val);
    // Check if coordinates format is valid lat, lon
    const parts = val.split(",").map((p) => p.trim());
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
        await lookupCoordinates(lat, lon);
      }
    }
  };

  const lookupCoordinates = async (lat: number, lon: number) => {
    setIsLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "KwestLiquorApp/1.0",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
          const locName =
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.town ||
            data.address.city ||
            "Nairobi";
          setLocation(locName);
          setIsLoadingAddress(false);
          return;
        }
      }
    } catch (err) {
      console.warn("OSM Nominatim failed, using fallback mock", err);
    }

    // Realistic Nairobi Mock Geocode Fallback
    setTimeout(() => {
      setAddress(`Signature Towers, Suite 4B, Westlands Road, Nairobi (Precise Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)})`);
      setLocation("Westlands, Nairobi");
      setIsLoadingAddress(false);
    }, 1000);
  };

  // Complete Order
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert("Please fill in all required fields.");
      return;
    }
    if (deliveryMethod === "rider" && !address) {
      alert("Please enter your delivery address or type coordinates.");
      return;
    }
    if (paymentOption === "mpesa" && !mpesaPhone) {
      alert("Please enter your M-Pesa phone number.");
      return;
    }

    // Start checkout processing animation flow
    setIsSubmitting(true);
    setOrderRef(`KW-${Math.floor(1000 + Math.random() * 9000)}-2026`);
    setPurchasedItems(cart.map((item) => `${item.brand} ${item.name}`));

    if (paymentOption === "mpesa") {
      setSubmitStep("stk");
      // Simulate STK Push prompt (takes 2s)
      setTimeout(() => {
        setSubmitStep("pin");
        // Simulate waiting for PIN entry (takes 2s)
        setTimeout(() => {
          setSubmitStep("verify");
          // Simulate verification (takes 1.5s)
          setTimeout(() => {
            setSubmitStep("success");
            setIsSubmitting(false);
          }, 1500);
        }, 2000);
      }, 2000);
    } else {
      // Direct success if payment is bypass/mock
      setTimeout(() => {
        setSubmitStep("success");
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const handleSuccessFinished = () => {
    clearCart();
    localStorage.removeItem("kwest_delivery_method");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please enter a short review message.");
      return;
    }
    addReview({
      orderId: orderRef,
      name: fullName || "Guest Member",
      rating,
      comment: comment.trim(),
      productNames: purchasedItems,
    });
    setReviewSubmitted(true);
  };

  // Pricing calculations
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
    <main className="bg-background min-h-screen relative overflow-hidden pb-[calc(var(--bottom-nav-height)+2rem)] lg:pb-16 pt-24 lg:pt-28">
      {/* Background visual templates */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/45 to-background z-10" />
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-15 select-none pointer-events-none"
          alt="Bar Glass Background"
        />
      </div>
      <ParticleField count={20} className="z-[5]" />

      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {submitStep !== "success" ? (
            /* ═══ FORM LAYOUT ═══ */
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6"
            >
              {/* Left Column: Form Details & Payment */}
              <div className="lg:col-span-7 space-y-6">
                {/* Header Back Link */}
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 text-[10px] caps-label text-text-muted hover:text-white transition-colors group cursor-pointer mb-2"
                >
                  <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  Return to Cart
                </Link>

                <GlassCard padding="p-6 md:p-8" hover={false} glow={true} className="border-primary/5">
                  <form onSubmit={handleOrderSubmit} className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-white border-b border-white/[0.06] pb-4">
                      Delivery Details
                    </h2>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Recipient Name *</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Samuel Ndegwa"
                            className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Email Address (Optional)</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="samuel@example.com"
                            className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+254 700 000 000"
                            className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                          />
                        </div>
                      </div>

                      {/* Precise Coordinates Selection */}
                      {deliveryMethod === "rider" && (
                        <div className="pt-2 space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] caps-label text-text-muted">GPS Coordinates (Precise Delivery)</label>
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              disabled={isGeolocating}
                              className="text-[9px] caps-label text-primary hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/[0.02] border border-white/[0.08] px-3 py-1.5 rounded-lg"
                            >
                              {isGeolocating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Locate className="w-3 h-3" />
                              )}
                              Detect Location
                            </button>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={coordinates}
                              onChange={(e) => handleCoordinatesChange(e.target.value)}
                              placeholder="e.g. -1.286389, 36.817223"
                              className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 transition-all border-b-2 font-mono"
                            />
                            {isLoadingAddress && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                              </div>
                            )}
                          </div>
                          <p className="text-[9px] text-text-subtle">
                            Enter coordinates in decimal degrees (latitude, longitude) to reverse geocode and instantly populate your address.
                          </p>
                        </div>
                      )}

                      {/* Location & Address Text Field */}
                      <div className="space-y-1">
                        <label className="text-[10px] caps-label text-text-muted">
                          {deliveryMethod === "shop" ? "Pickup Location Details" : "Location & Delivery Address *"}
                        </label>
                        {deliveryMethod === "shop" ? (
                          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-1.5 text-xs">
                            <p className="text-white font-semibold flex items-center gap-1.5">
                              <Store className="w-4 h-4 text-primary" /> Store Location Details
                            </p>
                            <p className="text-text-muted">
                              Kwest Flagship Cellar Vault, Landmark Plaza, Westlands Road, Nairobi.
                            </p>
                            <p className="text-text-subtle font-medium text-[10px] uppercase tracking-wider">
                              Open Daily: 9:00 AM - 10:00 PM
                            </p>
                          </div>
                        ) : (
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                              type="text"
                              required
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Landmark Plaza, Westlands Road, Nairobi"
                              className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ═══ PAYMENT SECTION ═══ */}
                    <div className="border-t border-white/[0.06] pt-6 space-y-6">
                      <h3 className="text-xl font-serif font-bold text-white tracking-tight">
                        Payment Option
                      </h3>

                      <div className="space-y-3">
                        {/* Option 1: Pay with M-Pesa */}
                        <div
                          onClick={() => setPaymentOption("mpesa")}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            paymentOption === "mpesa"
                              ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                              : "bg-black/20 border-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-[10px] text-emerald-400">
                              M-P
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white uppercase tracking-wider">Pay with M-Pesa</p>
                              <p className="text-[9px] text-text-subtle mt-0.5">Send STK Push prompt to your phone</p>
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              paymentOption === "mpesa" ? "border-primary" : "border-white/20"
                            }`}
                          >
                            {paymentOption === "mpesa" && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                        </div>

                        {/* Option 2: Pay with PayPal (Coming Soon) */}
                        <div className="p-4 rounded-xl border border-white/[0.04] bg-black/10 opacity-40 flex items-center justify-between cursor-not-allowed select-none">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center font-bold text-[10px] text-blue-400">
                              PP
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-white uppercase tracking-wider">Pay with PayPal</p>
                                <span className="bg-white/10 text-white border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase">
                                  COMING SOON
                                </span>
                              </div>
                              <p className="text-[9px] text-text-subtle mt-0.5">Secure card/account checkouts</p>
                            </div>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-white/10" />
                        </div>
                      </div>

                      {/* M-Pesa details input */}
                      <AnimatePresence>
                        {paymentOption === "mpesa" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-black/30 border border-white/[0.04] rounded-xl p-4 space-y-3">
                              <label className="text-[9px] caps-label text-text-muted">M-Pesa Mobile Number *</label>
                              <input
                                type="tel"
                                required={paymentOption === "mpesa"}
                                value={mpesaPhone}
                                onChange={(e) => setMpesaPhone(e.target.value)}
                                placeholder="e.g. 0712345678"
                                className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 transition-all border-b-2 font-mono"
                              />
                              <p className="text-[9px] text-text-subtle leading-relaxed">
                                Enter your Safaricom mobile number. When you complete the order, a secure PIN prompt will display on your screen.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Order Action Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            Complete Order
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </GlassCard>
              </div>

              {/* Right Column: Invoice items review */}
              <div className="lg:col-span-5 space-y-6">
                <GlassCard padding="p-6 md:p-8" hover={false} className="space-y-6 border-white/[0.04]">
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight border-b border-white/[0.06] pb-4">
                    Items Review
                  </h3>

                  {/* Cart list preview */}
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-black/40 border border-white/[0.06] rounded-lg shrink-0 flex items-center justify-center p-1">
                          <img src={item.img} alt={item.name} className="h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate leading-tight">{item.name}</h4>
                          <p className="text-[10px] text-text-subtle mt-0.5">Qty: {item.quantity} • {item.volume}</p>
                        </div>
                        <span className="text-xs font-semibold text-white">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Pricing */}
                  <div className="border-t border-white/[0.06] pt-4 space-y-3.5 text-xs">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">KES {subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-text-muted">
                      <span>Delivery Method</span>
                      <span className="text-primary font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">
                        {deliveryMethod === "shop" ? (
                          <>
                            <Store className="w-3.5 h-3.5" /> Store Pickup
                          </>
                        ) : (
                          <>
                            <Bike className="w-3.5 h-3.5" /> Rider Delivery
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-text-muted pb-4 border-b border-white/[0.06]">
                      <span>Delivery Fee</span>
                      {deliveryMethod === "shop" ? (
                        <span className="text-primary font-bold uppercase text-[9px] tracking-wider">Free</span>
                      ) : (
                        <span className="text-primary font-bold uppercase text-[8px] tracking-wider leading-tight text-right">
                          Pay Rider Directly
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-end pt-2">
                      <span className="text-white font-medium text-sm">Amount Due</span>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary text-glow font-serif">
                          KES {total.toLocaleString()}
                        </p>
                        <p className="text-[8px] text-text-subtle uppercase tracking-widest mt-0.5">
                          VAT Included
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex gap-3 text-[11px] text-text-subtle">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>Luminous verification matches payment prompt for immediate cellar allocation release.</span>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ) : (
            /* ═══ SUCCESS SCREEN LAYOUT ═══ */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto py-12"
            >
              <GlassCard padding="p-8 text-center" hover={false} glow={true} className="border-emerald-500/10 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                  <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-emerald-400 tracking-[0.3em] uppercase">
                    Checkout Completed
                  </span>
                  <h3 className="text-3xl font-serif font-bold text-white">Order Vaulted</h3>
                  <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
                    Your payment was verified, and your spirits are being prepared for dispatch.
                  </p>
                </div>

                {/* Details list */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-5 text-left text-xs space-y-3.5 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-white/[0.04] pb-2 text-[10px] caps-label text-text-muted">
                    <span>Reference ID</span>
                    <span className="text-white font-mono font-bold text-glow">{orderRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Recipient</span>
                    <span className="text-white font-medium">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Contact Phone</span>
                    <span className="text-white font-medium">{phone}</span>
                  </div>
                  {deliveryMethod === "rider" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Rider Delivery Address</span>
                        <span className="text-white font-medium text-right truncate max-w-[200px]" title={address}>
                          {address}
                        </span>
                      </div>
                      {coordinates && (
                        <div className="flex justify-between">
                          <span className="text-text-muted">Coordinates</span>
                          <span className="text-white font-mono text-[10px]">{coordinates}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Pickup Location</span>
                      <span className="text-primary font-bold uppercase tracking-wider text-[9px]">
                        Westlands Flagship Store
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-muted">Payment Mode</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px]">
                      M-Pesa Verified
                    </span>
                  </div>
                </div>

                {/* Simulated Delivery Countdown Tracker */}
                <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl text-left max-w-md mx-auto space-y-3">
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-primary animate-bounce" /> Real-time Dispatch Tracker
                  </p>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 15, ease: "linear" }}
                      className="h-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-text-subtle">
                    <span>Compiling Cellar Bottles</span>
                    <span>Rider Dispatched</span>
                    <span>Arrived</span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed border-t border-white/[0.04] pt-2">
                    A Kwest Sommelier representative will check on your delivery route and dial you shortly to align on your prompt dispatch arrival.
                  </p>
                </div>

                {/* Customer Review Prompt */}
                <div className="pt-6 border-t border-white/[0.04] max-w-md mx-auto space-y-4">
                  <AnimatePresence mode="wait">
                    {!reviewSubmitted ? (
                      <motion.div
                        key="review-prompt"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                            Rate Your Experience
                          </h4>
                          <p className="text-[10px] text-text-subtle">
                            Help us maintain our premium concierge standards
                          </p>
                        </div>

                        {/* Interactive Star Selector */}
                        <div className="flex gap-2 justify-center py-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                            >
                              <Star
                                className={`w-6 h-6 transition-all ${
                                  starVal <= (hoverRating || rating)
                                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                                    : "text-white/20"
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        {/* Text input */}
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Express your thoughts succinctly (text-only)..."
                          maxLength={200}
                          rows={3}
                          className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl p-3.5 text-xs text-white placeholder:text-white/20 resize-none transition-all border-b-2"
                        />

                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={handleReviewSubmit}
                            className="w-full py-3.5 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                          >
                            Submit Feedback
                          </button>
                          <Link href="/products" onClick={handleSuccessFinished} className="text-center text-[10px] caps-label text-text-muted hover:text-white transition-colors cursor-pointer mt-1">
                            Skip & Go to Gallery
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="review-thanks"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 py-4"
                      >
                        <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase block">
                          Feedback Logged
                        </span>
                        <h4 className="text-lg font-serif font-bold text-white">
                          Thank you for your review!
                        </h4>
                        <p className="text-text-muted text-xs leading-relaxed max-w-xs mx-auto">
                          Your connoisseur insight has been published to the circle vault database.
                        </p>
                        <div className="pt-2">
                          <Link href="/products" onClick={handleSuccessFinished}>
                            <button className="px-8 py-3.5 bg-white/[0.04] border border-white/[0.08] text-primary hover:text-white hover:border-primary/30 text-xs font-semibold caps-label tracking-widest rounded-xl transition-all cursor-pointer">
                              Return to Gallery
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ M-PESA STK DIALOGS / OVERLAYS ═══ */}
        <AnimatePresence>
          {isSubmitting && submitStep !== "success" && (
            <div className="fixed inset-0 z-[350] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 backdrop-blur-md"
              />

              {/* STK Overlay Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm relative z-10"
              >
                <GlassCard padding="p-6 text-center animate-pulse-glow" hover={false} glow={true} className="border-primary/20 bg-background-elevated">
                  {submitStep === "stk" && (
                    <div className="space-y-6 py-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Initiating STK Push</p>
                        <h4 className="text-lg font-serif font-bold text-white">Sending Request...</h4>
                        <p className="text-text-muted text-xs leading-relaxed pt-2">
                          We are initiating an M-Pesa STK Push request to <span className="text-white font-mono font-bold">{mpesaPhone}</span>.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStep === "pin" && (
                    <div className="space-y-6 py-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                        <QrCode className="w-6 h-6 text-emerald-400 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">PIN Entry Prompted</p>
                        <h4 className="text-lg font-serif font-bold text-white">Check Your Phone</h4>
                        <p className="text-text-muted text-xs leading-relaxed pt-2">
                          Please enter your M-Pesa PIN on the SIM popup screen showing on your phone to authorize payment of <span className="text-white font-bold">KES {total.toLocaleString()}</span> to KWEST LIQUOR.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStep === "verify" && (
                    <div className="space-y-6 py-4">
                      <div className="w-14 h-14 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-6 h-6 text-secondary animate-bounce" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Verifying Payment</p>
                        <h4 className="text-lg font-serif font-bold text-white">Confirming Transaction...</h4>
                        <p className="text-text-muted text-xs leading-relaxed pt-2">
                          Payment message received. Accessing M-Pesa gateways to verify transaction authenticity.
                        </p>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
