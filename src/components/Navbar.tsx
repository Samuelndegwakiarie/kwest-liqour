"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const desktopLinks = [
  { name: "Drinks", href: "/products" },
  { name: "Heritage", href: "/about" },
  { name: "Orders", href: "/orders" },
  { name: "Contact", href: "/contact" },
];

const mobileLinks = [
  { name: "HOME", href: "/" },
  { name: "DRINKS", href: "/products" },
  { name: "ORDERS", href: "/orders" },
  { name: "CONTACT", href: "/contact" },
  { name: "ABOUT", href: "/about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const { cartCount } = useCart();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const currentDesktopLinks = isAdmin
    ? [...desktopLinks, { name: "Dashboard", href: "/dashboard" }]
    : desktopLinks;

  const currentMobileLinks = isAdmin
    ? [...mobileLinks, { name: "DASHBOARD", href: "/dashboard" }]
    : mobileLinks;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    // Fire immediately in case the page was already scrolled on mount
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth status regularly or on path changes
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = sessionStorage.getItem("kwest_admin") === "authenticated";
      const userRaw = localStorage.getItem("kwest_user");
      const userAuth = userRaw !== null;
      setIsLoggedIn(adminAuth || userAuth);
      setIsAdmin(adminAuth);

      if (userRaw) {
        try {
          const parsed = JSON.parse(userRaw);
          setUserAvatar(parsed.avatar || null);
        } catch {
          setUserAvatar(null);
        }
      } else {
        setUserAvatar(null);
      }
    };
    checkAuth();

    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogoutClick = () => {
    sessionStorage.removeItem("kwest_admin");
    localStorage.removeItem("kwest_user");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between ${
          isScrolled && !isMobileMenuOpen
            ? "glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`text-xl md:text-2xl font-serif font-bold text-primary tracking-[0.3em] uppercase text-glow cursor-pointer z-[110] transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          KWEST
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {currentDesktopLinks.map((link) => (
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
            className="text-white/40 hover:text-primary transition-colors duration-300 cursor-pointer flex items-center"
            aria-label="User Account Profile"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="User Profile"
                className="w-5 h-5 rounded-full object-cover border border-primary/30 hover:border-primary/60 transition-all duration-300"
              />
            ) : (
              <User className="w-5 h-5" aria-hidden="true" />
            )}
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-5 z-[110]">
          {!isMobileMenuOpen && (
            <>
              <Link
                href="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative group cursor-pointer text-white/60 hover:text-primary transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-background text-[8px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                  {cartCount}
                </span>
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/60 hover:text-primary transition-colors duration-300 cursor-pointer flex items-center"
                aria-label="User Account Profile"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="User Profile"
                    className="w-5 h-5 rounded-full object-cover border border-primary/30"
                  />
                ) : (
                  <User className="w-5 h-5" aria-hidden="true" />
                )}
              </Link>
            </>
          )}
          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white/60 hover:text-primary transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Side Drawer Menu (60% width, full height) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            />
            {/* Side Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[60vw] min-w-[240px] max-w-[320px] bg-[#060b18]/95 border-l border-white/[0.08] backdrop-blur-xl z-[95] pt-[72px] px-6 pb-8 flex flex-col justify-between lg:hidden shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="space-y-6">
                {/* KWEST logo at top of drawer */}
                <div className="pb-4 border-b border-white/[0.06] flex flex-col gap-4">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-serif font-bold text-primary tracking-[0.3em] uppercase text-glow"
                  >
                    KWEST
                  </Link>
                  {/* Cart and Account icons below KWEST logo */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Link
                      href="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative group flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/[0.03] border border-primary/20 hover:border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:bg-primary/[0.04] transition-all duration-300 text-white/70 hover:text-primary cursor-pointer"
                      aria-label="Shopping Cart"
                    >
                      <ShoppingBag className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                      <span className="text-[10px] font-bold caps-label tracking-widest">Cart</span>
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-background text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.6)] animate-pulse">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative group flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white/[0.03] border border-primary/20 hover:border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:bg-primary/[0.04] transition-all duration-300 text-white/70 hover:text-primary cursor-pointer"
                      aria-label="User Account Profile"
                    >
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="User Profile"
                          className="w-4 h-4 rounded-full object-cover border border-primary/30 group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <User className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                      )}
                      <span className="text-[10px] font-bold caps-label tracking-widest">Account</span>
                    </Link>
                  </div>
                </div>

                {/* Search Bar for Mobile */}
                <form onSubmit={handleSearchSubmit} className="relative w-full" role="search">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    aria-label="Search collection"
                    className="w-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-full py-3 pl-11 pr-6 text-sm caps-label text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40"
                  />
                </form>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-5">
                  {currentMobileLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-xs caps-label tracking-[0.2em] font-semibold py-2 transition-colors duration-300 ${
                          active ? "text-primary text-glow font-bold" : "text-white/60 hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Login/Logout Section */}
              <div className="pt-6 border-t border-white/[0.06] space-y-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold text-[10px] caps-label tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                    <button className="w-full py-3.5 bg-primary text-background font-bold text-[10px] caps-label tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
