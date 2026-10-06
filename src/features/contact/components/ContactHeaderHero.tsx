"use client";

import React from "react";
import { MessageSquare, Sparkles, Clock, ShieldCheck } from "lucide-react";

export function ContactHeaderHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-card-border bg-gradient-to-br from-card via-card to-primary-teal/10 p-8 sm:p-12 lg:p-14 shadow-xs">
      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>24/7 Patient & Provider Support Desk</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-fg-app leading-tight tracking-tight">
          We’re Here to <span className="text-primary-teal">Help You</span> 24 Hours a Day
        </h1>

        {/* Subtitle */}
        <p className="text-base text-muted-foreground leading-relaxed">
          Have questions about doctor appointments, lab sample collection, pharmacy dispatch, or provider verification? Our dedicated support team is available around the clock.
        </p>

        {/* Response Badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-fg-app">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-card-border">
            <Clock className="h-4 w-4 text-emerald-500" /> Average Response Time: &lt; 15 Mins
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-card-border">
            <ShieldCheck className="h-4 w-4 text-primary-teal" /> 100% Verified Support Desk
          </span>
        </div>
      </div>
    </section>
  );
}
