"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Home, LayoutGrid, MessageSquare, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";


const desktopLinks = [
  { name: "Drinks", href: "/products" },
  { name: "Heritage", href: "/about" },
  { name: "Orders", href: "/orders" },
  { name: "Contact", href: "/contact" },
];

const bottomNavLinks = [
  { name: "HOME", href: "/", icon: Home },
  { name: "DRINKS", href: "/products", icon: LayoutGrid },
  { name: "CONTACT", href: "/contact", icon: MessageSquare },
  { name: "CLUB", href: "/about", icon: ShieldCheck },
];


export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const { cartCount } = useCart();


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between ${
          isScrolled
            ? "glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-serif font-bold text-primary tracking-[0.3em] uppercase text-glow cursor-pointer"
        >
          KWEST
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {desktopLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative caps-label text-[10px] tracking-[0.3em] transition-colors duration-300 cursor-pointer ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-8">
          <form onSubmit={handleSearchSubmit} className="relative" role="search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              aria-label="Search collection"
              className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-full py-2.5 pl-11 pr-6 text-[10px] caps-label text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] w-56 transition-all duration-300"
            />
          </form>
          <Link href="/cart" className="relative group cursor-pointer" aria-label="Shopping Cart">
            <ShoppingBag className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors duration-300" aria-hidden="true" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-background text-[8px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              {cartCount}
            </span>
          </Link>
          <Link
            href="/account"
            className="text-white/40 hover:text-primary transition-colors duration-300 cursor-pointer"
            aria-label="User Account Profile"
          >
            <User className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-5">
          <Link href="/cart" className="relative group cursor-pointer text-white/60 hover:text-primary transition-colors" aria-label="Shopping Cart">
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-background text-[8px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              {cartCount}
            </span>
          </Link>
          <Link
            href="/account"
            className="text-white/60 hover:text-primary transition-colors duration-300 cursor-pointer"
            aria-label="User Account Profile"
          >
            <User className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (only way to navigate on mobile screens now) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-[100] glass-nav h-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] px-4">
        <div className="grid grid-cols-4 h-[var(--bottom-nav-height)]">
          {bottomNavLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                aria-label={`Go to ${link.name}`}
              >
                <div className="relative">
                  <link.icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      active ? "text-primary" : "text-white/30 group-hover:text-white/60"
                    }`}
                    aria-hidden="true"
                  />
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-glow"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </div>
                <span
                  className={`text-[8px] font-semibold tracking-widest transition-colors duration-300 ${
                    active ? "text-primary" : "text-white/30 group-hover:text-white/60"
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
