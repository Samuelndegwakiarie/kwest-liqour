"use client";

import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Star, Zap, Trophy } from "lucide-react";
import Link from "next/link";
import { products, formatPrice } from "@/data/products";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Hero />
      
      {/* The Boutique Collections */}
      <section className="py-24 px-6 bg-black text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4 block">CURATED SELECTIONS</span>
        <h2 className="text-4xl md:text-6xl font-serif font-black text-white mb-16 tracking-tight uppercase">
          The Boutique <br /> Collections
        </h2>

        <div className="space-y-6 max-w-lg mx-auto">
          {[
            { name: "Rare Malts", image: "https://images.unsplash.com/photo-1569158062925-993d08596642?auto=format&fit=crop&q=80&w=800" },
            { name: "Vintage Wines", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800" },
            { name: "Artisanal Gins", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800" },
          ].map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-[16/9] overflow-hidden group border border-white/5"
            >
              <img src={cat.image} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={cat.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end items-start p-8 text-left">
                <h3 className="text-2xl font-serif font-black text-white mb-2 uppercase">{cat.name}</h3>
                <Link href="/products" className="text-[8px] font-bold tracking-[0.3em] text-primary flex items-center gap-2 group/link">
                  SHOP COLLECTION <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join The Kwest Circle */}
      <section className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-lg mx-auto bg-black border border-white/5 p-12 text-center rounded-sm">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-black text-white mb-6 tracking-tight uppercase leading-none">
            Join The Kwest <br /> Circle
          </h2>
          <p className="text-foreground/50 text-sm font-medium leading-relaxed mb-10 max-w-xs mx-auto">
            Access members-only allocations, private tasting events, and the Nairobi concierge service.
          </p>
          <button className="w-full py-5 bg-primary text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors">
            Request Invitation
          </button>
        </div>
      </section>

      {/* Commitment to Excellence */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-lg mx-auto">
          <div className="aspect-[3/4] overflow-hidden mb-12 border border-white/5">
            <img 
              src="/commitment_excellence_man_1778434185488.png" 
              className="w-full h-full object-cover grayscale opacity-80" 
              alt="Commitment to Excellence"
            />
          </div>
          <h2 className="text-4xl font-serif font-black text-white mb-8 tracking-tight uppercase">
            Commitment to <br /> Excellence
          </h2>
          <blockquote className="border-l border-primary pl-6 py-2 mb-10">
            <p className="text-foreground/60 italic text-lg leading-relaxed mb-6 font-medium">
              "True quality is never accidental. It is the result of high intention, sincere effort, and intelligent execution; it represents the wise choice of many alternatives."
            </p>
            <cite className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary not-italic">
              — Chief Grand Sommelier, Kwest
            </cite>
          </blockquote>
        </div>
      </section>

      {/* The Weekly Journal */}
      <section className="py-24 px-6 bg-[#0d0d0d] border-y border-white/5">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-serif font-black text-white mb-6 tracking-tight uppercase">
            The Weekly Journal
          </h2>
          <p className="text-foreground/40 text-sm font-medium mb-10">
            Stay informed on rare arrivals, tasting notes, and exclusive events at Nairobi Reserve.
          </p>
          <div className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full bg-black border border-white/10 px-8 py-5 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-primary transition-colors text-white uppercase"
            />
            <button className="w-full py-5 bg-transparent border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
