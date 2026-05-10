"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549413280-928926955761?auto=format&fit=crop&q=80&w=2000" 
            alt="Nairobi Skyline" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif font-black text-primary mb-6 tracking-tighter uppercase leading-none">
              A Beautiful <br /> Sight
            </h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] max-w-md mx-auto">
              THE NAIROBI RESERVE EXPERIENCE
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
           <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 text-left max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">HERITAGE</span>
        </div>
        <h2 className="text-4xl font-serif font-black text-white mb-8 tracking-tight uppercase">Our Story</h2>
        <div className="space-y-6 text-foreground/50 text-sm font-medium leading-relaxed">
          <p>
            Born from a desire to bridge the gap between global craft and Nairobi's burgeoning connoisseur culture, NOIR is more than a boutique. It is a sanctuary for those who appreciate the patience of the aging process and the artistry of the master blender.
          </p>
        </div>
        <div className="mt-12 aspect-[3/4] overflow-hidden border border-white/5">
           <img 
             src="https://images.unsplash.com/photo-1592701010181-15529130176d?auto=format&fit=crop&q=80&w=1000" 
             className="w-full h-full object-cover grayscale" 
           />
        </div>
      </section>

      {/* The Curation */}
      <section className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-lg mx-auto text-right">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-4 block">PROCESS |</span>
          <h2 className="text-4xl font-serif font-black text-white mb-8 tracking-tight uppercase">The Curation</h2>
          <p className="text-foreground/50 text-sm font-medium leading-relaxed mb-12">
            Each bottle in our reserve is hand-selected by our master curators. From rare vintage single malts to artisanal small-batch gins, we prioritize liquids that tell a story of origin, time, and uncompromising quality.
          </p>
          <div className="aspect-square overflow-hidden border border-white/5">
             <img 
               src="https://images.unsplash.com/photo-1516535750141-6e2f85446f11?auto=format&fit=crop&q=80&w=1000" 
               className="w-full h-full object-cover grayscale opacity-60" 
             />
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif font-black text-white mb-4 tracking-tight uppercase">The Vision</h2>
        </div>
        
        <div className="space-y-12 max-w-lg mx-auto">
           {[
             { title: "Cultural Anchor", subtitle: "Defining Nairobi's new standard.", image: "/cultural_anchor_woman_1778434286232.png" },
             { title: "Unrivaled Access", subtitle: "Allocation reserved for the few.", image: "/unrivaled_access_key_1778434311274.png" },
             { title: "Education & Legacy", subtitle: "Tasting masterclasses and heritage.", image: "/education_legacy_books_1778434333024.png" }
           ].map((item, i) => (
             <div key={i} className="group relative">
                <div className="aspect-[3/4] overflow-hidden border border-white/5 mb-6">
                   <img src={item.image} className="w-full h-full object-cover opacity-60" alt={item.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-8 left-8">
                   <h3 className="text-2xl font-serif font-black text-primary uppercase mb-1 tracking-tight">{item.title}</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{item.subtitle}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Join The Reserve */}
      <section className="py-24 px-6 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-serif font-black text-white mb-6 tracking-tight uppercase">
            Join The Reserve
          </h2>
          <p className="text-foreground/40 text-sm font-medium mb-10">
            Receive exclusive invitations to private releases and tasting events in Nairobi.
          </p>
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              className="w-full bg-black border border-white/10 px-8 py-5 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-primary transition-colors text-white uppercase"
            />
            <button className="w-full py-5 bg-primary text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors">
              Request Access
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
