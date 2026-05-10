"use client";

import { motion } from "framer-motion";
import { Home, Wine, Bell, User, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "COLLECTION", icon: Wine, href: "/products" },
  { label: "HERITAGE", icon: History, href: "/about" },
  { label: "CONCIERGE", icon: Bell, href: "/contact" },
  { label: "CLUB", icon: User, href: "/account" },
];

export function MobileNavbar() {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/5 px-6 pb-6 pt-3"
    >
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-2 rounded-full transition-colors duration-300 ${isActive ? 'text-primary' : 'text-foreground/40 group-hover:text-primary'}`}>
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className={`text-[8px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${isActive ? 'text-primary' : 'text-foreground/40'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
