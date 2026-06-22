"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronDown, CheckCircle2, ShoppingBag, Gift, Check } from "lucide-react";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { RotatingReviews } from "@/components/RotatingReviews";
import { useCart } from "@/context/CartContext";

function PromoTimer({ endsAt }: { endsAt?: string | null }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    // Fallback: if endsAt is missing or invalid, default to 2 days in the future
    const target = endsAt ? new Date(endsAt).getTime() : (Date.now() + 2 * 24 * 60 * 60 * 1000);

    const updateTimer = () => {
      const now = Date.now();
      const difference = target - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!timeLeft) return null;

  return (
    <div className="space-y-2">
      <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold animate-pulse">OFFER ENDS IN:</span>
      <div className="flex items-center gap-3">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hrs", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds },
        ].map((item, idx) => (
          <div key={item.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="min-w-[48px] bg-white/[0.03] border border-white/[0.08] rounded-lg py-2 px-3 text-center shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <span className="font-mono text-lg font-bold text-white tracking-tight">
                  {String(item.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[8px] uppercase tracking-wider text-white/40 mt-1 font-semibold">
                {item.label}
              </span>
            </div>
            {idx < 3 && (
              <span className="font-mono text-lg font-bold text-white/30 ml-3 shrink-0 animate-pulse">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [addedBannerIds, setAddedBannerIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/admin/promo-banners")
      .then((res) => res.json())
      .then((data) => {
        setBanners(data.filter((b: any) => b.active));
      })
      .catch((err) => console.error("Error loading banners:", err));
  }, []);

  const handleBannerAddToCart = (banner: any) => {
    addToCart({
      id: 10000 + banner.id,
      brand: "EXCLUSIVE",
      name: banner.title,
      price: banner.price,
      img: banner.img,
      category: "Promo",
      volume: "Offer Pack",
      tag: "OFFER",
    }, 1);
    setToastMessage(`Added "${banner.title}" to Cart!`);
    setTimeout(() => setToastMessage(""), 2500);
    // Mark this banner button as added for 2 seconds
    setAddedBannerIds((prev) => new Set(prev).add(banner.id));
    setTimeout(() => {
      setAddedBannerIds((prev) => {
        const next = new Set(prev);
        next.delete(banner.id);
        return next;
      });
    }, 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <main className="bg-background min-h-screen pb-16 lg:pb-0">
      {/* ═══ Hero Section ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background z-10" />
          <img
            src="/hero-homepage.jpg"
            className="w-full h-full object-cover scale-105"
            alt="Luxury Spirits Pour"
          />
        </div>

        {/* Particles */}
        <ParticleField count={50} className="z-[5]" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="caps-label text-primary mb-8 block tracking-[0.5em] text-[10px] text-glow"
          >
            ESTABLISHED IN NAIROBI
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-[90px] font-serif font-bold text-white mb-8 leading-[0.95] tracking-tighter"
          >
            The Art of{" "}
            <span className="gradient-text-static">Fine Spirits</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-text-muted text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Curated luxury delivered to your doorstep. Experience a selection of
            the world&apos;s most rare and exceptional bottles, handpicked for the
            discerning palate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="group w-full sm:w-auto px-10 py-4 bg-primary text-background font-bold uppercase tracking-[0.2em] text-[11px] rounded-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer"
            >
              EXPLORE THE RESERVE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-10 py-4 border border-white/[0.15] text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-lg hover:bg-white/[0.06] hover:border-primary/30 transition-all duration-500 text-center cursor-pointer"
            >
              OUR STORY
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-8 h-12 rounded-full border border-white/[0.15] flex items-start justify-center pt-2">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══ Curator's Choice ═══ */}
      <section className="py-16 md:py-28 px-6 md:px-12 bg-background">
        <div className="max-w-[1440px] mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
              <div className="space-y-3">
                <span className="caps-label text-primary text-[10px] tracking-[0.4em]">CURATED SELECTION</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-none">
                  The Curator&apos;s Choice
                </h2>
              </div>
              <Link
                href="/products"
                className="caps-label text-primary/70 text-[10px] tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
              >
                VIEW ALL
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rare Malts */}
            <StaggerItem>
              <Link href="/products?category=whisky" className="group relative aspect-[3/4] overflow-hidden rounded-2xl block cursor-pointer border border-white/[0.06]">
                <img
                  src="/rare_malts_category_noir.png"
                  className="w-full h-full object-cover opacity-90 contrast-[1.15] group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms]"
                  alt="Rare Malts"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                  <span className="caps-label text-primary text-[9px] mb-2 block tracking-[0.4em]">DISCOVER</span>
                  <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">
                    Rare Malts
                  </h3>
                  <p className="text-text-muted text-xs mb-4 leading-relaxed transition-all duration-500 ease-out translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 overflow-hidden">
                    Single origin legends from the highlands, curated for Nairobi&apos;s finest collections.
                  </p>
                  <div className="flex items-center gap-3 text-primary group-hover:text-white transition-colors">
                    <span className="caps-label text-[10px] tracking-[0.2em]">BROWSE COLLECTION</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {/* Vintage Wines */}
            <StaggerItem>
              <Link href="/products?category=wine" className="group relative aspect-[3/4] overflow-hidden rounded-2xl block cursor-pointer border border-white/[0.06]">
                <img
                  src="/vintage_wines_category_noir.png"
                  className="w-full h-full object-cover opacity-90 contrast-[1.15] group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms]"
                  alt="Vintage Wines"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                  <span className="caps-label text-primary text-[9px] mb-2 block tracking-[0.4em]">DISCOVER</span>
                  <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">Vintage Wines</h3>
                  <p className="text-text-muted text-xs mb-4 leading-relaxed transition-all duration-500 ease-out translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 overflow-hidden">
                    Old world estates meets modern luxury. Carefully preserved vintage collections.
                  </p>
                  <div className="flex items-center gap-3 text-primary group-hover:text-white transition-colors">
                    <span className="caps-label text-[10px] tracking-[0.2em]">EXPLORE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {/* Artisanal Gins */}
            <StaggerItem>
              <Link href="/products?category=gin" className="group relative aspect-[3/4] overflow-hidden rounded-2xl block cursor-pointer border border-white/[0.06]">
                <img
                  src="/artisanal_gins_category_noir.png"
                  className="w-full h-full object-cover opacity-90 contrast-[1.15] group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms]"
                  alt="Artisanal Gins"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                  <span className="caps-label text-primary text-[9px] mb-2 block tracking-[0.4em]">DISCOVER</span>
                  <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">Artisanal Gins</h3>
                  <p className="text-text-muted text-xs mb-4 leading-relaxed transition-all duration-500 ease-out translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 max-h-0 group-hover:max-h-20 overflow-hidden">
                    Small batch botanical infusions and premium international craft distillations.
                  </p>
                  <div className="flex items-center gap-3 text-primary group-hover:text-white transition-colors">
                    <span className="caps-label text-[10px] tracking-[0.2em]">EXPLORE</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {/* Membership CTA */}
            <StaggerItem className="md:col-span-3">
              <GlassCard glow padding="p-10 md:p-16" className="h-full flex flex-col justify-center rounded-2xl">
                <span className="caps-label text-secondary text-[9px] mb-6 block tracking-[0.5em] text-glow-amber">
                  MEMBER EXCLUSIVE
                </span>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 tracking-tighter leading-none">
                  Join The Kwest Circle
                </h3>
                <p className="text-text-muted text-sm md:text-base max-w-2xl mb-10 leading-relaxed text-left">
                  Gain early access to limited edition releases and private tasting
                  events across Nairobi. Our members enjoy concierge delivery and
                  exclusive pricing.
                </p>
                <Link href="/account">
                  <button className="w-fit px-10 py-4 border border-primary/30 text-primary hover:bg-primary hover:text-background font-bold uppercase tracking-[0.2em] text-[11px] rounded-lg transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] cursor-pointer">
                    REQUEST INVITATION
                  </button>
                </Link>
              </GlassCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ Promo Banners ═══ */}
      {banners.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12 bg-background border-t border-white/[0.04]">
          <div className="max-w-[1440px] mx-auto">
            <ScrollReveal>
              <div className="mb-12 space-y-3">
                <span className="caps-label text-primary text-[10px] tracking-[0.4em]">VAULT EXCLUSIVES</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                  Limited Offers & Drops
                </h2>
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-8">
              {banners.map((banner) => (
                <ScrollReveal key={banner.id} direction="up">
                  <div
                    className="w-full flex flex-col-reverse md:flex-row items-stretch rounded-2xl text-left group overflow-hidden relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-primary/25 cursor-pointer hover:bg-white/[0.05] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(0,240,255,0.03)] hover:shadow-[0_35px_80px_-10px_rgba(0,0,0,0.95),0_0_55px_rgba(0,240,255,0.15)] transition-all duration-500 hover:-translate-y-1.5"
                  >
                    {/* Subtle top edge gradient line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-20" />

                    {/* Left Column: Text Content */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center space-y-6 relative z-10">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30 w-fit shadow-[0_2px_10px_rgba(212,175,55,0.05)] group-hover:border-[#d4af37]/45 transition-all duration-500">
                          <Gift className="w-3.5 h-3.5" /> SAVE KES {banner.discountAmount}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-none transition-all duration-500">
                          {banner.title}
                        </h3>
                        <p className="text-text-muted text-sm md:text-base max-w-2xl leading-relaxed">
                          {banner.description}
                        </p>
                      </div>

                      {/* Countdown Timer */}
                      <PromoTimer endsAt={banner.endsAt} />

                      <button
                        onClick={() => handleBannerAddToCart(banner)}
                        disabled={addedBannerIds.has(banner.id)}
                        className={`w-full sm:w-fit px-10 py-4 font-bold text-[11px] caps-label tracking-widest rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                          addedBannerIds.has(banner.id)
                            ? "bg-emerald-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] scale-[1.01]"
                            : "bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                      >
                        {addedBannerIds.has(banner.id) ? (
                          <><Check className="w-4 h-4" /> ADDED TO CART</>
                        ) : (
                          <><ShoppingBag className="w-4 h-4" /> ADD TO CART</>
                        )}
                      </button>
                    </div>

                    {/* Right Column: Product Image Card */}
                    <div className="w-full md:w-[45%] bg-black/30 border-t md:border-t-0 md:border-l border-white/[0.08] flex flex-col items-center justify-center p-8 shrink-0 relative overflow-hidden">
                      {/* Ambient background light glows */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.04)_0%,transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />

                      {/* Price Badge Above Image */}
                      <div className="absolute top-4 right-4 bg-[#060B18]/90 border border-primary/20 backdrop-blur-md rounded-xl px-4 py-2 shadow-[0_0_20px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] group-hover:border-primary/40 transition-all duration-500 z-10">
                        <span className="font-serif font-bold text-base text-primary text-glow">
                          KES {banner.price.toLocaleString()}
                        </span>
                      </div>
                      <img
                        src={banner.img}
                        alt={banner.title}
                        className="h-[80%] max-h-[260px] object-contain group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-700 mt-6 z-10"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Stats Section ═══ */}
      <section className="py-12 md:py-20 px-6 md:px-12 bg-background border-y border-white/[0.04]">
        <ScrollReveal>
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { target: 20, suffix: "+", label: "Years of Curation" },
              { target: 500, suffix: "+", label: "Rare Bottles" },
              { target: 100, suffix: "+", label: "Global Brands" },
            ].map((stat) => (
              <GlassCard key={stat.label} padding="p-8 md:p-10" className="text-center rounded-2xl">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  className="text-5xl md:text-6xl font-serif font-bold text-white text-glow"
                  labelClassName="caps-label text-[10px] text-text-muted tracking-[0.3em]"
                  label={stat.label}
                />
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ Reviews Section ═══ */}
      <RotatingReviews />

      {/* ═══ Newsletter ═══ */}
      <section className="py-16 md:py-32 px-6 md:px-12 bg-background">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter leading-none">
              Stay Informed
            </h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Subscribe to receive updates on new arrivals, vintage drops, and
              exclusive event invitations.
            </p>
            <div className="max-w-xl mx-auto">
              <AnimatePresence mode="wait">
                {!subscribed ? (
                  <motion.form
                    key="subscribe-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-xl border border-white/[0.08]"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/[0.03] px-8 py-5 text-sm focus:outline-none focus:bg-white/[0.06] text-white placeholder:text-white/20 transition-all duration-300"
                    />
                    <button type="submit" className="px-10 py-5 bg-primary text-background font-bold uppercase tracking-[0.2em] text-[11px] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-500 cursor-pointer">
                      JOIN
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="subscribe-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3 p-5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider text-glow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Subscribed successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>
      </section>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-6 z-[120] bg-[#060b18]/90 border border-primary/20 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.15)]"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-white tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
