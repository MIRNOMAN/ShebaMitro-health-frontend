/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { motion, useSpring, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  /** Radius in pixels around the button center where magnetic attraction activates (default: 35px) */
  distance?: number;
  /** Attraction strength factor (0.1 to 1, default: 0.35) */
  strength?: number;
  className?: string;
}

/**
 * MagneticButton Component
 *
 * A reusable Framer Motion button component that calculates cursor proximity
 * (35px radius) and gently attracts toward the mouse position before snapping back on leave.
 * Bypassed when `prefers-reduced-motion` is enabled.
 */
export function MagneticButton({
  children,
  distance = 35,
  strength = 0.35,
  className = "",
  ...props
}: MagneticButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Smooth spring configuration for magnetic physics
  const springConfig = { damping: 15, stiffness: 160, mass: 0.1 };
  const positionX = useSpring(0, springConfig);
  const positionY = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const currentDistance = Math.hypot(deltaX, deltaY);

    // Trigger magnetic pull within proximity radius
    if (currentDistance < rect.width / 2 + distance) {
      positionX.set(deltaX * strength);
      positionY.set(deltaY * strength);
    } else {
      positionX.set(0);
      positionY.set(0);
    }
  };

  const handleMouseLeave = () => {
    positionX.set(0);
    positionY.set(0);
  };

  if (prefersReducedMotion) {
    return (
      <button ref={buttonRef} className={className} {...(props as any)}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: positionX, y: positionY }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
