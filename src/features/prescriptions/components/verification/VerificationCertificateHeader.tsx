"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { PublicRxVerificationProof } from "../../types/publicVerification";

interface VerificationCertificateHeaderProps {
  proof: PublicRxVerificationProof;
}

export function VerificationCertificateHeader({ proof }: VerificationCertificateHeaderProps) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4 text-center shadow-xs">
      {/* Top Seal Header */}
      <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold tracking-wider uppercase">
        <Award className="h-4 w-4" />
        <span>Ministry of Health & Family Welfare • BMDC Verified Cryptographic Registry</span>
      </div>

      {/* Animated Green Checkmark Seal */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
        <div className="relative p-3.5 rounded-full bg-emerald-500 text-white shadow-lg">
          <CheckCircle2 className="h-10 w-10" />
        </div>
      </div>

      {/* Main Validation Title */}
      <div>
        <h2 className="text-xl font-black text-fg-app">Valid & Unaltered Medical Record</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          Cryptographically authenticated via ShebaMitro NestJS Proof Verification Engine. Digital signature signature matches BMDC doctor registry.
        </p>
      </div>

      {/* Rx ID Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-emerald-500/30 font-mono text-xs font-bold text-emerald-600">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Prescription ID: {proof.rxNumber}</span>
      </div>
    </div>
  );
}
