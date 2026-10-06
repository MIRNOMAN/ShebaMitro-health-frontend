"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Search,
  Filter,
  Printer,
  FileText,
  CheckCircle2,
  Clock,
  User,
  Stethoscope,
  Tag,
  LayoutGrid,
  List,
  AlertTriangle,
  Check,
  X,
  Sparkles,
  QrCode,
  Calendar,
  Building2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Eye,
  RefreshCw,
  Copy,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types & Definitions ────────────────────────────────────────────────────────
export type RequisitionStatus =
  | "New Order"
  | "Sample Collection Scheduled"
  | "Processing in Lab"
  | "Report Ready";

export type PriorityLevel = "Routine" | "Urgent" | "STAT";

export interface TestRequisition {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientId: string;
  referringDoctor: string;
  doctorSpecialty: string;
  doctorHospital: string;
  testName: string;
  testCategory: string;
  specimenType: string;
  status: RequisitionStatus;
  priority: PriorityLevel;
  requestedAt: string;
  barcode: string;
  rackLocation: string;
  clinicalNotes: {
    diagnosis: string;
    symptoms: string[];
    specialInstructions: string;
    fastingRequired: boolean;
    fastingDuration?: string;
    allergies?: string[];
  };
}

// ── Initial Mock Data ──────────────────────────────────────────────────────────
const INITIAL_REQUISITIONS: TestRequisition[] = [
  {
    id: "REQ-2026-8801",
    patientName: "Tariqul Islam",
    patientAge: 48,
    patientGender: "Male",
    patientId: "PT-9402",
    referringDoctor: "Dr. Mahmudul Hasan",
    doctorSpecialty: "Cardiology Specialist",
    doctorHospital: "BSMMU, Dhaka",
    testName: "Comprehensive Lipid Profile & HbA1c",
    testCategory: "Biochemistry",
    specimenType: "Venous Blood (EDTA + Serum)",
    status: "New Order",
    priority: "Urgent",
    requestedAt: "2026-10-06 08:30 AM",
    barcode: "LAB-8801-EDTA",
    rackLocation: "Rack A-04",
    clinicalNotes: {
      diagnosis: "Suspected Hyperlipidemia & Type-2 Diabetes Mellitus",
      symptoms: ["Occasional chest discomfort", "Fatigue", "Polydipsia"],
      specialInstructions: "Must draw fasting blood sample. Avoid hemolysis.",
      fastingRequired: true,
      fastingDuration: "12 Hours Overnight Fasting",
      allergies: ["Penicillin"],
    },
  },
  {
    id: "REQ-2026-8802",
    patientName: "Nusrat Jahan",
    patientAge: 32,
    patientGender: "Female",
    patientId: "PT-7714",
    referringDoctor: "Prof. Dr. Farhana Rahman",
    doctorSpecialty: "Endocrinology",
    doctorHospital: "Popular Diagnostic Center",
    testName: "Thyroid Panel (FT3, FT4, TSH)",
    testCategory: "Endocrinology",
    specimenType: "Clot Activator (Serum)",
    status: "New Order",
    priority: "Routine",
    requestedAt: "2026-10-06 09:15 AM",
    barcode: "LAB-8802-SERUM",
    rackLocation: "Rack B-12",
    clinicalNotes: {
      diagnosis: "Hypothyroidism Monitoring & Dosage Revision",
      symptoms: ["Weight gain", "Cold intolerance", "Lethargy"],
      specialInstructions: "Take morning blood sample prior to Levothyroxine dosage.",
      fastingRequired: false,
    },
  },
  {
    id: "REQ-2026-8803",
    patientName: "Sabbir Ahmed Khan",
    patientAge: 61,
    patientGender: "Male",
    patientId: "PT-3390",
    referringDoctor: "Dr. Kazi Anowar Hossain",
    doctorSpecialty: "Nephrology",
    doctorHospital: "Dhaka Medical College Hospital",
    testName: "Renal Function Test (Serum Creatinine, Urea, Electrolytes)",
    testCategory: "Nephrology",
    specimenType: "Serum + Spot Urine",
    status: "Sample Collection Scheduled",
    priority: "STAT",
    requestedAt: "2026-10-06 07:45 AM",
    barcode: "LAB-8803-STAT",
    rackLocation: "STAT Rack #1",
    clinicalNotes: {
      diagnosis: "Acute Kidney Injury Evaluation / CKD Stage 3",
      symptoms: ["Bilateral leg edema", "Elevated blood pressure", "Decreased urine output"],
      specialInstructions: "STAT processing requested. Immediate phone notification required if K+ > 5.5 mEq/L.",
      fastingRequired: true,
      fastingDuration: "8 Hours",
      allergies: ["Sulfa drugs"],
    },
  },
  {
    id: "REQ-2026-8804",
    patientName: "Meherun Nesa",
    patientAge: 55,
    patientGender: "Female",
    patientId: "PT-5521",
    referringDoctor: "Dr. Mahmudul Hasan",
    doctorSpecialty: "Cardiology Specialist",
    doctorHospital: "BSMMU, Dhaka",
    testName: "High-Sensitivity Cardiac Troponin I (hs-cTnI)",
    testCategory: "Immunology",
    specimenType: "Heparinized Plasma",
    status: "Sample Collection Scheduled",
    priority: "STAT",
    requestedAt: "2026-10-06 09:40 AM",
    barcode: "LAB-8804-TROP",
    rackLocation: "STAT Rack #2",
    clinicalNotes: {
      diagnosis: "Rule out Acute Myocardial Infarction (AMI)",
      symptoms: ["Substernal chest pain radiating to left arm", "Diaphoresis"],
      specialInstructions: "Process within 15 minutes of sample arrival.",
      fastingRequired: false,
    },
  },
  {
    id: "REQ-2026-8805",
    patientName: "Kamrul Hasan",
    patientAge: 29,
    patientGender: "Male",
    patientId: "PT-1048",
    referringDoctor: "Dr. Syeda Rashida Begum",
    doctorSpecialty: "Hematology",
    doctorHospital: "Square Hospital",
    testName: "Complete Blood Count (CBC) with Peripheral Blood Film",
    testCategory: "Hematology",
    specimenType: "K2 EDTA Whole Blood",
    status: "Processing in Lab",
    priority: "Routine",
    requestedAt: "2026-10-06 08:00 AM",
    barcode: "LAB-8805-CBC",
    rackLocation: "Rack C-02",
    clinicalNotes: {
      diagnosis: "Fever of Unknown Origin (FUO) / Dengue Screening",
      symptoms: ["High grade fever (103°F)", "Retro-orbital pain", "Thrombocytopenia evaluation"],
      specialInstructions: "Manual differential count and platelet morphology estimation required.",
      fastingRequired: false,
    },
  },
  {
    id: "REQ-2026-8806",
    patientName: "Afroza Parveen",
    patientAge: 44,
    patientGender: "Female",
    patientId: "PT-8234",
    referringDoctor: "Prof. Dr. Farhana Rahman",
    doctorSpecialty: "Endocrinology",
    doctorHospital: "Popular Diagnostic Center",
    testName: "Liver Function Test (LFT: ALT, AST, Bilirubin, ALP)",
    testCategory: "Biochemistry",
    specimenType: "Serum",
    status: "Processing in Lab",
    priority: "Urgent",
    requestedAt: "2026-10-06 08:50 AM",
    barcode: "LAB-8806-LFT",
    rackLocation: "Rack C-09",
    clinicalNotes: {
      diagnosis: "Non-Alcoholic Fatty Liver Disease (NAFLD) Workup",
      symptoms: ["Right upper quadrant fullness", "Mild jaundice suspicion"],
      specialInstructions: "Check for lipemic sample. Centrifuge at 3500 rpm for 10 min.",
      fastingRequired: true,
      fastingDuration: "10 Hours",
    },
  },
  {
    id: "REQ-2026-8807",
    patientName: "Rafiqul Islam Chowdhury",
    patientAge: 67,
    patientGender: "Male",
    patientId: "PT-6619",
    referringDoctor: "Dr. Kazi Anowar Hossain",
    doctorSpecialty: "Nephrology",
    doctorHospital: "Dhaka Medical College Hospital",
    testName: "Serum Electrolytes (Na+, K+, Cl-, HCO3-)",
    testCategory: "Biochemistry",
    specimenType: "Lithium Heparin Blood",
    status: "Report Ready",
    priority: "Urgent",
    requestedAt: "2026-10-06 06:30 AM",
    barcode: "LAB-8807-ELEC",
    rackLocation: "Archive R-01",
    clinicalNotes: {
      diagnosis: "Electrolyte Imbalance Management in Diuretic Therapy",
      symptoms: ["Muscle weakness", "Irregular heart beat"],
      specialInstructions: "Report verified by Pathologist Dr. Niaz.",
      fastingRequired: false,
    },
  },
  {
    id: "REQ-2026-8808",
    patientName: "Sharmin Sultana",
    patientAge: 38,
    patientGender: "Female",
    patientId: "PT-2901",
    referringDoctor: "Dr. Syeda Rashida Begum",
    doctorSpecialty: "Hematology",
    doctorHospital: "Square Hospital",
    testName: "Serum Iron, TIBC & Ferritin Profile",
    testCategory: "Hematology",
    specimenType: "Serum",
    status: "Report Ready",
    priority: "Routine",
    requestedAt: "2026-10-06 07:10 AM",
    barcode: "LAB-8808-IRON",
    rackLocation: "Archive R-02",
    clinicalNotes: {
      diagnosis: "Microcytic Hypochromic Anemia Evaluation",
      symptoms: ["Pallor", "Fatigue", "Brittle nails"],
      specialInstructions: "Report finalized and signed.",
      fastingRequired: true,
      fastingDuration: "8 Hours",
    },
  },
];

