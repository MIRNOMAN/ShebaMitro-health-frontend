"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Send,
  Sparkles,
  Check,
  X,
  RefreshCw,
  Eye,
  Download,
  User,
  Stethoscope,
  Hash,
  Award,
  Activity,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Copy,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface BiomarkerDefinition {
  id: string;
  name: string;
  unit: string;
  minRef: number;
  maxRef: number;
  defaultValue: number;
}

export interface TestTemplate {
  id: string;
  title: string;
  category: string;
  biomarkers: BiomarkerDefinition[];
}

// ── Pre-configured Test Templates ──────────────────────────────────────────────
const TEST_TEMPLATES: TestTemplate[] = [
  {
    id: "TEST-CBC",
    title: "Complete Blood Count (CBC) with ESR",
    category: "Hematology",
    biomarkers: [
      { id: "hb", name: "Hemoglobin (Hb)", unit: "g/dL", minRef: 12.0, maxRef: 16.5, defaultValue: 13.8 },
      { id: "wbc", name: "Total WBC Count", unit: "/µL", minRef: 4000, maxRef: 11000, defaultValue: 12500 }, // Out of range high
      { id: "platelets", name: "Platelet Count", unit: "/µL", minRef: 150000, maxRef: 450000, defaultValue: 210000 },
      { id: "rbc", name: "RBC Count", unit: "million/µL", minRef: 4.2, maxRef: 5.8, defaultValue: 4.9 },
      { id: "hematocrit", name: "Hematocrit (PCV)", unit: "%", minRef: 37.0, maxRef: 48.0, defaultValue: 41.5 },
      { id: "esr", name: "ESR (Westergren)", unit: "mm/1st hr", minRef: 0, maxRef: 20, defaultValue: 34 }, // Out of range high
    ],
  },
  {
    id: "TEST-LIPID",
    title: "Comprehensive Lipid Profile",
    category: "Biochemistry",
    biomarkers: [
      { id: "tot_chol", name: "Total Cholesterol", unit: "mg/dL", minRef: 120, maxRef: 200, defaultValue: 245 }, // High
      { id: "hdl", name: "HDL Cholesterol", unit: "mg/dL", minRef: 40, maxRef: 60, defaultValue: 34 }, // Low
      { id: "ldl", name: "LDL Cholesterol", unit: "mg/dL", minRef: 50, maxRef: 100, defaultValue: 158 }, // High
      { id: "trig", name: "Triglycerides", unit: "mg/dL", minRef: 50, maxRef: 150, defaultValue: 190 }, // High
    ],
  },
  {
    id: "TEST-THYROID",
    title: "Thyroid Profile (FT3, FT4, TSH)",
    category: "Endocrinology",
    biomarkers: [
      { id: "tsh", name: "TSH (Ultrasensitive)", unit: "µIU/mL", minRef: 0.4, maxRef: 4.2, defaultValue: 6.8 }, // High
      { id: "ft3", name: "Free T3 (FT3)", unit: "pg/mL", minRef: 2.0, maxRef: 4.4, defaultValue: 3.1 },
      { id: "ft4", name: "Free T4 (FT4)", unit: "ng/dL", minRef: 0.93, maxRef: 1.7, defaultValue: 1.15 },
    ],
  },
  {
    id: "TEST-LFT",
    title: "Liver Function Test (LFT)",
    category: "Biochemistry",
    biomarkers: [
      { id: "sgpt", name: "Serum ALT (SGPT)", unit: "U/L", minRef: 7, maxRef: 56, defaultValue: 68 }, // High
      { id: "sgot", name: "Serum AST (SGOT)", unit: "U/L", minRef: 10, maxRef: 40, defaultValue: 38 },
      { id: "bili", name: "Total Bilirubin", unit: "mg/dL", minRef: 0.2, maxRef: 1.2, defaultValue: 0.9 },
      { id: "alp", name: "Alkaline Phosphatase (ALP)", unit: "U/L", minRef: 44, maxRef: 147, defaultValue: 110 },
    ],
  },
  {
    id: "TEST-RFT",
    title: "Renal Function Test (RFT)",
    category: "Nephrology",
    biomarkers: [
      { id: "creat", name: "Serum Creatinine", unit: "mg/dL", minRef: 0.6, maxRef: 1.2, defaultValue: 1.6 }, // High
      { id: "bun", name: "Blood Urea Nitrogen (BUN)", unit: "mg/dL", minRef: 7, maxRef: 20, defaultValue: 24 }, // High
      { id: "uric", name: "Serum Uric Acid", unit: "mg/dL", minRef: 3.5, maxRef: 7.2, defaultValue: 6.1 },
    ],
  },
];

