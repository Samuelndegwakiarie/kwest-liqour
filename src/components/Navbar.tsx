"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, Wine, X, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: "Gallery", href: "/products" },
    { name: "Heritage", href: "/about" },
    { name: "Reserve", href: "/reserve" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Mobile: Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-foreground/60 hover:text-primary transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo - Centered on mobile, Left on desktop */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center gap-2 group cursor-pointer">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.2em] text-primary uppercase">
                NOIR
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-12 xl:space-x-16">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60 hover:text-primary transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Icons & Search */}
            <div className="flex items-center gap-4 md:gap-8">
              <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 group focus-within:border-primary/50 transition-colors">
                <Search className="w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search collection..." 
                  className="bg-transparent border-none focus:ring-0 text-[11px] font-medium tracking-wider text-white w-32 xl:w-48 placeholder:text-white/20"
                />
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button className="hidden md:block p-2 text-foreground/60 hover:text-primary transition-colors duration-200">
                  <User className="w-5 h-5" />
                </button>
                
                {/* Mobile: BAG text, Desktop: Icon */}
                <button className="p-2 text-foreground/60 hover:text-primary transition-colors duration-200 relative flex items-center gap-2">
                  <span className="lg:hidden text-[10px] font-bold tracking-[0.2em] uppercase">BAG</span>
                  <ShoppingCart className="hidden lg:block w-5 h-5" />
                  <span className="absolute -top-1 -right-1 lg:top-1 lg:right-1 w-2 h-2 bg-primary rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 bg-background"
            >
              <div className="px-10 py-12 space-y-8 text-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-xs font-bold uppercase tracking-[0.4em] text-foreground/60 hover:text-primary transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Full Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#121212]/95 backdrop-blur-[30px] flex items-center justify-center px-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-10 right-10 p-4 text-foreground/40 hover:text-primary transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-4xl">
              <input 
                autoFocus
                type="text" 
                placeholder="SEARCH COLLECTION"
                className="w-full bg-transparent border-b border-white/10 py-10 text-4xl md:text-7xl font-serif focus:outline-none focus:border-primary transition-colors placeholder:text-white/5 uppercase tracking-tighter"
              />
              <p className="mt-8 text-foreground/30 text-[10px] font-bold uppercase tracking-[0.3em]">
                Discover rare spirits and fine wines
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
