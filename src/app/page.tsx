"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };
  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-0">
      {/* ═══ Hero Section ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"
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
    </main>
  );
}
