"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const categories = ["Whisky", "Gin", "Wines", "Cognac", "Tequila"];
const volumes = ["250ml", "350ml", "500ml", "750ml", "1000ml"];

const tagColors: Record<string, string> = {
  "BEST SELLER": "bg-primary/20 text-primary border-primary/30",
  "POPULAR": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "LUXURY": "bg-secondary/20 text-secondary border-secondary/30",
  "TRENDING": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "LIMITED": "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const products = [
  { id: 1, brand: "JOHNNIE WALKER", name: "Black Label Scotch", price: 5800, tag: "BEST SELLER", img: "/johnnie_walker_black_noir_1778448563770.png", category: "Whisky", volume: "750ml" },
  { id: 2, brand: "GILBEY'S", name: "Special Dry Gin", price: 1795, tag: "POPULAR", img: "/gilbeys_gin_noir_1778448582122.png", category: "Gin", volume: "750ml" },
  { id: 3, brand: "HENNESSY", name: "VS Cognac", price: 6500, tag: "LUXURY", img: "/hennessy_vs_noir_1778448600750.png", category: "Cognac", volume: "750ml" },
  { id: 4, brand: "JAMESON", name: "Irish Whiskey", price: 3200, tag: "TRENDING", img: "/jameson_whiskey_noir_1778448618517.png", category: "Whisky", volume: "750ml" },
  { id: 5, brand: "DON JULIO", name: "Blanco Tequila", price: 12500, tag: "LIMITED", img: "/don_julio_blanco_noir_1778448639327.png", category: "Tequila", volume: "750ml" },
  { id: 6, brand: "TANQUERAY", name: "London Dry Gin", price: 3500, tag: null, img: "/tanqueray_london_dry_noir.png", category: "Gin", volume: "1000ml" },
  { id: 7, brand: "PENFOLDS", name: "Koonunga Hill Shiraz", price: 4200, tag: "POPULAR", img: "/vintage_wines_category_noir.png", category: "Wines", volume: "750ml" },
  { id: 8, brand: "JOHNNIE WALKER", name: "Black Label (Pocket)", price: 2100, tag: null, img: "/johnnie_walker_black_noir_1778448563770.png", category: "Whisky", volume: "250ml" },
  { id: 9, brand: "GILBEY'S", name: "Special Dry (Medium)", price: 1100, tag: null, img: "/gilbeys_gin_noir_1778448582122.png", category: "Gin", volume: "350ml" },
  { id: 10, brand: "HENNESSY", name: "VS Cognac (Half)", price: 3800, tag: null, img: "/hennessy_vs_noir_1778448600750.png", category: "Cognac", volume: "500ml" },
];

