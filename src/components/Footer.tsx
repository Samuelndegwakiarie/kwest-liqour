import Link from "next/link";
import { Globe, Share2, MapPin } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const forestTrees = [
  { x: -20, h: 110, w: 55 },
  { x: 10, h: 150, w: 70 },
  { x: 35, h: 90, w: 45 },
  { x: 60, h: 130, w: 60 },
  { x: 90, h: 160, w: 75 },
  { x: 120, h: 100, w: 50 },
  { x: 145, h: 140, w: 65 },
  { x: 175, h: 120, w: 55 },
  { x: 210, h: 170, w: 80 },
  { x: 240, h: 95, w: 45 },
  { x: 270, h: 145, w: 70 },
  { x: 300, h: 115, w: 55 },
  { x: 330, h: 155, w: 75 },
  { x: 360, h: 105, w: 50 },
  { x: 395, h: 135, w: 65 },
  { x: 425, h: 165, w: 80 },
  { x: 455, h: 110, w: 50 },
  { x: 485, h: 150, w: 70 },
  { x: 515, h: 100, w: 45 },
  { x: 545, h: 130, w: 60 },
  { x: 575, h: 160, w: 75 },
  { x: 605, h: 105, w: 50 },
  { x: 635, h: 145, w: 65 },
  { x: 665, h: 125, w: 55 },
  { x: 695, h: 170, w: 80 },
  { x: 725, h: 95, w: 45 },
  { x: 755, h: 150, w: 70 },
  { x: 785, h: 115, w: 55 },
  { x: 815, h: 155, w: 75 },
  { x: 845, h: 105, w: 50 },
  { x: 875, h: 135, w: 65 },
  { x: 905, h: 165, w: 80 },
  { x: 935, h: 110, w: 50 },
  { x: 965, h: 150, w: 70 },
  { x: 995, h: 100, w: 45 },
  { x: 1025, h: 130, w: 60 },
  { x: 1055, h: 160, w: 75 },
  { x: 1085, h: 105, w: 50 },
  { x: 1115, h: 145, w: 65 },
  { x: 1145, h: 125, w: 55 },
  { x: 1175, h: 170, w: 80 },
  { x: 1205, h: 100, w: 50 },
  { x: 1230, h: 140, w: 65 },
];

function getTreePoints(x: number, h: number, w: number, base: number = 200) {
  return [
    `${x},${base - h}`,
    `${x + w * 0.18},${base - h * 0.68}`,
    `${x + w * 0.08},${base - h * 0.70}`,
    `${x + w * 0.32},${base - h * 0.38}`,
    `${x + w * 0.15},${base - h * 0.40}`,
    `${x + w * 0.5},${base}`,
    `${x - w * 0.5},${base}`,
    `${x - w * 0.15},${base - h * 0.40}`,
    `${x - w * 0.32},${base - h * 0.38}`,
    `${x - w * 0.08},${base - h * 0.70}`,
    `${x - w * 0.18},${base - h * 0.68}`,
  ].join(" ");
}

export function Footer() {
  return (
    <footer className="relative mt-32 md:mt-40">
      {/* Silhouette Forest Header */}
      <div className="absolute bottom-full left-0 w-full translate-y-[2px] pointer-events-none select-none overflow-hidden z-10 h-[80px] md:h-[130px]">
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="w-full h-full text-background-elevated fill-current drop-shadow-[0_-8px_15px_rgba(0,240,255,0.06)]"
        >
          {forestTrees.map((tree, idx) => (
            <polygon
              key={idx}
              points={getTreePoints(tree.x, tree.h, tree.w)}
            />
          ))}
        </svg>
      </div>

      <div className="py-16 md:py-24 px-6 md:px-12 bg-background-elevated border-t border-white/[0.04] relative z-20">
        <ScrollReveal direction="up">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20">
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

          <div className="mt-16 pt-8 border-t border-white/[0.04] text-center">
            <p className="text-white/15 text-[10px] caps-label tracking-[0.4em] uppercase">
              © 2026 KWEST LIQUOR NAIROBI. ALL RIGHTS RESERVED.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
