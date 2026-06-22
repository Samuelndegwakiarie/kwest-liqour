"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/CartContext";
import { ParticleField } from "@/components/ParticleField";
import { GlassCard } from "@/components/GlassCard";

const DEFAULT_PRODUCTS = [
  { id: 1, brand: "JOHNNIE WALKER", name: "Black Label Scotch", price: 5800, tag: "BEST SELLER", img: "/johnnie_walker_black_noir_1778448563770.png", category: "Whisky", volume: "750ml", desc: "A classic blended Scotch whisky, aged for 12 years. Johnnie Walker Black Label is renowned for its smooth, deep, and complex character, featuring hints of dark fruits, sweet vanilla, and signature smoky undertones. Excellent neat, on the rocks, or in a highball." },
  { id: 2, brand: "GILBEY'S", name: "Special Dry Gin", price: 1795, tag: "POPULAR", img: "/gilbeys_gin_noir_1778448582122.png", category: "Gin", volume: "750ml", desc: "Gilbey's Special Dry Gin is a traditional London Dry style gin. It features a clean, juniper-forward profile with crisp citrus notes and a subtle botanical spice finish. Perfect for classic gin and tonics or refreshing summer cocktails." },
  { id: 3, brand: "HENNESSY", name: "VS Cognac", price: 6500, tag: "LUXURY", img: "/hennessy_vs_noir_1778448600750.png", category: "Cognac", volume: "750ml", desc: "Hennessy Very Special (V.S) is one of the most popular cognacs in the world. Matured in new oak casks, Hennessy V.S is bold and fragrant. Its signature character is a dry fruit sweetness blended with toasted almond, oak wood, and delicate grape notes." },
  { id: 4, brand: "JAMESON", name: "Irish Whiskey", price: 3200, tag: "TRENDING", img: "/jameson_whiskey_noir_1778448618517.png", category: "Whisky", volume: "750ml", desc: "Jameson is a triple-distilled, blended Irish whiskey, aged in oak casks for a minimum of 4 years. Known for its signature smoothness, it delivers sweet orchard fruit aromas, light floral notes, vanilla cream, and a warm, woody-spiced finish." },
  { id: 5, brand: "DON JULIO", name: "Blanco Tequila", price: 12500, tag: "LIMITED", img: "/don_julio_blanco_noir_1778448639327.png", category: "Tequila", volume: "750ml", desc: "Don Julio Blanco is a super-premium tequila made from 100% blue Weber agave. Crisp agave aromas lead into a palate of clean citrus, black pepper, and sweet grass. Extremely smooth, it is ideal for premium margaritas or sipping neat." },
  { id: 6, brand: "TANQUERAY", name: "London Dry Gin", price: 3500, tag: null, img: "/tanqueray_london_dry_noir.png", category: "Gin", volume: "1000ml", desc: "Tanqueray London Dry Gin is distilled four times in copper pot stills for ultimate purity. It features a perfectly balanced botanical blend of juniper, coriander, angelica root, and liquorice. Clean, bold, and incredibly refreshing." },
  { id: 7, brand: "PENFOLDS", name: "Koonunga Hill Shiraz", price: 4200, tag: "POPULAR", img: "/vintage_wines_category_noir.png", category: "Wines", volume: "750ml", desc: "Penfolds Koonunga Hill Shiraz is a premium Australian red wine. It is full-bodied and rich, with ripe dark cherry and blackberry flavors complemented by sweet spice and subtle oak integration. Pairs beautifully with steak or slow-roasted lamb." },
  { id: 8, brand: "JOHNNIE WALKER", name: "Black Label (Pocket)", price: 2100, tag: null, img: "/johnnie_walker_black_noir_1778448563770.png", category: "Whisky", volume: "250ml", desc: "The iconic Johnnie Walker Black Label, packaged in a sleek, lightweight pocket-sized bottle. Perfect for taking on travels or sharing on small gatherings while preserving the full 12-year blended single malt quality." },
  { id: 9, brand: "GILBEY'S", name: "Special Dry (Medium)", price: 1100, tag: null, img: "/gilbeys_gin_noir_1778448582122.png", category: "Gin", volume: "350ml", desc: "A convenient medium-sized bottle of Gilbey's Special Dry Gin, featuring the identical crisp juniper and citrus botanical recipe that has made Gilbey's a globally recognized standard for dry gins since 1857." },
  { id: 10, brand: "HENNESSY", name: "VS Cognac (Half)", price: 3800, tag: null, img: "/hennessy_vs_noir_1778448600750.png", category: "Cognac", volume: "500ml", desc: "A half-sized decanter of Hennessy V.S Cognac, ideal for smaller celebrations or curated tastings. Delivers the robust toasted oak, vanilla cream, and dried fruit grape profile of the classic signature blend." },
];

