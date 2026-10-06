import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Stethoscope,
  User,
  Pill,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type VerificationBadgeState = "VALID" | "ALREADY_DISPENSED" | "INVALID_TAMPERED";

export interface PrescribedMedicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
  qty: number;
}

export interface VerificationResult {
  status: VerificationBadgeState;
  rxId: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientId: string;
  doctorName: string;
  doctorBMDC: string;
  doctorHospital: string;
  issuedAt: string;
  signatureHash: string;
  medicines: PrescribedMedicine[];
  dispensedInfo?: {
    dispensedAt: string;
    branchName: string;
    pharmacistName: string;
    orderRef: string;
  };
  tamperReason?: string;
}

interface VerificationBadgeResultProps {
  isVerifying: boolean;
  result: VerificationResult | null;
  onDispense: () => void;
}

export function VerificationBadgeResult({
  isVerifying,
  result,
  onDispense,
}: VerificationBadgeResultProps) {
  if (isVerifying) {
    return (
      <div className="lg:col-span-7 h-64 rounded-2xl border border-card-border bg-card flex flex-col items-center justify-center p-6 space-y-3 text-center shadow-xs">
        <RefreshCw className="h-8 w-8 text-primary-teal animate-spin" />
        <span className="font-bold text-sm text-fg-app">
          Decoding Cryptographic Signature & Interrogating Registry...
        </span>
        <span className="text-xs text-muted-foreground">Checking BMDC Doctor Private Keys & Dispense Ledger</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="lg:col-span-7 h-64 rounded-2xl border border-dashed border-card-border bg-card/60 flex flex-col items-center justify-center p-6 space-y-2 text-center text-muted-foreground">
        <QrCode className="h-10 w-10 text-muted-foreground/40" />
        <span className="font-bold text-sm text-fg-app">No Prescription Scanned</span>
        <span className="text-xs max-w-sm">
          Scan a QR code using camera or click one of the quick test buttons above to view instant verification badges.
        </span>
      </div>
    );
  }

  return (
    <div className="lg:col-span-7 space-y-5">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
        {/* 🟢 BADGE STATE 1: AUTHENTIC & VALID */}
        {result.status === "VALID" && (
          <div className="p-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 space-y-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-xs tracking-wide uppercase">
                    Authentic & Valid
                  </span>
                  <h3 className="font-bold text-lg text-fg-app mt-1">Prescription #{result.rxId}</h3>
                </div>
              </div>

              <Button
                variant="emerald"
                size="sm"
                onClick={onDispense}
                className="font-bold text-xs shadow-md glow-emerald"
              >
                <Pill className="h-4 w-4 mr-1.5" /> Dispense Medicines Now
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-card border border-card-border space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Prescribing Physician</span>
                <p className="font-bold text-fg-app flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-purple-500" />
                  {result.doctorName}
                </p>
                <p className="text-muted-foreground text-[11px]">{result.doctorBMDC} • {result.doctorHospital}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-card-border space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Patient Details</span>
                <p className="font-bold text-fg-app flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary-teal" />
                  {result.patientName}
                </p>
                <p className="text-muted-foreground text-[11px]">{result.patientAge} Yrs ({result.patientGender}) • ID: {result.patientId}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-card-border space-y-3 text-xs">
              <span className="font-bold text-fg-app block border-b border-card-border pb-2">
                Verified Prescribed Medication Items ({result.medicines.length}):
              </span>
              <div className="space-y-2">
                {result.medicines.map((med, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-surface-card-hover border border-card-border/70 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-fg-app block">{med.name}</span>
                      <span className="text-[11px] text-muted-foreground block">Dosage: {med.dosage} • Duration: {med.duration}</span>
                      <span className="text-[10px] text-primary-teal font-semibold block">Instructions: {med.instructions}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Qty: {med.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <span>Digital Seal: {result.signatureHash}</span>
              <span>Issued: {result.issuedAt}</span>
            </div>
          </div>
        )}

        {/* 🟡 BADGE STATE 2: ALREADY DISPENSED */}
        {result.status === "ALREADY_DISPENSED" && (
          <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 space-y-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
              <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-xs tracking-wide uppercase">Already Dispensed</span>
                <h3 className="font-bold text-lg text-fg-app mt-1">Prescription #{result.rxId}</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-amber-500/30 text-xs space-y-2">
              <span className="font-bold text-amber-500 flex items-center gap-1.5 text-sm">
                <AlertTriangle className="h-4 w-4" /> Duplicate Fulfillment Prohibited
              </span>
              <p className="text-muted-foreground leading-relaxed">
                This digital prescription has already been fulfilled. Re-dispensing medicines against this QR code is strictly restricted by pharmacy policy.
              </p>
            </div>

            {result.dispensedInfo && (
              <div className="p-4 rounded-xl bg-card border border-card-border text-xs space-y-2 font-mono">
                <span className="font-bold text-fg-app font-sans block text-xs uppercase tracking-wider border-b border-card-border pb-1">Fulfillment History Log:</span>
                <p className="text-muted-foreground">Dispensed At: <span className="text-fg-app font-bold">{result.dispensedInfo.dispensedAt}</span></p>
                <p className="text-muted-foreground">Branch: <span className="text-fg-app font-bold">{result.dispensedInfo.branchName}</span></p>
                <p className="text-muted-foreground">Pharmacist: <span className="text-fg-app font-bold">{result.dispensedInfo.pharmacistName}</span></p>
                <p className="text-muted-foreground">Ref Code: <span className="text-amber-500 font-extrabold">{result.dispensedInfo.orderRef}</span></p>
              </div>
            )}
          </div>
        )}

        {/* 🔴 BADGE STATE 3: TAMPERED / INVALID SIGNATURE */}
        {result.status === "INVALID_TAMPERED" && (
          <div className="p-6 rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 space-y-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
              <div className="h-10 w-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-xs tracking-wide uppercase">Tampered / Invalid Signature</span>
                <h3 className="font-bold text-lg text-fg-app mt-1">Counterfeit Warning Flag</h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-rose-500/30 text-xs space-y-2">
              <span className="font-bold text-rose-500 flex items-center gap-1.5 text-sm">
                <ShieldAlert className="h-4 w-4" /> Security Alert: Signature Verification Failed
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {result.tamperReason || "Cryptographic validation mismatch. The QR payload has been modified or does not originate from a registered ShebaMitro doctor."}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
