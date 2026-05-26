"use client";

import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const categories = [
  { name: "Whisky", count: 24, checked: true },
  { name: "Gin", count: 18, checked: false },
  { name: "Wine", count: 12, checked: false },
  { name: "Cognac", count: 8, checked: false },
  { name: "Tequila", count: 6, checked: false },
];

const regions = ["Nairobi Metro", "International", "Private Reserve"];

const tagColors: Record<string, string> = {
  "BEST SELLER": "bg-primary/20 text-primary border-primary/30",
  "POPULAR": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "LUXURY": "bg-secondary/20 text-secondary border-secondary/30",
  "TRENDING": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "LIMITED": "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const products = [
  { id: 1, brand: "JOHNNIE WALKER", name: "Black Label Scotch", price: "KES 5,800.00", tag: "BEST SELLER", img: "/johnnie_walker_black_noir_1778448563770.png" },
  { id: 2, brand: "GILBEY'S", name: "Special Dry Gin", price: "KES 1,795.00", tag: "POPULAR", img: "/gilbeys_gin_noir_1778448582122.png" },
  { id: 3, brand: "HENNESSY", name: "VS Cognac", price: "KES 6,500.00", tag: "LUXURY", img: "/hennessy_vs_noir_1778448600750.png" },
  { id: 4, brand: "JAMESON", name: "Irish Whiskey", price: "KES 3,200.00", tag: "TRENDING", img: "/jameson_whiskey_noir_1778448618517.png" },
  { id: 5, brand: "DON JULIO", name: "Blanco Tequila", price: "KES 12,500.00", tag: "LIMITED", img: "/don_julio_blanco_noir_1778448639327.png" },
  { id: 6, brand: "TANQUERAY", name: "London Dry Gin", price: "KES 3,500.00", tag: null, img: "/tanqueray_london_dry_noir.png" },
];

export default function Gallery() {
  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-0">
      {/* ═══ Hero ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-50"
            alt="Bottles Background"
          />
        </div>
        <ParticleField count={30} className="z-[5]" />

        <ScrollReveal className="relative z-20 max-w-4xl text-center px-6">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter mb-4 leading-none">
            The <span className="gradient-text-static">Reserve</span> Collection
          </h1>
          <p className="text-text-muted caps-label text-[10px] tracking-[0.4em] max-w-md mx-auto">
            A curated selection for the discerning connoisseur.
          </p>
        </ScrollReveal>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
          <div className="w-[2px] h-10 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
        </div>
      </section>

      {/* ═══ Filter Chips — Mobile ═══ */}
      <div className="px-6 py-6 border-b border-white/[0.04] flex gap-3 overflow-x-auto no-scrollbar lg:hidden">
        {["Category", "Price Range", "Region"].map((filter) => (
          <button
            key={filter}
            className="shrink-0 px-5 py-2.5 glass-card rounded-full text-[10px] caps-label text-text-muted flex items-center gap-2 cursor-pointer hover:border-primary/30 transition-all"
          >
            {filter} <ChevronDown className="w-3 h-3 text-white/20" />
          </button>
        ))}
      </div>

      {/* ═══ Main Content ═══ */}
      <section className="py-16 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block w-60 shrink-0 space-y-10">
            <ScrollReveal direction="left">
              <div className="glass-card rounded-2xl p-6 space-y-8">
                <div>
                  <h4 className="caps-label text-text-muted text-[10px] mb-6">Category</h4>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <label key={cat.name} className="flex items-center gap-3 group cursor-pointer">
                        <div
                          className={`w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                            cat.checked
                              ? "bg-primary border-primary shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                              : "border-white/[0.15] group-hover:border-primary/50"
                          }`}
                        >
                          {cat.checked && (
                            <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${cat.checked ? "text-primary" : "text-text-muted group-hover:text-white"}`}>
                          {cat.name}
                        </span>
                        <span className="ml-auto text-[10px] text-text-subtle">{cat.count}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6">
                  <h4 className="caps-label text-text-muted text-[10px] mb-6">Region</h4>
                  <div className="space-y-3">
                    {regions.map((reg) => (
                      <label key={reg} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-4 h-4 rounded border-2 border-white/[0.15] group-hover:border-primary/50 transition-all" />
                        <span className="text-sm text-text-muted group-hover:text-white transition-colors">{reg}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" staggerDelay={0.06}>
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="group flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 glass-card">
                      {product.tag && (
                        <div
                          className={`absolute top-3 left-3 z-20 text-[8px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase border backdrop-blur-sm ${
                            tagColors[product.tag] || "bg-white/10 text-white border-white/20"
                          }`}
                        >
                          {product.tag}
                        </div>
                      )}
                      <img
                        src={product.img}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Quick View Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center justify-center gap-2 text-primary text-[10px] caps-label">
                          VIEW DETAILS <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 px-1">
                      <span className="text-[9px] text-text-subtle tracking-[0.2em] uppercase">{product.brand}</span>
                      <h3 className="text-sm md:text-base font-serif font-bold text-white group-hover:text-primary transition-colors tracking-tight leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-primary font-bold tracking-wider text-[12px] md:text-sm text-glow">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Load More */}
            <ScrollReveal className="mt-16 flex justify-center">
              <button className="px-10 py-4 bg-primary/10 border border-primary/30 text-primary font-bold uppercase tracking-[0.2em] text-[10px] rounded-lg hover:bg-primary hover:text-background transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] cursor-pointer">
                LOAD MORE
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
