"use client";

import { ChevronDown, MapPin, LayoutGrid, Building2, Map, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { ParticleField } from "@/components/ParticleField";
import dynamic from "next/dynamic";
import contactAnimation from "../../../public/contact_animation.json";

const serviceCards = [
  {
    title: "Private Tastings",
    desc: "Guided sensory journeys through our rarest reserves, led by certified master distillers.",
    cta: "INQUIRE NOW",
    icon: LayoutGrid,
    img: "/private_tasting_noir.png",
  },
  {
    title: "Wholesale & Trade",
    desc: "Strategic inventory solutions and exclusive allocation for Nairobi's premier hospitality venues.",
    cta: "PARTNERSHIP TERMS",
    icon: Building2,
    img: "/wholesale_trade_noir.png",
  },
  {
    title: "The Boutique",
    desc: "Visit our flagship location for a personalized curation session with our house sommeliers.",
    cta: "VIEW LOCATION",
    icon: MapPin,
    img: "/boutique_flagship_noir.png",
  },
];

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Concierge() {
  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-0">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-background px-6 md:px-12">
        <ParticleField count={30} className="z-[5]" />
        <div className="relative z-20 max-w-[900px] mx-auto text-center">
          <ScrollReveal>
            <span className="caps-label text-primary mb-4 block tracking-[0.4em] text-[10px] text-glow">
              EXCLUSIVE ACCESS
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter mb-6 leading-none">
              Talk to{" "}
              <span className="gradient-text-static">Us</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Our specialized concierge team is at your disposal for bespoke
              spirits procurement and private events.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ Service Cards ═══ */}
      <section className="py-8 px-6 md:px-12 bg-background">
        <StaggerContainer className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.12}>
          {serviceCards.map((card) => (
            <StaggerItem key={card.title}>
              <div className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.06] cursor-pointer">
                <img
                  src={card.img}
                  className="w-full h-full object-cover opacity-35 group-hover:opacity-55 group-hover:scale-105 transition-all duration-[2000ms]"
                  alt={card.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-left">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-tight max-w-[200px] md:max-w-xs">
                      {card.title}
                    </h3>
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <card.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-text-muted text-xs md:text-sm mb-6 leading-relaxed max-w-xs">
                    {card.desc}
                  </p>
                  <button className="flex items-center gap-2 caps-label text-[9px] text-primary hover:text-white transition-colors duration-300 w-fit cursor-pointer">
                    {card.cta}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Shimmer border effect on hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/20 transition-colors duration-700 pointer-events-none" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ═══ Inquiry Form ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background border-t border-white/[0.04]">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-12 tracking-tighter">
              Send an Inquiry
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Lottie Animation */}
            <ScrollReveal direction="left" className="w-full flex items-center justify-center">
              <div className="w-full max-w-md aspect-square relative rounded-2xl overflow-hidden glass-card flex items-center justify-center p-8 border border-white/[0.04] bg-white/[0.01]">
                <Lottie
                  animationData={contactAnimation}
                  loop={true}
                  autoplay={true}
                  className="w-full h-full opacity-60 hover:opacity-80 transition-opacity duration-500 scale-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </ScrollReveal>

            {/* Right Column: Contact Form */}
            <ScrollReveal direction="right" delay={0.1}>
              <GlassCard hover={false} padding="p-8 md:p-12" className="rounded-2xl w-full">
                <form className="space-y-8">
                  <div className="space-y-6">
                    <div className="group">
                      <input
                        type="text"
                        placeholder="FULL NAME"
                        className="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-sm caps-label focus:border-primary outline-none text-white placeholder:text-white/20 transition-all duration-300"
                      />
                    </div>
                    <div className="group">
                      <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        className="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-sm caps-label focus:border-primary outline-none text-white placeholder:text-white/20 transition-all duration-300"
                      />
                    </div>
                    <div className="relative group">
                      <select className="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-sm caps-label text-white/40 focus:text-white focus:border-primary outline-none appearance-none cursor-pointer transition-all duration-300">
                        <option className="bg-background-elevated">SELECT SERVICE TYPE</option>
                        <option className="bg-background-elevated">PRIVATE TASTING</option>
                        <option className="bg-background-elevated">WHOLESALE</option>
                        <option className="bg-background-elevated">MEMBERSHIP</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    </div>
                    <div className="group">
                      <textarea
                        placeholder="MESSAGE"
                        rows={4}
                        className="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-sm caps-label focus:border-primary outline-none text-white placeholder:text-white/20 resize-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  <button className="w-full py-5 bg-primary text-background font-bold uppercase tracking-[0.2em] text-[11px] rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-500 cursor-pointer">
                    SEND MESSAGE
                  </button>
                </form>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ Map Section ═══ */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal>
            <GlassCard hover={false} padding="p-0" className="rounded-2xl overflow-hidden mb-10">
              <div className="relative aspect-[4/5] md:aspect-[21/9]">
                <iframe
                  src="https://maps.google.com/maps?q=Muthaiga%20Road,%20Nairobi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 opacity-75 hover:opacity-90 transition-opacity duration-500 dark-map-iframe"
                  allowFullScreen
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
                  Nairobi Flagship
                </h2>
                <p className="text-text-muted caps-label text-[10px] tracking-widest">
                  THE RESERVE PLAZA, MUTHAIGA ROAD
                </p>
                <p className="text-text-muted caps-label text-[10px] tracking-widest">
                  OPEN MON-SAT: 10AM - 9PM
                </p>
              </div>
              <button className="px-8 py-4 bg-white/[0.04] border border-white/[0.08] text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-300 flex items-center gap-3 cursor-pointer">
                <Map className="w-4 h-4 text-primary" />
                GET DIRECTIONS
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
