"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { BottleExplosion } from "./BottleExplosion";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Mobile Background Image */}
      <div className="lg:hidden absolute inset-0 z-0">
        <img 
          src="/luxury_liquor_hero_mobile_1778434120163.png" 
          alt="Hero background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Text Content */}
        <div className="relative z-10 text-center lg:text-left pt-10 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hidden lg:flex items-center gap-4 mb-10">
              <div className="w-12 h-px bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">Est. 1994 • Rare Spirits</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-black text-foreground leading-tight md:leading-[0.85] mb-6 md:mb-10 tracking-tighter uppercase">
              The Art of <br className="hidden md:block" />
              <span className="text-primary italic">Fine Spirits</span>
            </h1>
            
            <p className="text-sm md:text-lg lg:text-xl text-foreground/70 md:text-foreground/50 max-w-md mx-auto lg:mx-0 mb-10 md:mb-12 font-medium uppercase tracking-widest leading-relaxed">
              Discover Nairobi's most exclusive collection of rare vintages and artisanal masterpieces.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8">
              <Link 
                href="/products" 
                className="w-full md:w-auto text-center px-10 py-5 bg-primary text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-primary/90 transition-all duration-300"
              >
                Catalog The Reserve
              </Link>
              <Link
                href="/about"
                className="w-full md:w-auto text-center px-10 py-5 bg-transparent border border-primary text-primary font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-primary/10 transition-all"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 3D Bottle Animation - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block relative h-[600px] lg:h-[800px]"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
          </div>
          <BottleExplosion />
        </motion.div>
      </div>

      {/* Decorative Background Text - Hidden on mobile */}
      <div className="hidden lg:block absolute -bottom-10 left-0 right-0 pointer-events-none overflow-hidden whitespace-nowrap opacity-[0.03]">
        <span className="text-[250px] font-serif font-black uppercase tracking-tighter select-none">
          KWEST LIQUOR KWEST LIQUOR
        </span>
      </div>
    </section>
  );
}