const MOCK_PATIENT_REQS = [
  {
    reqId: "REQ-2026-8801",
    patientName: "Tariqul Islam",
    patientId: "PT-9402",
    ageSex: "48 Yrs / Male",
    referringDoctor: "Dr. Mahmudul Hasan (Cardiology)",
    hospital: "BSMMU, Dhaka",
    date: "2026-10-06",
  },
  {
    reqId: "REQ-2026-8802",
    patientName: "Nusrat Jahan",
    patientId: "PT-7714",
    ageSex: "32 Yrs / Female",
    referringDoctor: "Prof. Dr. Farhana Rahman (Endocrinology)",
    hospital: "Popular Diagnostic Center",
    date: "2026-10-06",
  },
  {
    reqId: "REQ-2026-8803",
    patientName: "Sabbir Ahmed Khan",
    patientId: "PT-3390",
    ageSex: "61 Yrs / Male",
    referringDoctor: "Dr. Kazi Anowar Hossain (Nephrology)",
    hospital: "Dhaka Medical College Hospital",
    date: "2026-10-06",
  },
];

export default function UploadLabReportPage() {
  const [selectedReqId, setSelectedReqId] = useState<string>("REQ-2026-8801");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("TEST-CBC");

  // Biomarker values state: map of biomarker id -> numeric value
  const [biomarkerValues, setBiomarkerValues] = useState<Record<string, number>>(() => {
    const defaultTemplate = TEST_TEMPLATES[0]!;
    const initialValues: Record<string, number> = {};
    defaultTemplate.biomarkers.forEach((bm) => {
      initialValues[bm.id] = bm.defaultValue;
    });
    return initialValues;
  });

  // PDF Upload state
  const [attachedPdf, setAttachedPdf] = useState<{ name: string; size: string } | null>({
    name: "Popular_Central_Lab_Report_Signed.pdf",
    size: "2.4 MB",
  });
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [pathologistName, setPathologistName] = useState<string>("Dr. Niaz Ahmed, M.D. (Pathology)");

  // Submission / Digital Seal Modal
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    s3Url: string;
    sealHash: string;
    patientNotified: boolean;
    doctorNotified: boolean;
    outOfRangeCount: number;
  } | null>(null);

  // Active selected Template definition
  const currentTemplate = useMemo(() => {
    return TEST_TEMPLATES.find((t) => t.id === selectedTemplateId) || TEST_TEMPLATES[0]!;
  }, [selectedTemplateId]);

  // Selected Patient Details
  const currentPatient = useMemo(() => {
    return MOCK_PATIENT_REQS.find((p) => p.reqId === selectedReqId) || MOCK_PATIENT_REQS[0]!;
  }, [selectedReqId]);

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = TEST_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      const updated: Record<string, number> = {};
      tmpl.biomarkers.forEach((bm) => {
        updated[bm.id] = bm.defaultValue;
      });
      setBiomarkerValues(updated);
    }
  };

  // Biomarker value input handler
  const handleBiomarkerChange = (bmId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setBiomarkerValues((prev) => ({
      ...prev,
      [bmId]: num,
    }));
  };

  // File Drop Handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedPdf({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedPdf({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    }
  };

  // Calculate out of range biomarkers count
  const outOfRangeBiomarkers = useMemo(() => {
    return currentTemplate.biomarkers.filter((bm) => {
      const val = biomarkerValues[bm.id] ?? bm.defaultValue;
      return val < bm.minRef || val > bm.maxRef;
    });
  }, [currentTemplate, biomarkerValues]);

  // Submit Handler
  const handleSubmitReport = () => {
    if (!attachedPdf) {
      alert("Please attach officially signed PDF lab report before submitting.");
      return;
    }

    setIsSubmitting(true);

    // Simulate encrypted S3 upload and SHA-256 digital signature generation
    setTimeout(() => {
      const fakeHash = "SHA256-ED849A01" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const s3Url = `https://s3.ap-south-1.amazonaws.com/shebamitro-encrypted-reports/${currentPatient.reqId}.pdf`;

      setSubmissionResult({
        s3Url,
        sealHash: fakeHash,
        patientNotified: true,
        doctorNotified: true,
        outOfRangeCount: outOfRangeBiomarkers.length,
      });

      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <FileCheck className="h-4 w-4" /> Lab Report Upload & Digital Signing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Structured Biomarker Entry & <span className="text-emerald-500">PDF Seal</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter test parameters with automatic out-of-range flagging, upload signed PDFs to encrypted S3, and trigger multi-channel patient & doctor notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> ISO 15189 Verified Hub
          </div>
        </div>
      </div>

      {/* Main Grid: Requisition & Template Selector + Form + File Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requisition Selector & Template Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Patient Requisition Selection Card */}
          <div className="p-5 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-fg-app flex items-center gap-2 border-b border-card-border pb-2.5">
              <User className="h-4 w-4 text-primary-teal" /> 1. Select Patient Requisition
            </h3>

            <div className="space-y-2">
              {MOCK_PATIENT_REQS.map((p) => {
                const isSelected = p.reqId === selectedReqId;
                return (
                  <button
                    key={p.reqId}
                    type="button"
                    onClick={() => setSelectedReqId(p.reqId)}
                    className={`w-full text-left p-3 rounded-xl border transition-all space-y-1 ${
                      isSelected
                        ? "border-primary-teal bg-primary-teal/10 shadow-xs"
                        : "border-card-border bg-surface-card-hover/40 hover:border-card-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-fg-app">{p.reqId}</span>
                      <span className="text-[10px] text-muted-foreground">{p.date}</span>
                    </div>
                    <span className="font-bold text-xs text-fg-app block truncate">{p.patientName}</span>
                    <span className="text-[10px] text-muted-foreground block">
                      {p.ageSex} • {p.patientId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Template Selector Card */}
          <div className="p-5 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-fg-app flex items-center gap-2 border-b border-card-border pb-2.5">
              <Layers className="h-4 w-4 text-purple-500" /> 2. Ordered Test Template
            </h3>

            <div className="space-y-2">
              {TEST_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleTemplateChange(tmpl.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/10 shadow-xs text-fg-app font-bold"
                        : "border-card-border bg-surface-card-hover/40 hover:border-card-border/80 text-muted-foreground"
                    }`}
                  >
                    <div className="min-w-0 text-xs">
                      <span className="block font-bold text-fg-app truncate">{tmpl.title}</span>
                      <span className="text-[10px] text-purple-500 font-semibold">{tmpl.category}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {tmpl.biomarkers.length} Markers
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pathologist Digital Signature Info */}
          <div className="p-4 rounded-2xl border border-card-border bg-card space-y-2 shadow-xs text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Signing Pathologist:
            </span>
            <input
              type="text"
              value={pathologistName}
              onChange={(e) => setPathologistName(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app"
            />
            <span className="text-[10px] text-muted-foreground block">
              Digital signature stamp will be embedded into SHA-256 certificate.
            </span>
          </div>
        </div>

        {/* Right Column: Structured Biomarker Entry + Drag-Drop PDF Upload (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Biomarker Entry Table Card */}
          <div className="p-6 rounded-2xl border border-card-border bg-card space-y-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border pb-4">
              <div>
                <h3 className="font-bold text-base text-fg-app flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" /> Structured Biomarker Input Form
                </h3>
                <p className="text-xs text-muted-foreground">
                  Values outside normal reference bounds will be automatically highlighted in red.
                </p>
              </div>

              {outOfRangeBiomarkers.length > 0 ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="h-3.5 w-3.5" /> {outOfRangeBiomarkers.length} Out-of-Range Value(s)
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> All Values Normal
                </span>
              )}
            </div>

            {/* Biomarker Form Controls Table */}
            <div className="space-y-3">
              {currentTemplate.biomarkers.map((bm) => {
                const val = biomarkerValues[bm.id] ?? bm.defaultValue;
                const isLow = val < bm.minRef;
                const isHigh = val > bm.maxRef;
                const isOutOfRange = isLow || isHigh;

                return (
                  <div
                    key={bm.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isOutOfRange
                        ? "border-rose-500/50 bg-rose-500/10 dark:bg-rose-500/10 shadow-xs"
                        : "border-card-border bg-surface-card-hover/40"
                    }`}
                  >
                    {/* Biomarker Title & Ref Range */}
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-fg-app block">{bm.name}</span>
                      <span className="text-[10px] text-muted-foreground block font-mono">
                        Ref Bounds: {bm.minRef} - {bm.maxRef} {bm.unit}
                      </span>
                    </div>

                    {/* Numeric Input & Status Badge */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          value={val}
                          onChange={(e) => handleBiomarkerChange(bm.id, e.target.value)}
                          className={`w-28 h-9 px-3 rounded-lg text-right font-mono font-extrabold text-xs focus:outline-none transition-colors border ${
                            isOutOfRange
                              ? "bg-rose-500/20 text-rose-500 border-rose-500 font-extrabold ring-2 ring-rose-500/30"
                              : "bg-card text-fg-app border-card-border focus:border-primary-teal"
                          }`}
                        />
                        <span className="text-[10px] font-semibold text-muted-foreground ml-1.5">
                          {bm.unit}
                        </span>
                      </div>

                      {/* Red Highlight Status Badge */}
                      {isOutOfRange ? (
                        <span className="px-2.5 py-1 rounded-md bg-rose-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-xs flex items-center gap-1 shrink-0">
                          <AlertTriangle className="h-3 w-3" /> {isHigh ? "HIGH" : "LOW"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-[10px] uppercase shrink-0">
                          NORMAL
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drag-and-Drop Zone for Official Signed PDF Report */}
          <div className="p-6 rounded-2xl border border-card-border bg-card space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-fg-app flex items-center gap-2 border-b border-card-border pb-3">
              <Upload className="h-5 w-5 text-purple-500" /> Officially Signed PDF Attachment
            </h3>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all relative cursor-pointer ${
                isDragOver
                  ? "border-primary-teal bg-primary-teal/10 scale-[1.01]"
                  : "border-card-border bg-surface-card-hover/40 hover:border-primary-teal/50"
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto shadow-xs">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <span className="font-bold text-xs text-fg-app block">
                  Click to Browse or Drag & Drop Signed Lab Report PDF
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Encrypted S3 Upload • Maximum file size 25MB • PDF Only
                </span>
              </div>
            </div>

            {/* Attached PDF Preview File Strip */}
            {attachedPdf && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-fg-app block truncate">{attachedPdf.name}</span>
                    <span className="text-[10px] text-emerald-500 font-semibold block">
                      Ready for S3 Upload ({attachedPdf.size})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setAttachedPdf(null)}
                  className="p-1 rounded-lg bg-card text-muted-foreground hover:text-rose-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Final Submission Button */}
            <Button
              variant="primary"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
              className="w-full h-12 text-sm font-extrabold shadow-lg glow-teal justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Uploading to Encrypted S3 & Signing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Upload to Encrypted S3, Seal & Notify Patient & Doctor
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── MODAL: DIGITAL SIGNATURE CERTIFICATE & NOTIFICATION LOG ──────────────── */}
      <AnimatePresence>
        {submissionResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSubmissionResult(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-fg-app">Report Published & Sealed</h3>
                    <p className="text-xs text-muted-foreground">
                      Digital Signature & Encrypted S3 Upload Confirmed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSubmissionResult(null)}
                  className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Digital Certificate Badge */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                    SHA-256 DIGITAL SEAL CERTIFICATE
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">ISO 15189</span>
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  <p className="text-fg-app font-bold">
                    Hash: <span className="text-emerald-600 dark:text-emerald-400">{submissionResult.sealHash}</span>
                  </p>
                  <p className="text-muted-foreground truncate">
                    Storage: <span className="text-fg-app">{submissionResult.s3Url}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Signatory: <span className="text-fg-app">{pathologistName}</span>
                  </p>
                </div>
              </div>

              {/* Notification Dispatch Log */}
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-card-border">
                <span className="text-[11px] text-muted-foreground">
                  {submissionResult.outOfRangeCount > 0
                    ? `⚠️ ${submissionResult.outOfRangeCount} out-of-range flag(s) included`
                    : "✓ All biomarkers normal"}
                </span>

                <Button variant="primary" size="sm" onClick={() => setSubmissionResult(null)}>
                  Close & Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
