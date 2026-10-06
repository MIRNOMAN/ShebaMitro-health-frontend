"use client";

import React from "react";
import { MOCK_PLATFORM_STATS } from "../data/aboutData";

export function AboutStatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {MOCK_PLATFORM_STATS.map((stat, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-card-border bg-card p-6 space-y-2 shadow-xs hover:border-primary-teal/40 transition-colors"
        >
          <div className="text-3xl font-black text-primary-teal font-mono">
            {stat.value}
          </div>
          <h4 className="font-extrabold text-sm text-fg-app">{stat.label}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
