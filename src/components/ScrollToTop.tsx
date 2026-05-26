"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          onClick={scrollToTop}
          className="fixed bottom-[calc(var(--bottom-nav-height)+1.5rem)] lg:bottom-8 right-6 lg:right-8 z-50 p-3.5 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-md text-primary cursor-pointer hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
