"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Camera,
  CameraOff,
  RefreshCw,
  Search,
  FileText,
  User,
  Stethoscope,
  Pill,
  Clock,
  Building2,
  Check,
  X,
  Lock,
  Sparkles,
  Award,
  ArrowRight,
  Send,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types & Interfaces ────────────────────────────────────────────────────────
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

// ── Preset Verification Mock Data ──────────────────────────────────────────────
const PRESET_MOCK_RESULTS: Record<string, VerificationResult> = {
  valid: {
    status: "VALID",
    rxId: "RX-2026-9012",
    patientName: "Sabbir Ahmed Khan",
    patientAge: 48,
    patientGender: "Male",
    patientId: "PT-9402",
    doctorName: "Prof. Dr. Mahmudul Hasan",
    doctorBMDC: "BMDC-A-48920",
    doctorHospital: "BSMMU, Dhaka",
    issuedAt: "2026-10-06 08:30 AM",
    signatureHash: "SHA256:9A8B7C6D5E4F3A2B1C0D",
    medicines: [
      { name: "Tab. Rosuvastatin (Rosuva)", dosage: "10mg", duration: "30 Days", instructions: "1+0+0 (Night after dinner)", qty: 30 },
      { name: "Tab. Metformin (GlucoMet)", dosage: "500mg", duration: "30 Days", instructions: "1+0+1 (Before meals)", qty: 60 },
      { name: "Tab. Telmisartan (Telmi)", dosage: "40mg", duration: "30 Days", instructions: "1+0+0 (Morning after breakfast)", qty: 30 },
    ],
  },
  dispensed: {
    status: "ALREADY_DISPENSED",
    rxId: "RX-2026-8104",
    patientName: "Sharmin Sultana",
    patientAge: 35,
    patientGender: "Female",
    patientId: "PT-3321",
    doctorName: "Dr. Syeda Rashida Begum",
    doctorBMDC: "BMDC-A-31204",
    doctorHospital: "Square Hospital, Dhaka",
    issuedAt: "2026-10-04 10:15 AM",
    signatureHash: "SHA256:4F3E2D1C0B9A8F7E6D5C",
    medicines: [
      { name: "Tab. Cefuroxime Axetil (Kilbac)", dosage: "500mg", duration: "7 Days", instructions: "1+0+1 (After meals)", qty: 14 },
      { name: "Tab. Paracetamol (Napa Extra)", dosage: "500mg", duration: "5 Days", instructions: "1+1+1 (If fever > 100°F)", qty: 15 },
    ],
    dispensedInfo: {
      dispensedAt: "2026-10-04 04:20 PM",
      branchName: "Dhanmondi Central Pharmacy (Branch #3)",
      pharmacistName: "Pharm. Kamrul Islam (Lic #PH-402)",
      orderRef: "DISP-88402",
    },
  },
  tampered: {
    status: "INVALID_TAMPERED",
    rxId: "RX-2026-FAKE",
    patientName: "Unknown / Modified Payload",
    patientAge: 0,
    patientGender: "Other",
    patientId: "INVALID-PT",
    doctorName: "Unverified Entity",
    doctorBMDC: "BMDC-UNKNOWN",
    doctorHospital: "Unregistered Clinic",
    issuedAt: "N/A",
    signatureHash: "SHA256:MISMATCH_CHECKSUM_ERROR",
    medicines: [],
    tamperReason: "Cryptographic signature validation failed. Payload checksum does not match Doctor BMDC private key registry.",
  },
};

