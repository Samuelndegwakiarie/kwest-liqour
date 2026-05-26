"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";

export default function Heritage() {
  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-0">
      {/* ═══ Hero ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover"
            alt="Nairobi Skyline"
          />
        </div>
        <ParticleField count={35} className="z-[5]" />

        <div className="relative z-20 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter mb-4 leading-none"
          >
            A <span className="gradient-text-static">Beautiful</span> Sight
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-muted caps-label text-[10px] tracking-[0.4em]"
          >
            THE NAIROBI RESERVE EXPERIENCE
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="w-[2px] h-10 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ═══ Our Story ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background">
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-10 bg-primary/60" />
              <span className="caps-label text-primary text-[10px]">LEGACY</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 tracking-tighter">
              Our Story
            </h2>
            <p className="text-text-muted text-base md:text-lg leading-relaxed mb-12">
              Born from a desire to bridge the gap between global craft and
              Nairobi&apos;s burgeoning connoisseur culture, Kwest is more than a
              boutique. It is a sanctuary for those who appreciate the patience of
              the aging process and the artistry of the master blender.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="scale">
            <div className="aspect-[4/5] relative overflow-hidden rounded-2xl border border-white/[0.06]">
              <img
                src="/story_bottle_noir.png"
                className="w-full h-full object-cover"
                alt="Story Bottle"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ The Curation ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background border-y border-white/[0.04]">
        <div className="max-w-[900px] mx-auto text-right">
          <ScrollReveal direction="right">
            <div className="flex items-center gap-4 mb-6 justify-end">
              <span className="caps-label text-primary text-[10px]">PHILOSOPHY</span>
              <div className="h-[1px] w-10 bg-primary/60" />
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 tracking-tighter">
              The Curation
            </h2>
            <p className="text-text-muted text-base md:text-lg leading-relaxed mb-12">
              Each bottle in our reserve is hand-selected by our master curators.
              From rare vintage single malts to artisanal small-batch gins, we
              prioritize liquids that tell a story of origin, time, and
              uncompromising quality.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="scale">
            <div className="aspect-video relative overflow-hidden rounded-2xl border border-white/[0.06]">
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover"
                alt="Curation Lounge"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ The Vision ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter">
              The Vision
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Cultural Anchor",
                desc: "Defining Nairobi's new standard for luxury spirits.",
                img: "/nairobi_culture_noir_vision_1778448735584.png",
              },
              {
                title: "Unrivaled Access",
                desc: "Allocations reserved for the discerning few.",
                img: "/private_vault_noir_vision_1778448756948.png",
              },
              {
                title: "Education & Legacy",
                desc: "Tasting masterclasses and heritage experiences.",
                img: "/education_legacy_noir_vision.png",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <GlassCard hover padding="p-0" className="rounded-2xl overflow-hidden group">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={item.img}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl font-serif font-bold text-primary mb-2 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-text-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ Join The Reserve ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background-elevated border-t border-white/[0.04]">
        <ScrollReveal>
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tighter">
              Join The Reserve
            </h2>
            <p className="text-text-muted text-sm md:text-base leading-relaxed mb-10">
              Receive exclusive invitations to private releases and tasting events
              in Nairobi.
            </p>
            <div className="flex flex-col gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="bg-white/[0.03] border border-white/[0.08] px-8 py-5 text-sm caps-label focus:border-primary/40 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] outline-none text-white placeholder:text-white/20 rounded-xl transition-all duration-300"
              />
              <button className="px-10 py-5 bg-primary text-background font-bold uppercase tracking-[0.2em] text-[11px] rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-500 cursor-pointer">
                REQUEST ACCESS
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
