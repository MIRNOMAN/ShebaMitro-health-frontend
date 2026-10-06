"use client";

import React from "react";
import Link from "next/link";
import { HeartPulse, ShieldCheck, ArrowRight } from "lucide-react";

export function AboutCtaBanner() {
  return (
    <div className="rounded-3xl border border-primary-teal/30 bg-gradient-to-r from-primary-teal/20 via-card to-card p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
      <div className="space-y-2 text-center md:text-left">
        <h3 className="text-xl sm:text-2xl font-black text-fg-app">
          Ready to Experience Modern Healthcare?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Book an instant tele-consultation with top BMDC specialists or verify your healthcare facility on the ShebaMitro network today.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/doctors"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
        >
          <HeartPulse className="h-4 w-4" /> Book Consultation
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-card-border bg-card hover:bg-muted text-fg-app font-bold text-xs transition-all"
        >
          <ShieldCheck className="h-4 w-4 text-primary-teal" /> Verification Desk
        </Link>
      </div>
    </div>
  );
}
