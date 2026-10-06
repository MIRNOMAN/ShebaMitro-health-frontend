"use client";

import React from "react";
import { HeartPulse, ShieldCheck, Activity, Clock } from "lucide-react";
import { MOCK_CORE_VALUES } from "../data/aboutData";

export function AboutMissionValues() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "HeartPulse":
        return <HeartPulse className="h-5 w-5 text-primary-teal" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      case "Activity":
        return <Activity className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-black text-fg-app">Our Core Mission & Values</h2>
        <p className="text-xs text-muted-foreground">
          Built on principles of clinical excellence, data security, and patient-first innovation.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_CORE_VALUES.map((val) => (
          <div
            key={val.id}
            className="rounded-2xl border border-card-border bg-card p-6 space-y-3 shadow-xs hover:border-primary-teal/40 transition-colors flex items-start gap-4"
          >
            <div className="p-3 rounded-2xl bg-muted border border-card-border shrink-0">
              {getIcon(val.iconName)}
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-fg-app">{val.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {val.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
