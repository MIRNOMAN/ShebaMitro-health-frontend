"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// 1. FadeInUp Component
// ---------------------------------------------------------------------------

export interface FadeInUpProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

/**
 * FadeInUp Motion Primitive
 *
 * Slides content up and fades in as it enters the viewport.
 * Automatically bypassed when `prefers-reduced-motion` is enabled.
 */
export function FadeInUp({
  children,
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  className = "",
  ...props
}: FadeInUpProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as const,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 2. ScaleOnHover Component
// ---------------------------------------------------------------------------

export interface ScaleOnHoverProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

/**
 * ScaleOnHover Motion Primitive
 *
 * Scales content smoothly on hover and tap.
 * Automatically bypassed when `prefers-reduced-motion` is enabled.
 */
export function ScaleOnHover({
  children,
  scale = 1.04,
  className = "",
  ...props
}: ScaleOnHoverProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// 3. StaggerChildren Component & StaggerItem
// ---------------------------------------------------------------------------

export interface StaggerChildrenProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  className?: string;
}

/**
 * StaggerChildren Motion Primitive
 *
 * Parent container that orchestrates staggered entrance animations for child elements.
 * Automatically bypassed when `prefers-reduced-motion` is enabled.
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  delayChildren = 0.05,
  once = true,
  className = "",
  ...props
}: StaggerChildrenProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item variant helper for StaggerChildren.
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

export const StaggerItem = motion.div;
