import Link from "next/link";
import { Globe, Share2, MapPin } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export function Footer() {
  return (
    <footer className="py-16 md:py-24 px-6 md:px-12 bg-background-elevated border-t border-white/[0.06]">
      <ScrollReveal direction="up">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-primary uppercase tracking-[0.3em] text-glow">
              Kwest Liquor
            </h2>
            <p className="text-text-subtle text-sm leading-relaxed max-w-xs">
              Nairobi&apos;s premier destination for rare spirits and curated
              luxury. Established with passion, delivered with pride.
            </p>
          </div>

          {/* Collections */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="caps-label text-text-muted text-[10px]">COLLECTIONS</h4>
            <ul className="space-y-4">
              {["Rare Malts", "Vintage Wines", "Artisanal Gins", "Limited Editions"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/products"
                      className="text-sm text-text-subtle hover:text-primary transition-colors duration-300 cursor-pointer"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="caps-label text-text-muted text-[10px]">CUSTOMER CARE</h4>
            <ul className="space-y-4">
              {["Terms of Service", "Privacy Policy", "Shipping & Returns", "Contact Support"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-text-subtle hover:text-primary transition-colors duration-300 cursor-pointer"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social & Location */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="caps-label text-text-muted text-[10px]">SOCIAL</h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-4">
              <h4 className="caps-label text-text-muted text-[10px] mb-3">LOCATION</h4>
              <div className="flex items-center gap-2 text-text-subtle text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/[0.06] gap-6">
          <div className="hidden md:block w-32" />
          <p className="text-white/10 text-[10px] caps-label tracking-[0.4em] uppercase text-center">
            © 2025 KWEST LIQUOR NAIROBI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Concierge Online
            </span>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
