"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PublicRxVerificationProof } from "@/features/prescriptions/types/publicVerification";
import { getPublicRxProof } from "@/features/prescriptions/data/publicVerificationData";
import { VerificationCertificateHeader } from "@/features/prescriptions/components/verification/VerificationCertificateHeader";
import { DoctorCertificateCard } from "@/features/prescriptions/components/verification/DoctorCertificateCard";
import { PatientMaskedDetailsCard } from "@/features/prescriptions/components/verification/PatientMaskedDetailsCard";
import { CryptographicProofPanel } from "@/features/prescriptions/components/verification/CryptographicProofPanel";

export default function PublicRxVerificationPage() {
  const params = useParams();
  const rawId = params?.id as string | undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [proof, setProof] = useState<PublicRxVerificationProof | null>(null);

  useEffect(() => {
    if (!rawId) return;

    // Simulate NestJS API cryptographic proof fetching delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      const result = getPublicRxProof(decodeURIComponent(rawId));
      setProof(result);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [rawId]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-card-border pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary-teal transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to ShebaMitro Portal
        </Link>

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary-teal" />
          <span className="font-extrabold text-sm text-fg-app">ShebaMitro Public Proof Verification</span>
        </div>
      </div>

      {isLoading || !proof ? (
        <div className="rounded-2xl border border-card-border bg-card p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[400px]">
          <Loader2 className="h-10 w-10 text-primary-teal animate-spin" />
          <h3 className="font-bold text-sm text-fg-app">Fetching Cryptographic Proof...</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Querying NestJS Public Verification API & validating BMDC digital signatures for ID: {rawId || "..."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Institutional Header & Green Animated Checkmark */}
          <VerificationCertificateHeader proof={proof} />

          {/* Prescribing Doctor Verification Card */}
          <DoctorCertificateCard proof={proof} />

          {/* Patient Masked Clinical Record */}
          <PatientMaskedDetailsCard proof={proof} />

          {/* Cryptographic SHA-256 Ledger Panel */}
          <CryptographicProofPanel proof={proof} />
        </div>
      )}
    </div>
  );
}
