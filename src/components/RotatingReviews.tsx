"use client";

import React from "react";
import { useReviews } from "@/context/ReviewContext";
import { ScrollReveal } from "./ScrollReveal";
import SocialCards from "@/components/ui/card-fan-carousel";

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
              Customers <span className="gradient-text-static">Insights</span>
            </h2>
            <p className="text-text-muted text-xs tracking-widest max-w-md mx-auto">
              REVIEWS FROM THE CUSTOMERS
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
          <ScrollReveal delay={0.2}>
            <div className="w-full flex justify-center pt-8">
              <SocialCards cards={reviews} />
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
