/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

export const LenisContext = React.createContext<Lenis | null>(null);

/**
 * Custom hook to access the active Lenis smooth scroll instance.
 */
export function useLenis() {
  return React.useContext(LenisContext);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * SmoothScrollProvider Component
 *
 * Initializes Lenis smooth scrolling with requestAnimationFrame synchronization.
 * Automatically respects system reduced-motion preferences.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = React.useState<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    // Bypass smooth scrolling if user prefers reduced motion
    if (prefersReducedMotion) return;

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    setLenis(lenisInstance);

    let rafId: number;

    function updateRaf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(updateRaf);
    }

    rafId = requestAnimationFrame(updateRaf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
