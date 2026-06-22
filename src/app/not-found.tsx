"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { ParticleField } from "@/components/ParticleField";
import dynamic from "next/dynamic";

const DotLottiePlayer = dynamic(
  () => import("@dotlottie/react-player").then((mod) => mod.DotLottiePlayer),
  { ssr: false }
);

export default function NotFound() {
  const [lottieExists, setLottieExists] = useState(false);

  useEffect(() => {
    // Check if the lottie JSON exists in public directory
    fetch("/404-animation.json", { method: "HEAD" })
      .then(res => {
        if (res.ok) setLottieExists(true);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center relative overflow-hidden px-6 text-center">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-[#080808] z-10" />
        <div className="absolute inset-0 bg-[#d4af37]/[0.01] mix-blend-color-dodge" />
      </div>
      <ParticleField count={25} className="z-[5]" />

      <div className="relative z-20 max-w-lg w-full flex flex-col items-center space-y-8">
        {/* Animation Container */}
        <div className="w-full max-w-[280px] aspect-square flex items-center justify-center relative">
          {lottieExists ? (
            <div className="w-full h-full opacity-70 hover:opacity-90 transition-opacity duration-300">
              <DotLottiePlayer
                src="/404-animation.json"
                loop
                autoplay
                className="w-full h-full"
              />
            </div>
          ) : (
            // Premium SVG Fallback Animation
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              {/* Neon Glow Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#d4af37]/10 via-[#d4af37]/5 to-transparent animate-pulse blur-xl" />
              
              {/* SVG Glass Illustration */}
              <svg className="w-32 h-32 text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ animationDuration: '3s' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              
              {/* Spinning Ring */}
              <div className="absolute w-40 h-40 border border-[#d4af37]/25 border-dashed rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <span className="caps-label text-[#d4af37] text-[10px] tracking-[0.4em] text-glow">
            ALLOCATION LOST — ERROR 404
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Vault Entry Denied
          </h1>
          <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-sm mx-auto">
            The bottle allocation, order archive, or page you requested does not exist or has been moved from the Kwest directory.
          </p>
        </div>

        {/* Action Button */}
        <Link href="/" className="group">
          <button className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-[10px] caps-label tracking-widest px-8 py-4 rounded-xl transition-all cursor-pointer hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]">
            Return to Gallery
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </main>
  );
}
