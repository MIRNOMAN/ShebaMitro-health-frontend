"use client";

import * as React from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

/**
 * CustomCursor Component
 *
 * A hardware-accelerated, responsive custom cursor featuring:
 * 1. Expand animation on hoverable/clickable elements.
 * 2. Contextual pill tags ("View" or "Book") when hovering elements with `data-cursor-text`.
 * 3. Automatic disable on touch devices or screens smaller than 768px.
 * 4. Accessibility compliance via prefers-reduced-motion checks.
 */
export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();

  const [isVisible, setIsVisible] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [cursorText, setCursorText] = React.useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  // Hardware accelerated spring physics for smooth tracking
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  React.useEffect(() => {
    // Check if the current environment is a touch device or mobile screen (<768px)
    const checkTouchAndViewport = () => {
      const isSmallScreen = window.innerWidth < 768;
      const isTouchCapable =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

      setIsTouchDevice(isSmallScreen || isTouchCapable);
    };

    checkTouchAndViewport();
    window.addEventListener("resize", checkTouchAndViewport);

    return () => window.removeEventListener("resize", checkTouchAndViewport);
  }, []);

  React.useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for contextual tag attribute (e.g. data-cursor-text="View" or "Book")
      const textTarget = target.closest("[data-cursor-text]");
      if (textTarget) {
        const text = textTarget.getAttribute("data-cursor-text");
        setCursorText(text);
        setIsHovered(true);
        return;
      } else {
        setCursorText(null);
      }

      // Check for clickable interactive elements
      const interactiveTarget = target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor-expand]'
      );

      if (interactiveTarget) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [cursorX, cursorY, isTouchDevice, isVisible, prefersReducedMotion]);

  // Do not render on touch devices, small viewports (<768px), or when reduced motion is requested
  if (isTouchDevice || prefersReducedMotion || !isVisible) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full mix-blend-difference bg-white text-black transition-colors duration-200 shadow-lg"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        willChange: "transform",
      }}
      animate={{
        width: cursorText ? "auto" : isHovered ? 52 : 14,
        height: cursorText ? 32 : isHovered ? 52 : 14,
        paddingLeft: cursorText ? 16 : 0,
        paddingRight: cursorText ? 16 : 0,
        borderRadius: cursorText ? 16 : 9999,
        scale: isHovered ? 1.15 : 1,
      }}
      transition={{ type: "spring", stiffness: 450, damping: 26 }}
    >
      {cursorText && (
        <span className="text-xs font-black tracking-wider uppercase whitespace-nowrap select-none text-black">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}