const tagColors: Record<string, string> = {
  "BEST SELLER": "bg-primary/20 text-primary border-primary/30",
  "POPULAR": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "LUXURY": "bg-secondary/20 text-secondary border-secondary/30",
  "TRENDING": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "LIMITED": "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

interface Params {
  id: string;
}

export default function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API loading product error:", err);
        const fallback = DEFAULT_PRODUCTS.find((p) => p.id === productId);
        setProduct(fallback || null);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center p-6">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <h2 className="text-3xl font-serif font-bold text-white">Spirits Allocation Lost</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            The product you requested does not exist in the Kwest Vault directory.
          </p>
          <Link href="/products">
            <button className="px-8 py-3.5 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer">
              Return to Gallery
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const handleAdd = () => {
    addToCart({
      id: product.id,
      brand: product.brand,
      name: product.name,
      price: product.discountPrice ? product.discountPrice : product.price,
      img: product.img,
      category: product.category,
      volume: product.volume,
      tag: product.tag,
    }, quantity);
    setToastMessage(`Added ${quantity}x ${product.name} to Cart`);
    setTimeout(() => setToastMessage(""), 2000);
    // Green feedback for 2 seconds
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <main className="bg-background min-h-screen relative overflow-hidden pb-[var(--bottom-nav-height)] lg:pb-0">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/45 to-background z-10" />
        <Image
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
          fill
          className="object-cover opacity-15 select-none pointer-events-none"
          alt="Product details background"
          sizes="100vw"
          quality={60}
        />
      </div>
      <ParticleField count={20} className="z-[5]" />

      {/* ═══ 100vh Split Layout ═══ */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-6 h-[calc(100vh-var(--bottom-nav-height))] lg:h-screen pt-[var(--bottom-nav-height)] lg:pt-0 flex flex-col justify-center">
        {/* Back Link */}
        <div className="mb-6 lg:mb-10 pt-4 lg:pt-0">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[10px] caps-label text-text-muted hover:text-white transition-colors group cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Reserve Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center overflow-y-auto no-scrollbar max-h-[80vh] lg:max-h-[85vh]">
          {/* Left Column: Image Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-[480px] aspect-[4/5] rounded-2xl bg-black/45 border border-white/[0.08] relative overflow-hidden flex items-center justify-center p-8 group shadow-[0_0_40px_rgba(0,240,255,0.02)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
              {product.tag && (
                <span className={`absolute top-4 left-4 text-[9px] font-bold px-3 py-1.5 rounded-full tracking-wider border backdrop-blur-md uppercase ${
                  tagColors[product.tag] || "bg-white/10 text-white border-white/20"
                }`}>
                  {product.tag}
                </span>
              )}
              <span className="absolute bottom-4 right-4 text-[9px] font-bold px-2.5 py-1 rounded bg-black/60 border border-white/[0.1] text-text-muted tracking-widest uppercase">
                {product.volume}
              </span>

              <Image
                src={product.img}
                width={400}
                height={500}
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="h-[85%] w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                alt={product.name}
              />
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">{product.brand}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-[10px] font-semibold text-text-subtle uppercase tracking-widest">{product.category}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-baseline gap-3 mt-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-bold text-primary font-serif text-glow">
                      KES {product.discountPrice.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-white/30 line-through text-sm font-medium">
                      KES {product.price.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-primary font-serif text-glow">
                    KES {product.price.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[9px] caps-label text-text-muted tracking-widest">Bottle Description</h3>
              <p className="text-text-muted text-sm leading-relaxed max-w-lg">
                {product.description || product.desc}
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.06] space-y-6">
              {/* Quantity selector & Add button */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-1.5 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAdd}
                  disabled={isAdded}
                  className={`flex-1 w-full py-4 font-bold text-xs caps-label tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 group min-h-[44px] ${
                    isAdded
                      ? "bg-emerald-600 text-white shadow-[0_0_35px_rgba(16,185,129,0.4)]"
                      : "bg-primary text-background hover:shadow-[0_0_35px_rgba(0,240,255,0.4)]"
                  }`}
                >
                  {isAdded ? (
                    <><Check className="w-4 h-4" /> ADDED TO CART</>
                  ) : (
                    <>Add To Cellar <ShoppingBag className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              {/* Secure dispatch tag */}
              <div className="flex items-center gap-3 text-text-subtle text-[11px] bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <span>Undergoes temperature-controlled dispatch with M-Pesa/Card authentication.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[250] bg-primary text-background font-bold text-[10px] caps-label tracking-widest px-6 py-3.5 rounded-full shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-background animate-pulse" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