export default function Gallery() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  // Mobile drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleVolume = (vol: string) => {
    setSelectedVolumes((prev) =>
      prev.includes(vol) ? prev.filter((v) => v !== vol) : [...prev, vol]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedVolumes([]);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    const price = product.price;
    if (minPrice && price < parseFloat(minPrice)) {
      return false;
    }
    if (maxPrice && price > parseFloat(maxPrice)) {
      return false;
    }
    if (selectedVolumes.length > 0 && !selectedVolumes.includes(product.volume)) {
      return false;
    }
    return true;
  });

  return (
    <main className="bg-background min-h-screen pb-[var(--bottom-nav-height)] lg:pb-16 overflow-x-hidden">
      {/* ═══ Reduced Height Hero ═══ */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-35 select-none pointer-events-none"
            alt="Bottles Background"
          />
        </div>
        <ParticleField count={20} className="z-[5]" />

        <ScrollReveal className="relative z-20 max-w-4xl text-center px-6">
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter mb-4 leading-none">
            The <span className="gradient-text-static">Reserve</span> Collection
          </h1>
          <p className="text-text-muted caps-label text-[10px] tracking-[0.4em] max-w-md mx-auto">
            A curated selection for the discerning connoisseur.
          </p>
        </ScrollReveal>
      </section>

      {/* ═══ Filter Toggle & Status — Mobile ═══ */}
      <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="px-5 py-3 glass-card rounded-xl text-[10px] caps-label text-text-muted flex items-center gap-2 cursor-pointer hover:border-primary/30 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" /> Filters
          {(selectedCategories.length > 0 || minPrice || maxPrice || selectedVolumes.length > 0) && (
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </button>

        {(selectedCategories.length > 0 || minPrice || maxPrice || selectedVolumes.length > 0) && (
          <button
            onClick={resetFilters}
            className="text-[9px] caps-label text-primary hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* ═══ Main Content Section ═══ */}
      <section className="py-12 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-10">
            <ScrollReveal direction="left">
              <div className="glass-card rounded-2xl p-6 space-y-8 border-white/[0.06] shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Curation Filters</h3>
                  {(selectedCategories.length > 0 || minPrice || maxPrice || selectedVolumes.length > 0) && (
                    <button
                      onClick={resetFilters}
                      className="text-[9px] caps-label text-primary hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>

                {/* Filter 1: Category */}
                <div className="space-y-4">
                  <h4 className="text-[10px] caps-label text-text-muted">Category</h4>
                  <div className="space-y-3">
                    {categories.map((cat) => {
                      const isChecked = selectedCategories.includes(cat);
                      return (
                        <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                              isChecked
                                ? "bg-primary border-primary shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                                : "border-white/[0.15] group-hover:border-primary/50"
                            }`}
                          >
                            {isChecked && (
                              <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs transition-colors ${isChecked ? "text-primary font-medium text-glow" : "text-text-muted group-hover:text-white"}`}>
                            {cat}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 2: Price (Min/Max Input Field) */}
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <h4 className="text-[10px] caps-label text-text-muted">Price Range (KES)</h4>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                    />
                    <span className="text-text-subtle text-xs">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                    />
                  </div>
                </div>

                {/* Filter 3: Quantity / Volume */}
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <h4 className="text-[10px] caps-label text-text-muted">Volume / Quantity</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {volumes.map((vol) => {
                      const isChecked = selectedVolumes.includes(vol);
                      return (
                        <button
                          key={vol}
                          onClick={() => toggleVolume(vol)}
                          className={`py-2 px-3 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                            isChecked
                              ? "bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(0,240,255,0.08)]"
                              : "bg-black/20 border-white/[0.06] text-text-muted hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {vol}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </aside>

          {/* Product Grid Panel */}
          <div className="flex-1 space-y-12">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-8">
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  No reserve allocations match your filter criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-primary hover:text-white hover:border-primary/30 transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" staggerDelay={0.05}>
                {filteredProducts.map((product) => (
                  <StaggerItem key={product.id}>
                    <div className="group flex flex-col cursor-pointer bg-white/[0.01] border border-white/[0.04] rounded-2xl p-3 hover:bg-white/[0.03] hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,240,255,0.06)] transition-all duration-500">
                      {/* Image Frame */}
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 bg-black/40 border border-white/[0.04] flex items-center justify-center p-4">
                        {product.tag && (
                          <div
                            className={`absolute top-2.5 left-2.5 z-10 text-[8px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase border backdrop-blur-sm ${
                              tagColors[product.tag] || "bg-white/10 text-white border-white/20"
                            }`}
                          >
                            {product.tag}
                          </div>
                        )}
                        
                        {/* Quantity label badge on product image */}
                        <div className="absolute bottom-2.5 right-2.5 z-10 text-[8px] font-bold px-2 py-0.5 rounded bg-black/60 border border-white/[0.1] text-text-muted">
                          {product.volume}
                        </div>

                        <img
                          src={product.img}
                          className="h-[80%] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          alt={product.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Info Frame */}
                      <div className="space-y-1.5 px-1.5 pb-1">
                        <div className="flex justify-between items-center text-[9px] text-text-subtle tracking-[0.2em] uppercase">
                          <span>{product.brand}</span>
                          <span>{product.category}</span>
                        </div>
                        <h3 className="text-sm md:text-base font-serif font-bold text-white group-hover:text-primary transition-colors tracking-tight leading-tight truncate">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center pt-1">
                          <p className="text-primary font-bold tracking-wider text-[12px] md:text-sm text-glow">
                            KES {product.price.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Mobile Filters Drawer ═══ */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="absolute inset-0 bg-background/85 backdrop-blur-sm"
          />

          {/* Drawer Box */}
          <div className="w-[80vw] max-w-sm h-full bg-background border-l border-white/[0.08] relative z-10 flex flex-col p-6 space-y-8 overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-4">
              <h4 className="text-[10px] caps-label text-text-muted">Category</h4>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                          isChecked
                            ? "bg-primary border-primary shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                            : "border-white/[0.15] group-hover:border-primary/50"
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs transition-colors ${isChecked ? "text-primary font-medium text-glow" : "text-text-muted group-hover:text-white"}`}>
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-white/[0.06] pt-6 space-y-4">
              <h4 className="text-[10px] caps-label text-text-muted">Price Range (KES)</h4>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                />
                <span className="text-text-subtle text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20 transition-all border-b-2"
                />
              </div>
            </div>

            {/* Volume Filter */}
            <div className="border-t border-white/[0.06] pt-6 space-y-4">
              <h4 className="text-[10px] caps-label text-text-muted">Volume / Quantity</h4>
              <div className="grid grid-cols-2 gap-2">
                {volumes.map((vol) => {
                  const isChecked = selectedVolumes.includes(vol);
                  return (
                    <button
                      key={vol}
                      onClick={() => toggleVolume(vol)}
                      className={`py-2 px-3 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                        isChecked
                          ? "bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(0,240,255,0.08)]"
                          : "bg-black/20 border-white/[0.06] text-text-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {vol}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/[0.06] flex gap-4">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 bg-white/[0.04] border border-white/[0.08] text-white font-bold text-[10px] caps-label rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer text-center"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-primary text-background font-bold text-[10px] caps-label rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer text-center"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
