"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight, HeartPulse } from "lucide-react";

export function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-card-border bg-gradient-to-br from-card via-card to-primary-teal/10 p-8 sm:p-12 lg:p-16 shadow-xs">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-teal/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Transforming Healthcare Access Across Bangladesh</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-fg-app leading-tight tracking-tight">
          Empowering Health with <span className="text-primary-teal">Cryptographic Trust</span> & Digital Excellence
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          ShebaMitro is Bangladesh’s unified digital healthcare network — seamlessly connecting BMDC-verified doctors, accredited diagnostic labs, model pharmacies, and patients under one intelligent ecosystem.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/doctors"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
          >
            <HeartPulse className="h-4 w-4" /> Find a Verified Doctor
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-card-border bg-card hover:bg-muted text-fg-app font-bold text-sm transition-all"
          >
            <ShieldCheck className="h-4 w-4 text-primary-teal" /> Verification Desk
          </Link>
        </div>
      </div>
    </section>
  );
}
