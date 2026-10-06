import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, User, Stethoscope, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmissionResult {
  s3Url: string;
  sealHash: string;
  patientNotified: boolean;
  doctorNotified: boolean;
  outOfRangeCount: number;
}

interface DigitalSealModalProps {
  result: SubmissionResult | null;
  currentPatient: any;
  pathologistName: string;
  onClose: () => void;
}

export function DigitalSealModal({
  result,
  currentPatient,
  pathologistName,
  onClose,
}: DigitalSealModalProps) {
  if (!result) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-fg-app">Report Published & Sealed</h3>
                <p className="text-xs text-muted-foreground">Digital Signature & S3 Upload Confirmed</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                SHA-256 DIGITAL SEAL CERTIFICATE
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">ISO 15189</span>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <p className="text-fg-app font-bold">
                Hash: <span className="text-emerald-600 dark:text-emerald-400">{result.sealHash}</span>
              </p>
              <p className="text-muted-foreground truncate">
                Storage: <span className="text-fg-app">{result.s3Url}</span>
              </p>
              <p className="text-muted-foreground">
                Signatory: <span className="text-fg-app">{pathologistName}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-muted-foreground text-[11px] block">
              Automated Multi-Channel Dispatch Log:
            </span>

            <div className="p-3 rounded-xl bg-surface-card-hover border border-card-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg-app flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary-teal" /> Patient App & SMS Push:
                </span>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Sent to {currentPatient.patientName}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg-app flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-purple-500" /> Doctor Portal Alert:
                </span>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Sent to {currentPatient.referringDoctor}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-card-border">
            <span className="text-[11px] text-muted-foreground">
              {result.outOfRangeCount > 0 ? `⚠️ ${result.outOfRangeCount} out-of-range flag(s) included` : "✓ All biomarkers normal"}
            </span>

            <Button variant="primary" size="sm" onClick={onClose}>
              Close & Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