const COLUMNS: { status: RequisitionStatus; label: string; color: string; bg: string; border: string; icon: React.ElementType }[] = [
  {
    status: "New Order",
    label: "New Order",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Sparkles,
  },
  {
    status: "Sample Collection Scheduled",
    label: "Sample Collection Scheduled",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Calendar,
  },
  {
    status: "Processing in Lab",
    label: "Processing in Lab",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: FlaskConical,
  },
  {
    status: "Report Ready",
    label: "Report Ready",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
];

export default function LabRequisitionsPage() {
  const [requisitions, setRequisitions] = useState<TestRequisition[]>(INITIAL_REQUISITIONS);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("ALL");
  const [selectedTest, setSelectedTest] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");

  // Active Modals
  const [barcodeModalItem, setBarcodeModalItem] = useState<TestRequisition | null>(null);
  const [clinicalNotesModalItem, setClinicalNotesModalItem] = useState<TestRequisition | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Distinct Doctor & Test lists for filters
  const doctorOptions = useMemo(() => {
    const docs = Array.from(new Set(requisitions.map((r) => r.referringDoctor)));
    return docs.sort();
  }, [requisitions]);

  const testOptions = useMemo(() => {
    const tests = Array.from(new Set(requisitions.map((r) => r.testName)));
    return tests.sort();
  }, [requisitions]);

  // Filtered Requisitions
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((req) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        req.patientName.toLowerCase().includes(q) ||
        req.patientId.toLowerCase().includes(q) ||
        req.referringDoctor.toLowerCase().includes(q) ||
        req.testName.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q);

      // Doctor filter
      const matchDoctor = selectedDoctor === "ALL" || req.referringDoctor === selectedDoctor;

      // Test filter
      const matchTest = selectedTest === "ALL" || req.testName === selectedTest;

      // Priority filter
      const matchPriority = selectedPriority === "ALL" || req.priority === selectedPriority;

      return matchSearch && matchDoctor && matchTest && matchPriority;
    });
  }, [requisitions, searchQuery, selectedDoctor, selectedTest, selectedPriority]);

  // Action: Accept / Advance Requisition Status
  const handleAdvanceStatus = (id: string, currentStatus: RequisitionStatus) => {
    let nextStatus: RequisitionStatus;
    if (currentStatus === "New Order") {
      nextStatus = "Sample Collection Scheduled";
    } else if (currentStatus === "Sample Collection Scheduled") {
      nextStatus = "Processing in Lab";
    } else if (currentStatus === "Processing in Lab") {
      nextStatus = "Report Ready";
    } else {
      triggerToast(`Report for requisition ${id} is already finalized.`);
      return;
    }

    setRequisitions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    triggerToast(`Order ${id} status updated to "${nextStatus}".`);
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDoctor("ALL");
    setSelectedTest("ALL");
    setSelectedPriority("ALL");
  };

  const isFiltered = searchQuery !== "" || selectedDoctor !== "ALL" || selectedTest !== "ALL" || selectedPriority !== "ALL";

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Banner */}
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

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/15 via-purple-500/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
              <FlaskConical className="h-4 w-4" /> ShebaMitro Diagnostic LIMS Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Incoming Test <span className="text-primary-teal">Requisitions</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage laboratory test workflow from order intake, sample barcoding, processing to PDF report release.
          </p>
        </div>

        {/* Top Controls: Stats & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle Button */}
          <div className="flex items-center p-1 rounded-xl bg-muted border border-card-border">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "kanban"
                  ? "bg-card text-primary-teal shadow-xs border border-card-border"
                  : "text-muted-foreground hover:text-fg-app"
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Kanban View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-card text-primary-teal shadow-xs border border-card-border"
                  : "text-muted-foreground hover:text-fg-app"
              }`}
            >
              <List className="h-4 w-4" /> Table View
            </button>
          </div>
        </div>
      </div>

      {/* Stat Summaries */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {COLUMNS.map((col) => {
          const count = requisitions.filter((r) => r.status === col.status).length;
          const ColumnIcon = col.icon;
          return (
            <div
              key={col.status}
              className="p-4 rounded-2xl border border-card-border bg-card shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground block truncate">
                  {col.label}
                </span>
                <span className="text-2xl font-extrabold text-fg-app">{count}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${col.bg} ${col.color} border ${col.border}`}>
                <ColumnIcon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Patient Name, ID, Doctor, or Test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-fg-app"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Doctor Filter Select */}
          <div className="lg:col-span-3">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
            >
              <option value="ALL">All Referring Doctors</option>
              {doctorOptions.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Test Name Filter Select */}
          <div className="lg:col-span-3">
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
            >
              <option value="ALL">All Test Names</option>
              {testOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
              <option value="STAT">STAT (Emergency)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Reset */}
        {isFiltered && (
          <div className="flex items-center justify-between pt-2 border-t border-card-border/60 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">Active Filters:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-primary-teal/10 text-primary-teal text-[11px] font-semibold border border-primary-teal/20">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedDoctor !== "ALL" && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-[11px] font-semibold border border-purple-500/20">
                  Doctor: {selectedDoctor}
                </span>
              )}
              {selectedTest !== "ALL" && (
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[11px] font-semibold border border-blue-500/20">
                  Test: {selectedTest}
                </span>
              )}
              {selectedPriority !== "ALL" && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[11px] font-semibold border border-amber-500/20">
                  Priority: {selectedPriority}
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ── KANBAN VIEW ────────────────────────────────────────────────────────── */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {COLUMNS.map((col) => {
            const columnRequisitions = filteredRequisitions.filter((r) => r.status === col.status);
            const ColumnIcon = col.icon;

            return (
              <div
                key={col.status}
                className="flex flex-col rounded-2xl border border-card-border bg-card/60 p-4 min-h-[500px] shadow-xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-card-border">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${col.bg} ${col.color}`}>
                      <ColumnIcon className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-fg-app truncate">
                      {col.label}
                    </h3>
                  </div>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${col.bg} ${col.color} border ${col.border}`}>
                    {columnRequisitions.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[700px] pr-1">
                  {columnRequisitions.length === 0 ? (
                    <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-card-border/60 rounded-xl text-muted-foreground space-y-1">
                      <FlaskConical className="h-6 w-6 text-muted-foreground/40" />
                      <span className="text-xs font-medium">No requisitions</span>
                    </div>
                  ) : (
                    columnRequisitions.map((req) => (
                      <motion.div
                        key={req.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="group p-4 rounded-xl border border-card-border bg-card hover:border-primary-teal/40 hover:shadow-md transition-all space-y-3 relative"
                      >
                        {/* Top Info Bar */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-muted-foreground">
                            {req.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] tracking-wide border ${
                              req.priority === "STAT"
                                ? "bg-rose-500/15 text-rose-500 border-rose-500/30 animate-pulse"
                                : req.priority === "Urgent"
                                ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                                : "bg-muted/60 text-muted-foreground border-card-border"
                            }`}
                          >
                            {req.priority}
                          </span>
                        </div>

                        {/* Patient Name & Details */}
                        <div>
                          <h4 className="font-bold text-sm text-fg-app group-hover:text-primary-teal transition-colors flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-primary-teal shrink-0" />
                            <span className="truncate">{req.patientName}</span>
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            {req.patientAge} Yrs, {req.patientGender} • ID:{" "}
                            <span className="font-semibold text-fg-app">{req.patientId}</span>
                          </p>
                        </div>

                        {/* Test Name & Specimen */}
                        <div className="p-2.5 rounded-lg bg-surface-card-hover/60 border border-card-border/80 space-y-1 text-xs">
                          <p className="font-semibold text-fg-app line-clamp-2">
                            {req.testName}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                            <span className="px-1.5 py-0.5 rounded bg-card border border-card-border font-medium">
                              {req.specimenType}
                            </span>
                            <span className="font-mono text-primary-teal">{req.rackLocation}</span>
                          </div>
                        </div>

                        {/* Referring Doctor */}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Stethoscope className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                          <span className="truncate font-medium">{req.referringDoctor}</span>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-2 border-t border-card-border flex items-center justify-between gap-1.5">
                          {/* Left Quick Action Buttons */}
                          <div className="flex items-center gap-1">
                            {/* Barcode Button */}
                            <button
                              onClick={() => setBarcodeModalItem(req)}
                              title="Print Sample Barcode"
                              className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-primary-teal/15 hover:text-primary-teal hover:border-primary-teal/30 transition-colors text-muted-foreground"
                            >
                              <Printer className="h-3.5 w-3.5" />
                            </button>

                            {/* Clinical Notes Button */}
                            <button
                              onClick={() => setClinicalNotesModalItem(req)}
                              title="View Patient Clinical Notes"
                              className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-purple-500/15 hover:text-purple-500 hover:border-purple-500/30 transition-colors text-muted-foreground"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Primary Stage Transition Action */}
                          {req.status === "New Order" && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleAdvanceStatus(req.id, req.status)}
                              className="h-7 text-[11px] px-2.5 font-bold shadow-xs"
                            >
                              Accept Order <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}

                          {req.status === "Sample Collection Scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAdvanceStatus(req.id, req.status)}
                              className="h-7 text-[11px] px-2.5 font-bold text-purple-500 border-purple-500/40 hover:bg-purple-500/10"
                            >
                              Start Processing <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}

                          {req.status === "Processing in Lab" && (
                            <Button
                              size="sm"
                              variant="emerald"
                              onClick={() => handleAdvanceStatus(req.id, req.status)}
                              className="h-7 text-[11px] px-2.5 font-bold shadow-xs"
                            >
                              Mark Ready <Check className="h-3 w-3 ml-1" />
                            </Button>
                          )}

                          {req.status === "Report Ready" && (
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Finalized
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ────────────────────────────────────────────────────────── */}
      {viewMode === "table" && (
        <div className="rounded-2xl border border-card-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-surface-card-hover/60 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Requisition ID</th>
                  <th className="p-4">Patient Info</th>
                  <th className="p-4">Test Name</th>
                  <th className="p-4">Referring Doctor</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status Workflow</th>
                  <th className="p-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-xs">
                {filteredRequisitions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No matching test requisitions found.
                    </td>
                  </tr>
                ) : (
                  filteredRequisitions.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-surface-card-hover/40 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-fg-app whitespace-nowrap">
                        {req.id}
                        <span className="block text-[10px] font-normal text-muted-foreground">
                          {req.requestedAt}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-fg-app block">{req.patientName}</span>
                        <span className="text-[11px] text-muted-foreground block">
                          {req.patientAge} Yrs, {req.patientGender} • ID: {req.patientId}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <span className="font-semibold text-fg-app block truncate">
                          {req.testName}
                        </span>
                        <span className="text-[10px] text-primary-teal font-medium">
                          {req.specimenType} ({req.rackLocation})
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-fg-app block truncate">
                          {req.referringDoctor}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {req.doctorHospital}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] border ${
                            req.priority === "STAT"
                              ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                              : req.priority === "Urgent"
                              ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                              : "bg-muted/60 text-muted-foreground border-card-border"
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[11px] border inline-flex items-center gap-1.5 ${
                            req.status === "New Order"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                              : req.status === "Sample Collection Scheduled"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                              : req.status === "Processing in Lab"
                              ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {req.status}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setBarcodeModalItem(req)}
                            title="Print Barcode Label"
                            className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-primary-teal/15 hover:text-primary-teal transition-colors"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setClinicalNotesModalItem(req)}
                            title="View Clinical Notes"
                            className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-purple-500/15 hover:text-purple-500 transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                          </button>

                          {req.status === "New Order" && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleAdvanceStatus(req.id, req.status)}
                              className="h-8 text-xs font-bold"
                            >
                              Accept Order
                            </Button>
                          )}

                          {req.status === "Sample Collection Scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAdvanceStatus(req.id, req.status)}
                              className="h-8 text-xs font-bold text-purple-500 border-purple-500/40"
                            >
                              Start Processing
                            </Button>
                          )}

                          {req.status === "Processing in Lab" && (
                            <Button
                              size="sm"
                              variant="emerald"
                              onClick={() => handleAdvanceStatus(req.id, req.status)}
                              className="h-8 text-xs font-bold"
                            >
                              Mark Ready
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL 1: BARCODE PRINT LABEL ────────────────────────────────────────── */}
      <AnimatePresence>
        {barcodeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBarcodeModalItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary-teal/15 text-primary-teal">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-fg-app">Sample Barcode Label</h3>
                    <p className="text-xs text-muted-foreground">Thermal Vial Print Preview</p>
                  </div>
                </div>
                <button
                  onClick={() => setBarcodeModalItem(null)}
                  className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Barcode Physical Label Sticker Simulation */}
              <div className="p-4 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white text-black space-y-3 font-mono shadow-inner">
                <div className="flex justify-between items-start border-b border-gray-300 pb-2 text-[10px]">
                  <div>
                    <span className="font-bold block uppercase tracking-wider text-xs">SHEBAMITRO LABS</span>
                    <span>ISO 15189 CERTIFIED</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block">{barcodeModalItem.rackLocation}</span>
                    <span>{barcodeModalItem.priority}</span>
                  </div>
                </div>

                {/* Patient & Test Info */}
                <div className="text-xs space-y-0.5 font-sans">
                  <p className="font-bold text-sm leading-tight text-gray-900">
                    {barcodeModalItem.patientName} ({barcodeModalItem.patientAge}Y / {barcodeModalItem.patientGender.charAt(0)})
                  </p>
                  <p className="text-[11px] text-gray-700 font-semibold">
                    MRN: {barcodeModalItem.patientId} • Req: {barcodeModalItem.id}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-bold">
                    SPECIMEN: {barcodeModalItem.specimenType}
                  </p>
                </div>

                {/* Simulated Barcode Graphics */}
                <div className="pt-2 text-center space-y-1">
                  <div className="h-14 w-full flex items-center justify-center gap-0.5 bg-white px-2 py-1 overflow-hidden">
                    {/* Visual Barcode SVG mockup */}
                    {[
                      3, 1, 4, 1, 2, 5, 1, 3, 2, 1, 4, 2, 1, 3, 1, 5, 2, 1, 3, 4, 1, 2, 1, 3, 2, 4, 1,
                      3, 2, 1, 4, 1, 2,
                    ].map((w, idx) => (
                      <div
                        key={idx}
                        className="h-full bg-black shrink-0"
                        style={{ width: `${w * 2}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-900 block tracking-widest">
                    *{barcodeModalItem.barcode}*
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 rounded-xl bg-surface-card-hover border border-card-border text-xs text-muted-foreground space-y-1">
                <span className="font-semibold text-fg-app block">Labeling Guidelines:</span>
                <p className="text-[11px]">
                  Affix barcode label vertically along the specimen collection vial tube before drawing blood sample.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setBarcodeModalItem(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    triggerToast(`Barcode label printed for ${barcodeModalItem.patientName} (${barcodeModalItem.barcode})`);
                    setBarcodeModalItem(null);
                  }}
                  className="font-bold"
                >
                  <Printer className="h-4 w-4 mr-1.5" /> Print Barcode Label
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: CLINICAL NOTES & PATIENT DETAILS ──────────────────────────── */}
      <AnimatePresence>
        {clinicalNotesModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setClinicalNotesModalItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl rounded-2xl border border-card-border bg-card p-6 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-fg-app">Patient Clinical Notes</h3>
                    <p className="text-xs text-muted-foreground">
                      Requisition #{clinicalNotesModalItem.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setClinicalNotesModalItem(null)}
                  className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Patient Banner */}
              <div className="p-4 rounded-xl bg-surface-card-hover border border-card-border space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base text-fg-app">
                      {clinicalNotesModalItem.patientName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {clinicalNotesModalItem.patientAge} Years • {clinicalNotesModalItem.patientGender} • Patient ID:{" "}
                      <span className="font-bold text-primary-teal">{clinicalNotesModalItem.patientId}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/30 text-xs font-bold">
                    {clinicalNotesModalItem.testCategory}
                  </span>
                </div>
              </div>

              {/* Referring Doctor Info */}
              <div className="p-3.5 rounded-xl border border-card-border bg-card space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Referring Physician Details
                </span>
                <p className="font-bold text-fg-app flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-purple-500" />
                  {clinicalNotesModalItem.referringDoctor}
                </p>
                <p className="text-muted-foreground pl-5">
                  {clinicalNotesModalItem.doctorSpecialty} • {clinicalNotesModalItem.doctorHospital}
                </p>
              </div>

              {/* Clinical Assessment & Diagnosis */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5">
                  <span className="font-bold text-amber-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" /> Working Clinical Diagnosis
                  </span>
                  <p className="font-semibold text-fg-app">
                    {clinicalNotesModalItem.clinicalNotes.diagnosis}
                  </p>
                </div>

                {/* Reported Symptoms */}
                {clinicalNotesModalItem.clinicalNotes.symptoms.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-muted-foreground text-[11px]">
                      Presenting Symptoms:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {clinicalNotesModalItem.clinicalNotes.symptoms.map((symptom, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-muted border border-card-border text-xs font-medium text-fg-app"
                        >
                          • {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fasting & Special Prep */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-card-border bg-card space-y-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                      Fasting Status
                    </span>
                    <p className="font-bold text-fg-app">
                      {clinicalNotesModalItem.clinicalNotes.fastingRequired
                        ? `Required (${clinicalNotesModalItem.clinicalNotes.fastingDuration || "Overnight"})`
                        : "No Fasting Required"}
                    </p>
                  </div>

                  {clinicalNotesModalItem.clinicalNotes.allergies && (
                    <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-rose-500">
                        Known Patient Allergies
                      </span>
                      <p className="font-bold text-rose-500">
                        {clinicalNotesModalItem.clinicalNotes.allergies.join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Phlebotomy / Lab Tech Instructions */}
                <div className="p-3.5 rounded-xl border border-card-border bg-surface-card-hover space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Phlebotomy & Lab Handling Instructions
                  </span>
                  <p className="text-fg-app font-medium leading-relaxed">
                    {clinicalNotesModalItem.clinicalNotes.specialInstructions}
                  </p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between border-t border-card-border pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBarcodeModalItem(clinicalNotesModalItem);
                    setClinicalNotesModalItem(null);
                  }}
                  className="text-xs font-semibold"
                >
                  <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Barcode Label
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setClinicalNotesModalItem(null)}
                >
                  Done Reading
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
