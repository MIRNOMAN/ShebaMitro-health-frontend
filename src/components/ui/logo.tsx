"use client";

import * as React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * ShebaMitro official SVG Brand Logo Component
 * Renders the official stylized 'M', supporting hand, central medical cross with ECG pulse,
 * and dual-tinted cyan & emerald brand text.
 */
export function ShebaMitroLogo({
  className = "",
  showText = true,
  size = "md",
}: LogoProps) {
  const dimensions = {
    sm: { icon: 34, text: "text-lg" },
    md: { icon: 44, text: "text-xl" },
    lg: { icon: 58, text: "text-3xl" },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon matching exact official design */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
      >
        <defs>
          {/* Main Teal/Cyan to Emerald Gradient */}
          <linearGradient id="sm-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C49F" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Medical Cross to Heartbeat Pulse Gradient */}
          <linearGradient id="sm-pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="sm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer M Outline */}
        <path
          d="M 20,48 C 20,24 35,16 46,34 C 49,39 51,39 54,34 C 65,16 80,24 80,48"
          stroke="url(#sm-brand-gradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#sm-glow)"
        />

        {/* Supporting Hand at Bottom */}
        <path
          d="M 18,52 C 22,66 38,78 50,78 C 62,78 78,66 82,56 C 72,66 58,68 48,62 C 38,56 26,56 18,52 Z"
          stroke="url(#sm-brand-gradient)"
          strokeWidth="4"
          fill="url(#sm-brand-gradient)"
          fillOpacity="0.12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Glowing Medical Cross */}
        <path
          d="M 50,30 V 48 M 41,39 H 59"
          stroke="url(#sm-pulse-gradient)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* ECG Heartbeat Pulse Line extending out */}
        <path
          d="M 57,39 L 63,39 L 67,31 L 71,46 L 75,36 L 79,39 L 88,39"
          stroke="#F97316"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight ${dimensions.text}`}>
            <span className="text-[#00A8CC]">Sheba</span>
            <span className="text-[#00B884]">Mitro</span>
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-fg mt-0.5">
            Healthcare Ecosystem
          </span>
        </div>
      )}
    </div>
  );
}
