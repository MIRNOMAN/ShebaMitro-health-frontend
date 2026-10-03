"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MarqueeItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  speed?: number; // duration in seconds
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * InfiniteMarquee Component
 *
 * Provides a continuous, GPU-accelerated horizontal scroll marquee:
 * 1. Clones items to guarantee seamless looping without gaps.
 * 2. Pauses on hover if enabled.
 * 3. Respects prefers-reduced-motion to switch to static layout if requested.
 */
export function InfiniteMarquee({
  items,
  speed = 35,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: InfiniteMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = React.useState(false);

  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 py-4 ${className}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-surface-border bg-surface-card/60 backdrop-blur-md"
          >
            <div className="text-primary-teal">{item.icon}</div>
            <div>
              <p className="text-xs font-bold text-fg-app">{item.title}</p>
              <p className="text-[10px] text-muted-fg">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Duplicate items twice to achieve smooth seamless looping
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      className={`relative overflow-hidden w-full py-4 mask-gradient-x ${className}`}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {/* Left/Right Fade Gradient Masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg-app to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-app to-transparent z-10" />

      {/* Marquee Track */}
      <motion.div
        className="flex items-center gap-6 w-max"
        style={{ willChange: "transform" }}
        animate={{
          x: direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        }}
        aria-hidden="true"
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex items-center gap-3.5 px-5 py-3 rounded-2xl border border-surface-border/80 bg-surface-card/70 backdrop-blur-md hover:border-luminous transition-all duration-300 shadow-xs hover:shadow-md group flex-shrink-0"
          >
            <div className="p-2 rounded-xl bg-muted-bg/80 text-primary-teal group-hover:bg-primary-teal/15 group-hover:scale-110 transition-all duration-300">
              {item.icon}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-fg-app group-hover:text-primary-teal transition-colors">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider rounded-md bg-emerald-accent/15 text-emerald-accent border border-emerald-accent/30">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-fg font-medium">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
