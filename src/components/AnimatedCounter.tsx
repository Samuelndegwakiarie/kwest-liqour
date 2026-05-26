"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useRef, useEffect } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  labelClassName?: string;
  label?: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  labelClassName = "",
  label,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      return controls.stop;
    }
  }, [isInView, target, duration, count]);

  return (
    <div ref={ref} className="text-center">
      <div className={`flex items-baseline justify-center gap-1 ${className}`}>
        {prefix && <span>{prefix}</span>}
        <motion.span>{rounded}</motion.span>
        {suffix && <span className="text-primary">{suffix}</span>}
      </div>
      {label && (
        <p className={`mt-2 ${labelClassName}`}>{label}</p>
      )}
    </div>
  );
}
