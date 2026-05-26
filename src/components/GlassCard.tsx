"use client";

import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: string;
  as?: "div" | "article" | "section";
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  padding = "p-8",
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.08]
        transition-all duration-500 ease-out
        ${hover ? "hover:bg-white/[0.06] hover:border-primary/20 hover:shadow-[0_8px_40px_rgba(0,240,255,0.08)] cursor-pointer" : ""}
        ${glow ? "shadow-[0_0_30px_rgba(0,240,255,0.08)]" : ""}
        ${padding}
        ${className}
      `.trim()}
    >
      {/* Subtle gradient overlay at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
