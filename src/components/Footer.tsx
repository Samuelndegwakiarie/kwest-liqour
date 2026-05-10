"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-32 border-t border-white/5">
      <div className="max-w-lg mx-auto px-6 text-center">
        <Link href="/" className="text-2xl font-serif font-black tracking-[0.2em] text-primary uppercase mb-12 block">
          NOIR
        </Link>
        
        <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-16">
          <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/shipping" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors">Shipping & Returns</Link>
          <Link href="/laws" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors">Liquor Laws</Link>
        </div>
        
        <div className="pt-12 border-t border-white/5">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] leading-relaxed">
            &copy; 2024 Nairobi Reserve Boutique. <br /> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

