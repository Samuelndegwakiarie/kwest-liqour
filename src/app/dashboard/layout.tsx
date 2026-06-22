"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Settings,
  Megaphone, Image, Mail, Calendar, Bell,
  LogOut, Menu, X, ChevronRight, Shield, AlertTriangle,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Promo Banners", href: "/dashboard/promo-banners", icon: Megaphone },
  { label: "Hero Images", href: "/dashboard/hero-images", icon: Image },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Alerts", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    const adminSession = sessionStorage.getItem("kwest_admin");
    if (adminSession === "authenticated") {
      setIsAuth(true);
    }
    setIsChecking(false);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (data.authenticated) {
        sessionStorage.setItem("kwest_admin", "authenticated");
        setIsAuth(true);
      } else {
        setLoginError("Invalid credentials. Check your email and password.");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    }
  }, [loginEmail, loginPass]);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("kwest_admin");
    setIsAuth(false);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 mb-4">
              <Shield className="w-7 h-7 text-[#d4af37]" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Vault Manager</h1>
            <p className="text-white/40 text-xs tracking-widest uppercase mt-1">Kwest Liquor — Admin Suite</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-8 space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block">Email Address</label>
              <input
                id="admin-email"
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="admin@kwestliquor.co.ke"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/[0.03] transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block">Password</label>
              <input
                id="admin-pass"
                type="password"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/[0.03] transition-all"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-red-400 text-xs">{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm py-3 rounded-xl transition-all duration-200 tracking-wider uppercase cursor-pointer"
            >
              Access Vault
            </button>

            <p className="text-center text-white/20 text-[10px]">
              Demo: admin@kwestliquor.co.ke / kwest2026
            </p>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-white/30 text-xs hover:text-[#d4af37] transition-colors">
              ← Return to Customer Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[60vw] min-w-[240px] max-w-[300px] lg:w-64 bg-[#0d0d0d] border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-[#d4af37] font-serif font-bold text-lg tracking-tight">KWEST</div>
            <div className="text-white/30 text-[9px] uppercase tracking-widest">Admin Suite</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/30 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                  isActive
                    ? "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/20"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#d4af37]" : "text-white/40 group-hover:text-white/70"}`} />
                <span className="font-medium text-[13px]">{label}</span>
                {label === "Alerts" && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
                {isActive && <ChevronRight className="ml-auto w-3.5 h-3.5 text-[#d4af37]/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <span>View Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#080808]/80 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-white/30">
              {NAV_ITEMS.find(n => n.href === pathname)?.label ?? "Dashboard"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setUnreadCount(0); router.push("/dashboard/notifications"); }}
              className="relative p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#d4af37]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
