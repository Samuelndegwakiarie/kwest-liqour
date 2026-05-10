"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Wine, ShoppingBag, Phone, ArrowRight, MapPin, Star, Building2, Store } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <section className="relative pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] font-bold text-primary mb-4 block uppercase tracking-[0.4em]">EXCLUSIVE ACCESS</span>
          <h1 className="text-5xl font-serif font-black text-white mb-6 tracking-tight uppercase leading-none">
            Concierge Services
          </h1>
          <p className="text-foreground/50 text-sm font-medium leading-relaxed max-w-sm">
            Our specialized concierge team is at your disposal for bespoke spirits procurement and private events.
          </p>
        </motion.div>
      </section>

      {/* Service Cards */}
      <section className="px-6 space-y-6 pb-20">
        {[
          { 
            title: "Private Tastings", 
            icon: <Wine className="w-5 h-5 text-primary" />,
            desc: "Guided sensory journeys through our rarest reserves, led by certified master distillers.",
            image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800"
          },
          { 
            title: "Wholesale & Trade", 
            icon: <Building2 className="w-5 h-5 text-primary" />,
            desc: "Strategic inventory solutions and exclusive allocation for Nairobi's premier hospitality venues.",
            image: "https://images.unsplash.com/photo-1592701010181-15529130176d?auto=format&fit=crop&q=80&w=800"
          },
          { 
            title: "The Boutique", 
            icon: <Store className="w-5 h-5 text-primary" />,
            desc: "Visit our flagship location for a personalized curation session with our house sommeliers.",
            image: "https://images.unsplash.com/photo-1516535750141-6e2f85446f11?auto=format&fit=crop&q=80&w=800"
          }
        ].map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group overflow-hidden border border-white/5 bg-[#0d0d0d]"
          >
            <div className="aspect-[2/1] overflow-hidden">
               <img src={service.image} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={service.title} />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                 <h3 className="text-3xl font-serif font-black text-white uppercase tracking-tight">{service.title}</h3>
                 {service.icon}
              </div>
              <p className="text-foreground/40 text-sm font-medium leading-relaxed mb-8">
                {service.desc}
              </p>
              <button className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] border-b border-primary pb-1 hover:text-white hover:border-white transition-colors">
                INQUIRE NOW
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Inquiry Form */}
      <section className="py-24 px-6 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-lg mx-auto">
          <h2 className="text-4xl font-serif font-black text-white mb-4 tracking-tight uppercase">
            Send an Inquiry
          </h2>
          <div className="w-12 h-1 bg-primary mb-12" />
          
          <form className="space-y-10">
            <input 
              type="text" 
              placeholder="FULL NAME"
              className="w-full bg-transparent border-b border-white/10 py-5 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-primary transition-colors text-white uppercase"
            />
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-white/10 py-5 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-primary transition-colors text-white uppercase"
            />
            <div className="relative">
              <select className="w-full bg-transparent border-b border-white/10 py-5 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-primary transition-colors text-white uppercase appearance-none cursor-pointer">
                <option className="bg-black">SELECT SERVICE TYPE</option>
                <option className="bg-black">PRIVATE TASTINGS</option>
                <option className="bg-black">WHOLESALE & TRADE</option>
                <option className="bg-black">BOUTIQUE SESSION</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
            <textarea 
              rows={4} 
              placeholder="MESSAGE"
              className="w-full bg-transparent border-b border-white/10 py-5 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-primary transition-colors text-white uppercase resize-none"
            />
            <button className="w-full py-5 bg-primary text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Nairobi Flagship Map */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-lg mx-auto overflow-hidden border border-white/5">
           <div className="aspect-square bg-[#0a0a0a] relative flex items-center justify-center">
              {/* Simplified Map representation */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1549413280-928926955761?auto=format&fit=crop&q=80&w=800')] bg-cover grayscale" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center animate-pulse bg-primary/10">
                 <MapPin className="w-8 h-8 text-primary" />
              </div>
           </div>
           <div className="p-10 text-left bg-[#0d0d0d]">
              <h3 className="text-3xl font-serif font-black text-white uppercase tracking-tight mb-2">Nairobi Flagship</h3>
              <p className="text-foreground/50 text-sm font-medium mb-4">The Reserve Plaza, Muthaiga Road</p>
              <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">Open Mon-Sat: 10AM - 9PM</p>
              <button className="w-full py-4 bg-transparent border border-white/10 flex items-center justify-center gap-4 text-[10px] font-bold text-white uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                <MapPin className="w-4 h-4 text-primary" /> GET DIRECTIONS
              </button>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { ChevronDown } from "lucide-react";
