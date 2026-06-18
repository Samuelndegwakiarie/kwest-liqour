"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { useReviews } from "@/context/ReviewContext";
import { GlassCard } from "./GlassCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

export function RotatingReviews() {
  const { reviews } = useReviews();

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-background relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto text-center space-y-12">
        <ScrollReveal>
          <div className="space-y-4">
            <span className="text-[9px] font-bold text-primary tracking-[0.3em] uppercase block text-glow">
              Client Testimonials
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter">
              Connoisseur <span className="gradient-text-static">Insights</span>
            </h2>
            <p className="text-text-muted text-xs tracking-widest max-w-md mx-auto">
              REVIEWS FROM THE EXCLUSIVE MEMBERSHIP CIRCLE
            </p>
          </div>
        </ScrollReveal>

        {reviews.length === 0 ? (
          <ScrollReveal>
            <div className="py-12 glass-card rounded-2xl max-w-md mx-auto text-text-muted text-xs">
              No testimonials have been logged yet.
            </div>
          </ScrollReveal>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {reviews.map((review, idx) => (
              <StaggerItem key={review.id}>
                <ReviewCard review={review} index={idx} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review, index }: { review: any; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Map relative mouse position to max 12 degrees tilt
    setTilt({
      x: -y / (box.height / 2) * 12,
      y: x / (box.width / 2) * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Staggered float keyframes so cards "dance" independently
  const floatY = [0, -10 - (index % 3) * 4, 0];
  const floatRotate = [0.8 + (index % 2) * 0.4, -0.8 - (index % 2) * 0.4, 0.8 + (index % 2) * 0.4];
  const duration = 4.5 + (index % 3) * 1.2;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={
        isHovered
          ? {
              y: -12, // slightly lift when hovered
              rotate: 0,
              rotateX: tilt.x,
              rotateY: tilt.y,
              scale: 1.03,
            }
          : {
              y: floatY,
              rotate: floatRotate,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
            }
      }
      transition={
        isHovered
          ? { type: "spring", stiffness: 300, damping: 20 }
          : {
              y: { duration, ease: "easeInOut", repeat: Infinity },
              rotate: { duration, ease: "easeInOut", repeat: Infinity },
              default: { type: "spring", stiffness: 100, damping: 20 }
            }
      }
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="h-full select-none"
    >
      <GlassCard
        padding="p-8"
        hover={false}
        glow={isHovered}
        className="h-full border-white/[0.06] bg-white/[0.01] flex flex-col justify-between text-left rounded-3xl relative overflow-hidden transition-all duration-300"
      >
        {/* Shimmer Border Effect */}
        {isHovered && (
          <div className="absolute inset-0 rounded-3xl border border-primary/20 pointer-events-none" />
        )}

        <div className="space-y-6" style={{ transform: "translateZ(30px)" }}>
          {/* Star Rating */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                    : "text-white/10"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="text-white/80 text-xs font-medium leading-relaxed italic font-sans tracking-wide">
            &ldquo;{review.comment}&rdquo;
          </p>
        </div>

        {/* Client Identity & Allocation Meta */}
        <div className="space-y-3 pt-6 border-t border-white/[0.04] mt-6" style={{ transform: "translateZ(20px)" }}>
          <div>
            <h4 className="text-sm font-bold text-white">{review.name}</h4>
            <span className="text-[9px] text-text-subtle uppercase tracking-widest font-semibold block mt-0.5">
              Verified Circle Member • {review.date}
            </span>
          </div>

          {review.productNames && review.productNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {review.productNames.map((prod: string, pIdx: number) => (
                <span
                  key={pIdx}
                  className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[8px] font-bold tracking-wider uppercase"
                >
                  {prod}
                </span>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
