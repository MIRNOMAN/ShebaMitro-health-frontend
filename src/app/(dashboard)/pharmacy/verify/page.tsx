"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrCameraScanner } from "@/features/pharmacy/components/verify/QrCameraScanner";
import {
  VerificationBadgeResult,
  VerificationResult,
} from "@/features/pharmacy/components/verify/VerificationBadgeResult";
import { PRESET_MOCK_RESULTS } from "@/features/pharmacy/data/verificationData";

export default function PharmacyQRVerifyPage() {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQueryVerification = (queryPayload: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const text = queryPayload.toLowerCase();
      if (text.includes("fake") || text.includes("tamper") || text.includes("invalid")) {
        setVerificationResult(PRESET_MOCK_RESULTS.tampered!);
        triggerToast("⚠️ Prescription Verification Failed: Invalid Signature!");
      } else if (text.includes("dispense") || text.includes("8104")) {
        setVerificationResult(PRESET_MOCK_RESULTS.dispensed!);
        triggerToast("⚠️ Warning: Prescription already fulfilled!");
      } else {
        setVerificationResult(PRESET_MOCK_RESULTS.valid!);
        triggerToast("✓ Prescription Verified: Authentic & Valid!");
      }
    }, 800);
  };

  const handleDispenseMedicines = () => {
    if (!verificationResult || verificationResult.status !== "VALID") return;
    const nowStr = new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });

    setVerificationResult({
      ...verificationResult,
      status: "ALREADY_DISPENSED",
      dispensedInfo: {
        dispensedAt: nowStr,
        branchName: "Popular Pharmacy Central Hub (Panthapath)",
        pharmacistName: "Pharm. Anisur Rahman (Lic #PH-8902)",
        orderRef: `DISP-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    });

    triggerToast(`Medicines for ${verificationResult.rxId} marked as DISPENSED!`);
  };

  return (
    <div className="space-y-6 pb-12">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-primary-teal/40 shadow-2xl text-fg-app text-xs font-semibold glow-teal"
          >
            <div className="h-7 w-7 rounded-xl bg-primary-teal text-white flex items-center justify-center shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Anti-Counterfeit Prescription Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Live Prescription <span className="text-emerald-500">QR Verifier</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Scan patient mobile prescription QR codes using camera to authenticate signatures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleQueryVerification("valid RX-2026-9012")} className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10">🟢 Valid Rx</Button>
          <Button variant="outline" size="sm" onClick={() => handleQueryVerification("dispense RX-2026-8104")} className="h-8 text-xs font-bold border-amber-500/40 text-amber-500 hover:bg-amber-500/10">🟡 Dispensed</Button>
          <Button variant="outline" size="sm" onClick={() => handleQueryVerification("tamper FAKE-999")} className="h-8 text-xs font-bold border-rose-500/40 text-rose-500 hover:bg-rose-500/10">🔴 Tampered</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <QrCameraScanner
          onScanSuccess={handleQueryVerification}
          onQueryManual={handleQueryVerification}
          isVerifying={isVerifying}
        />

        <VerificationBadgeResult
          isVerifying={isVerifying}
          result={verificationResult}
          onDispense={handleDispenseMedicines}
        />
      </div>
    </div>
  );
}
