"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { useParams } from "next/navigation";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();
  const categoryName = typeof slug === 'string' ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";
  
  const categoryProducts = products.filter(p => p.category === slug);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative pt-40 pb-24 px-10">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors mb-16 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24"
          >
            <h1 className="text-7xl md:text-9xl font-serif font-black text-foreground mb-6 tracking-tighter uppercase leading-[0.85]">
              {categoryName} <br /><span className="text-primary italic">SELECTION.</span>
            </h1>
            <p className="text-foreground/30 uppercase tracking-[0.5em] font-bold text-[10px]">
              {categoryProducts.length} EXCLUSIVE ITEMS IN STOCK
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {categoryProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-[#1a1a1a] overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  {/* Stock Label */}
                  <div className="absolute bottom-0 left-0 flex items-center gap-3 px-6 py-3 bg-primary text-white">
                    <span className={`w-2 h-2 rounded-full ${product.stock < 5 ? 'bg-white animate-pulse' : 'bg-white/40'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                      {product.stock} IN VAULT
                    </span>
                  </div>
                </div>
                
                <div className="p-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative">
                  <div>
                    <h3 className="text-4xl font-serif font-black mb-4 group-hover:text-primary transition-colors tracking-tight uppercase leading-none">{product.name}</h3>
                    <p className="text-2xl font-medium text-foreground/40">{formatPrice(product.price)}</p>
                  </div>
                  
                  <div className="flex gap-4 w-full sm:w-auto">
                    <button className="p-6 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 flex-1 sm:flex-initial flex items-center justify-center">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-6 bg-primary text-white hover:bg-white hover:text-black transition-all duration-500 flex-1 sm:flex-initial flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[10px]">
                      <ShoppingCart className="w-5 h-5" /> Add to Order
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                {product.isBestSeller && (
                  <div className="absolute top-0 right-0 px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em]">
                    Best Seller
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-0 right-0 px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em]">
                    New Arrival
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