export default function PharmacyQRVerifyPage() {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const html5QrcodeRef = useRef<any>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initialize html5-qrcode scanner when camera is toggled active
  useEffect(() => {
    let html5QrcodeScanner: any = null;

    if (cameraActive) {
      // Dynamic import to prevent SSR window issues
      import("html5-qrcode")
        .then(({ Html5QrcodeScanner }) => {
          html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
          );

          html5QrcodeScanner.render(
            (decodedText: string) => {
              // On Success Scan
              handleQueryVerification(decodedText);
              html5QrcodeScanner.clear().catch(() => {});
              setCameraActive(false);
            },
            (errorMessage: string) => {
              // Ignored normal scan frame failures
            }
          );

          html5QrcodeRef.current = html5QrcodeScanner;
        })
        .catch((err) => {
          setScannerError("Camera access failed or scanner initialization error.");
        });
    }

    return () => {
      if (html5QrcodeRef.current) {
        try {
          html5QrcodeRef.current.clear().catch(() => {});
        } catch (e) {
          // cleanup
        }
      }
    };
  }, [cameraActive]);

  // Query Backend Verification API (simulated)
  const handleQueryVerification = (queryPayload: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const text = queryPayload.toLowerCase();

      if (text.includes("fake") || text.includes("tamper") || text.includes("invalid")) {
        setVerificationResult(PRESET_MOCK_RESULTS.tampered!);
        triggerToast("⚠️ Prescription Verification Failed: Invalid Signature Signature!");
      } else if (text.includes("dispense") || text.includes("8104")) {
        setVerificationResult(PRESET_MOCK_RESULTS.dispensed!);
        triggerToast("⚠️ Warning: Prescription already fulfilled!");
      } else {
        setVerificationResult(PRESET_MOCK_RESULTS.valid!);
        triggerToast("✓ Prescription Verified: Authentic & Valid!");
      }
    }, 800);
  };

  // Dispense Action (Marks Valid Rx as Dispensed)
  const handleDispenseMedicines = () => {
    if (!verificationResult || verificationResult.status !== "VALID") return;

    const nowStr = new Date().toLocaleString([], {
      dateStyle: "short",
      timeStyle: "short",
    });

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
      {/* Toast Notification Banner */}
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

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Anti-Counterfeit Prescription Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Live Prescription <span className="text-emerald-500">QR Verifier</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Scan patient mobile prescription QR codes using live camera feed or input signature string to authenticate doctor BMDC signatures & prevent duplicate dispensing.
          </p>
        </div>

        {/* Quick Test Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Test Scenarios:
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQueryVerification("valid RX-2026-9012")}
            className="h-8 text-xs font-bold border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
          >
            🟢 Test Valid Rx
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQueryVerification("dispense RX-2026-8104")}
            className="h-8 text-xs font-bold border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
          >
            🟡 Test Dispensed
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQueryVerification("tamper FAKE-999")}
            className="h-8 text-xs font-bold border-rose-500/40 text-rose-500 hover:bg-rose-500/10"
          >
            🔴 Test Tampered
          </Button>
        </div>
      </div>

      {/* Main Grid: Camera Scanner & Input + Verification Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Scanner & Signature Input (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Camera Scanner Box */}
          <div className="p-5 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary-teal" /> Live Camera Scanner
              </h3>

              <Button
                variant={cameraActive ? "destructive" : "primary"}
                size="sm"
                onClick={() => setCameraActive(!cameraActive)}
                className="h-8 text-xs font-bold"
              >
                {cameraActive ? (
                  <>
                    <CameraOff className="h-3.5 w-3.5 mr-1" /> Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="h-3.5 w-3.5 mr-1" /> Start Camera
                  </>
                )}
              </Button>
            </div>

            {/* Scanner Container */}
            <div className="relative min-h-[260px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
              {cameraActive ? (
                <div id="qr-reader" className="w-full h-full text-slate-100 text-xs" />
              ) : (
                <div className="text-center space-y-3 p-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary-teal/10 text-primary-teal border border-primary-teal/30 flex items-center justify-center mx-auto shadow-inner">
                    <QrCode className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">
                      Camera Ready for QR Scanning
                    </span>
                    <span className="text-[11px] text-slate-400 block max-w-xs mx-auto">
                      Click "Start Camera" above or paste QR code signature string below to verify.
                    </span>
                  </div>
                </div>
              )}

              {scannerError && (
                <p className="text-[11px] text-rose-400 font-semibold mt-2">{scannerError}</p>
              )}
            </div>
          </div>

          {/* Manual QR Code Signature String Input */}
          <div className="p-5 rounded-2xl border border-card-border bg-card space-y-3 shadow-xs">
            <h3 className="font-bold text-xs text-fg-app uppercase tracking-wider flex items-center gap-2">
              <Search className="h-4 w-4 text-purple-500" /> Manual RX Code Lookup
            </h3>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter Rx ID or QR Payload (e.g. RX-2026-9012)"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-mono font-semibold text-fg-app focus:outline-none focus:border-primary-teal"
              />

              <Button
                variant="primary"
                onClick={() => handleQueryVerification(manualInput || "RX-2026-9012")}
                disabled={isVerifying}
                className="w-full h-10 text-xs font-bold justify-center"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Signature...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Query Verification API
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Results & Badges (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {isVerifying && (
            <div className="h-64 rounded-2xl border border-card-border bg-card flex flex-col items-center justify-center p-6 space-y-3 text-center shadow-xs">
              <RefreshCw className="h-8 w-8 text-primary-teal animate-spin" />
              <span className="font-bold text-sm text-fg-app">
                Decoding Cryptographic Signature & Interrogating Registry...
              </span>
              <span className="text-xs text-muted-foreground">Checking BMDC Doctor Private Keys & Dispense Ledger</span>
            </div>
          )}

          {!isVerifying && !verificationResult && (
            <div className="h-64 rounded-2xl border border-dashed border-card-border bg-card/60 flex flex-col items-center justify-center p-6 space-y-2 text-center text-muted-foreground">
              <QrCode className="h-10 w-10 text-muted-foreground/40" />
              <span className="font-bold text-sm text-fg-app">No Prescription Scanned</span>
              <span className="text-xs max-w-sm">
                Scan a QR code using camera or click one of the quick test buttons above to view instant verification badges.
              </span>
            </div>
          )}

          {!isVerifying && verificationResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              {/* 🟢 BADGE STATE 1: AUTHENTIC & VALID */}
              {verificationResult.status === "VALID" && (
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
                        <h3 className="font-bold text-lg text-fg-app mt-1">
                          Prescription #{verificationResult.rxId}
                        </h3>
                      </div>
                    </div>

                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={handleDispenseMedicines}
                      className="font-bold text-xs shadow-md glow-emerald"
                    >
                      <Pill className="h-4 w-4 mr-1.5" /> Dispense Medicines Now
                    </Button>
                  </div>

                  {/* Doctor & Patient Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-card border border-card-border space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                        Prescribing Physician
                      </span>
                      <p className="font-bold text-fg-app flex items-center gap-1.5">
                        <Stethoscope className="h-4 w-4 text-purple-500" />
                        {verificationResult.doctorName}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {verificationResult.doctorBMDC} • {verificationResult.doctorHospital}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-card border border-card-border space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                        Patient Details
                      </span>
                      <p className="font-bold text-fg-app flex items-center gap-1.5">
                        <User className="h-4 w-4 text-primary-teal" />
                        {verificationResult.patientName}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {verificationResult.patientAge} Yrs ({verificationResult.patientGender}) • ID: {verificationResult.patientId}
                      </p>
                    </div>
                  </div>

                  {/* Prescribed Medicines List */}
                  <div className="p-4 rounded-xl bg-card border border-card-border space-y-3 text-xs">
                    <span className="font-bold text-fg-app block border-b border-card-border pb-2">
                      Verified Prescribed Medication Items ({verificationResult.medicines.length}):
                    </span>
                    <div className="space-y-2">
                      {verificationResult.medicines.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-surface-card-hover border border-card-border/70 flex items-center justify-between text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-fg-app block">{med.name}</span>
                            <span className="text-[11px] text-muted-foreground block">
                              Dosage: {med.dosage} • Duration: {med.duration}
                            </span>
                            <span className="text-[10px] text-primary-teal font-semibold block">
                              Instructions: {med.instructions}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                              Qty: {med.qty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signature Hash Footer */}
                  <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                    <span>Digital Seal: {verificationResult.signatureHash}</span>
                    <span>Issued: {verificationResult.issuedAt}</span>
                  </div>
                </div>
              )}

              {/* 🟡 BADGE STATE 2: ALREADY DISPENSED */}
              {verificationResult.status === "ALREADY_DISPENSED" && (
                <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 space-y-5 shadow-lg">
                  <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                    <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-xs tracking-wide uppercase">
                        Already Dispensed
                      </span>
                      <h3 className="font-bold text-lg text-fg-app mt-1">
                        Prescription #{verificationResult.rxId}
                      </h3>
                    </div>
                  </div>

                  {/* Duplicate Dispense Warning Alert */}
                  <div className="p-4 rounded-xl bg-card border border-amber-500/30 text-xs space-y-2">
                    <span className="font-bold text-amber-500 flex items-center gap-1.5 text-sm">
                      <AlertTriangle className="h-4 w-4" /> Duplicate Fulfillment Prohibited
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      This digital prescription has already been fulfilled. Re-dispensing medicines against this QR code is strictly restricted by pharmacy policy.
                    </p>
                  </div>

                  {/* Previous Dispense Log Details */}
                  {verificationResult.dispensedInfo && (
                    <div className="p-4 rounded-xl bg-card border border-card-border text-xs space-y-2 font-mono">
                      <span className="font-bold text-fg-app font-sans block text-xs uppercase tracking-wider border-b border-card-border pb-1">
                        Fulfillment History Log:
                      </span>
                      <p className="text-muted-foreground">
                        Dispensed At: <span className="text-fg-app font-bold">{verificationResult.dispensedInfo.dispensedAt}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Branch: <span className="text-fg-app font-bold">{verificationResult.dispensedInfo.branchName}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Pharmacist: <span className="text-fg-app font-bold">{verificationResult.dispensedInfo.pharmacistName}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Ref Code: <span className="text-amber-500 font-extrabold">{verificationResult.dispensedInfo.orderRef}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 🔴 BADGE STATE 3: TAMPERED / INVALID SIGNATURE */}
              {verificationResult.status === "INVALID_TAMPERED" && (
                <div className="p-6 rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 space-y-5 shadow-lg">
                  <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
                    <div className="h-10 w-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-xs tracking-wide uppercase">
                        Tampered / Invalid Signature
                      </span>
                      <h3 className="font-bold text-lg text-fg-app mt-1">
                        Counterfeit Warning Flag
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-rose-500/30 text-xs space-y-2">
                    <span className="font-bold text-rose-500 flex items-center gap-1.5 text-sm">
                      <ShieldAlert className="h-4 w-4" /> Security Alert: Signature Verification Failed
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {verificationResult.tamperReason ||
                        "Cryptographic validation mismatch. The QR payload has been modified or does not originate from a registered ShebaMitro doctor."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-card-border text-xs space-y-1 text-muted-foreground">
                    <span className="font-bold text-fg-app block text-xs">Standard Operating Procedure:</span>
                    <p>1. Refuse dispensing any prescription items under this payload.</p>
                    <p>2. Report suspicious QR code attempt to ShebaMitro Security Desk.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
