"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { products, formatPrice } from "@/data/products";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516535750141-6e2f85446f11?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30" 
            alt="The Reserve Collection"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-background" />
        </div>
        
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-primary mb-8 tracking-tight gold-text-glow uppercase">
              The Reserve Collection
            </h1>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.4em] max-w-2xl mx-auto">
              Curated spirits from the world's most prestigious distilleries and vineyards.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-background">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-12">
            <div>
              <h4 className="caps-label text-white/40 mb-8 border-b border-white/5 pb-4">Category</h4>
              <div className="space-y-4">
                {['Whisky', 'Wine', 'Gin', 'Cognac'].map((cat) => (
                  <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-4 h-4 border border-white/20 group-hover:border-primary transition-colors flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="caps-label text-white/40 mb-8 border-b border-white/5 pb-4">Price Range</h4>
              <div className="space-y-8">
                 <div className="h-[2px] bg-white/5 relative">
                    <div className="absolute inset-y-0 left-0 right-1/4 bg-primary" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-primary border-4 border-black" />
                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-4 h-4 bg-primary border-4 border-black" />
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span>$0</span>
                    <span>$2,500+</span>
                 </div>
              </div>
            </div>

            <div>
              <h4 className="caps-label text-white/40 mb-8 border-b border-white/5 pb-4">Region</h4>
              <div className="space-y-4">
                {['Speyside', 'Islay', 'Highlands'].map((reg) => (
                  <label key={reg} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-4 h-4 border border-white/20 group-hover:border-primary transition-colors" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 group-hover:text-primary transition-colors">{reg}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
               <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Showing {products.length} results</p>
               <div className="flex items-center gap-4 cursor-pointer group">
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">Sort By: Featured</span>
                  <ChevronDown className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {products.map((p, i) => (
                 <motion.div
                   key={p.id}
                   whileInView={{ opacity: 1, y: 0 }}
                   initial={{ opacity: 0, y: 30 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                   className="group cursor-pointer"
                 >
                    <div className="aspect-[4/5] bg-[#111] overflow-hidden mb-8 relative p-12 flex items-center justify-center">
                       <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000" 
                       />
                       {p.isFeatured && (
                         <div className="absolute top-6 left-6 px-3 py-1 bg-[#222] text-white text-[9px] font-black uppercase tracking-widest">
                           Rare
                         </div>
                       )}
                       {p.isNew && (
                         <div className="absolute top-6 left-6 px-3 py-1 bg-primary text-black text-[9px] font-black uppercase tracking-widest">
                           Limited
                         </div>
                       )}
                    </div>
                    <div className="text-center">
                       <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] mb-3">{p.category}</p>
                       <h3 className="text-2xl font-serif font-medium text-white mb-4 group-hover:text-primary transition-colors uppercase tracking-tight">{p.name}</h3>
                       <p className="text-xl font-medium text-primary tracking-tight">{formatPrice(p.price)}</p>
                    </div>
                 </motion.div>
               ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-24 flex items-center justify-center gap-8 border-t border-white/5 pt-12">
               <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-all cursor-pointer">
                  ←
               </div>
               <div className="flex gap-4 items-center">
                  <span className="text-[11px] font-bold text-primary">01</span>
                  <span className="text-white/10">/</span>
                  <span className="text-[11px] font-bold text-white/30 hover:text-white cursor-pointer transition-colors">02</span>
                  <span className="text-[11px] font-bold text-white/30 hover:text-white cursor-pointer transition-colors">03</span>
               </div>
               <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-all cursor-pointer">
                  →
               </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
