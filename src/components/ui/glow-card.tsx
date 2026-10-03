"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export interface GlowCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlowCard Component
 *
 * Tracks mouse cursor position to render dynamic radial gradient glow effects:
 * - Light Mode: subtle cyan & emerald border highlight.
 * - Dark Mode: luminescent violet border glow.
 * - Backdrop-blur 16px glassmorphism background.
 * - Accessibility compliant with prefers-reduced-motion checks.
 */
export function GlowCard({
  children,
  className = "",
  ...props
}: GlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [mousePos, setMousePos] = React.useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -500, y: -500 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card/85 backdrop-blur-[16px] transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Dynamic Radial Gradient Background Glow Overlay */}
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `
              radial-gradient(
                350px circle at ${mousePos.x}px ${mousePos.y}px,
                var(--glow-radial-color, rgba(142, 81, 240, 0.18)),
                transparent 80%
              )
            `,
          }}
          aria-hidden="true"
        />
      )}

      {/* Dynamic Luminous Border Highlight Mask */}
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl p-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `
              radial-gradient(
                220px circle at ${mousePos.x}px ${mousePos.y}px,
                var(--luminous-border-highlight, rgba(20, 184, 215, 0.8)),
                transparent 70%
              )
            `,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          aria-hidden="true"
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
