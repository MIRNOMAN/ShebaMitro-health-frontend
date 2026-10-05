"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Stethoscope,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  Sparkles,
  Printer,
  Download,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Heart,
  Pill,
  Clock,
  ChevronRight,
  Info,
  X,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PrescribedDrug {
  id: string;
  brandName: string;
  genericName: string;
  dosageForm: string; // e.g., "Tablet", "Capsule", "Syrup"
  strength: string; // e.g., "20mg"
  pattern: string; // e.g., "1+0+1"
  durationDays: number;
  timing: "Before Meal" | "After Meal" | "With Meal";
  instructions?: string;
}

// Popular Bangladeshi & Generic Medications Database
const MEDICINE_DATABASE = [
  { brandName: "Seclo 20", genericName: "Omeprazole", dosageForm: "Capsule", strength: "20mg" },
  { brandName: "Sergel 20", genericName: "Esomeprazole", dosageForm: "Capsule", strength: "20mg" },
  { brandName: "Napa Extra", genericName: "Paracetamol + Caffeine", dosageForm: "Tablet", strength: "500mg+65mg" },
  { brandName: "Ace 500", genericName: "Paracetamol", dosageForm: "Tablet", strength: "500mg" },
  { brandName: "Ecosprin 75", genericName: "Aspirin", dosageForm: "Tablet", strength: "75mg" },
  { brandName: "Clopilet 75", genericName: "Clopidogrel", dosageForm: "Tablet", strength: "75mg" },
  { brandName: "Rosuva 10", genericName: "Rosuvastatin", dosageForm: "Tablet", strength: "10mg" },
  { brandName: "Bizoran 5/20", genericName: "Amlodipine + Olmesartan", dosageForm: "Tablet", strength: "5mg/20mg" },
  { brandName: "Bislol 2.5", genericName: "Bisoprolol", dosageForm: "Tablet", strength: "2.5mg" },
  { brandName: "Metfo 500", genericName: "Metformin HCl", dosageForm: "Tablet", strength: "500mg" },
  { brandName: "Azithcin 500", genericName: "Azithromycin", dosageForm: "Tablet", strength: "500mg" },
  { brandName: "Ciprocin 500", genericName: "Ciprofloxacin", dosageForm: "Tablet", strength: "500mg" },
  { brandName: "Fenofex 120", genericName: "Fexofenadine", dosageForm: "Tablet", strength: "120mg" },
  { brandName: "Monas 10", genericName: "Montelukast", dosageForm: "Tablet", strength: "10mg" },
];

const DOSAGE_PATTERNS = ["1+0+1", "1+0+0", "0+0+1", "1+1+1", "0+1+0", "1+1+1+1", "As Needed (PRN)"];

// Pre-defined Drug-Drug Interactions Matrix for Safety Checks
const KNOWN_INTERACTIONS: Record<string, { partnerGeneric: string; severity: "high" | "moderate"; message: string }> = {
  Aspirin: {
    partnerGeneric: "Clopidogrel",
    severity: "high",
    message: "High risk of gastrointestinal bleeding when combining Aspirin and Clopidogrel without a PPI barrier.",
  },
  Clopidogrel: {
    partnerGeneric: "Omeprazole",
    severity: "moderate",
    message: "Omeprazole reduces the antiplatelet conversion efficacy of Clopidogrel. Consider Pantoprazole instead.",
  },
  Omeprazole: {
    partnerGeneric: "Clopidogrel",
    severity: "moderate",
    message: "Omeprazole inhibits CYP2C19, decreasing active Clopidogrel metabolite formation.",
  },
  Ciprofloxacin: {
    partnerGeneric: "Bisoprolol",
    severity: "moderate",
    message: "Potential QTc prolongation risk when combining Ciprofloxacin with beta blockers.",
  },
};

export default function NewPrescriptionPage() {
  // Patient Clinical Demographics State
  const [patientInfo, setPatientInfo] = useState({
    name: "Sabbir Ahmed",
    age: 42,
    gender: "Male",
    appointmentId: "APT-8821",
    date: new Date().toISOString().split("T")[0],
  });

  // Left Column Clinical Findings State
  const [chiefComplaints, setChiefComplaints] = useState("Chest tightness after exertion for 3 days, intermittent shortness of breath.");
  const [clinicalFindings, setClinicalFindings] = useState("S1, S2 audible. No murmurs. Bilateral lung fields clear. Mild peripheral pedal edema.");
  const [vitals, setVitals] = useState({
    bp: "135/88",
    pulse: "78",
    weight: "74",
    temp: "98.4",
  });
  const [labInvestigations, setLabInvestigations] = useState("ECG 12-Lead, Lipid Profile, Serum Creatinine, Fasting Blood Sugar");
  const [doctorAdvice, setDoctorAdvice] = useState("Low salt diet, 30 min daily brisk walking, avoid oil/fried foods.");

  // Right Column Medications State
  const [prescribedDrugs, setPrescribedDrugs] = useState<PrescribedDrug[]>([
    {
      id: "drug-1",
      brandName: "Seclo 20",
      genericName: "Omeprazole",
      dosageForm: "Capsule",
      strength: "20mg",
      pattern: "1+0+1",
      durationDays: 14,
      timing: "Before Meal",
      instructions: "30 mins before breakfast & dinner",
    },
    {
      id: "drug-2",
      brandName: "Ecosprin 75",
      genericName: "Aspirin",
      dosageForm: "Tablet",
      strength: "75mg",
      pattern: "0+0+1",
      durationDays: 30,
      timing: "After Meal",
      instructions: "Take with half glass of water",
    },
  ]);

  // Drug Autocomplete Input State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDrugTemplate, setSelectedDrugTemplate] = useState(MEDICINE_DATABASE[0]);
  const [selectedPattern, setSelectedPattern] = useState("1+0+1");
  const [durationDays, setDurationDays] = useState(14);
  const [timing, setTiming] = useState<"Before Meal" | "After Meal" | "With Meal">("Before Meal");
  const [specialNote, setSpecialNote] = useState("");

  // Preview Modal
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Filter Autocomplete Suggestions
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return MEDICINE_DATABASE.slice(0, 5);
    return MEDICINE_DATABASE.filter(
      (m) =>
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Automated Drug Interaction Safety Check Algorithm
  const drugInteractions = useMemo(() => {
    const warnings: { drugA: string; drugB: string; severity: "high" | "moderate"; message: string }[] = [];
    const activeGenerics = prescribedDrugs.map((d) => d.genericName);

    prescribedDrugs.forEach((drug) => {
      const known = KNOWN_INTERACTIONS[drug.genericName];
      if (known && activeGenerics.includes(known.partnerGeneric)) {
        // Prevent duplicate reversed warnings
        const exists = warnings.some(
          (w) =>
            (w.drugA === drug.genericName && w.drugB === known.partnerGeneric) ||
            (w.drugA === known.partnerGeneric && w.drugB === drug.genericName)
        );
        if (!exists) {
          warnings.push({
            drugA: drug.genericName,
            drugB: known.partnerGeneric,
            severity: known.severity,
            message: known.message,
          });
        }
      }
    });

    return warnings;
  }, [prescribedDrugs]);

  // Add Medication to List
  const handleAddDrug = (med?: typeof MEDICINE_DATABASE[0]) => {
    const targetMed = med || selectedDrugTemplate || MEDICINE_DATABASE[0];
    if (!targetMed) return;

    const newDrug: PrescribedDrug = {
      id: `drug-${Date.now()}`,
      brandName: targetMed.brandName,
      genericName: targetMed.genericName,
      dosageForm: targetMed.dosageForm,
      strength: targetMed.strength,
      pattern: selectedPattern,
      durationDays: Number(durationDays),
      timing: timing,
      instructions: specialNote.trim() || undefined,
    };

    setPrescribedDrugs((prev) => [...prev, newDrug]);
    setSearchQuery("");
    setShowSuggestions(false);
    setSpecialNote("");
  };

  const handleRemoveDrug = (id: string) => {
    setPrescribedDrugs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-card-border shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-teal/10 border border-primary-teal/30 text-primary-teal text-xs font-bold">
            <Stethoscope className="h-3.5 w-3.5" /> Clinical Prescription Writer
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-fg-app">New Digital Prescription</h1>
          <p className="text-xs text-muted-foreground">
            Patient: <span className="font-bold text-fg-app">{patientInfo.name}</span> ({patientInfo.age} yrs • {patientInfo.gender}) • Appt #{patientInfo.appointmentId}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowPdfPreview(true)}
            className="h-10 px-4 rounded-xl font-bold text-xs border-card-border"
          >
            <Printer className="h-4 w-4 mr-1.5 text-primary-teal" /> Preview PDF
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowPdfPreview(true)}
            className="h-10 px-5 rounded-xl font-bold text-xs bg-primary-teal hover:bg-teal-600 shadow-md shadow-primary-teal/20"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Save & Issue Prescription
          </Button>
        </div>
      </div>

      {/* Automated Drug Safety Warnings Banner */}
      <AnimatePresence>
        {drugInteractions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-600 dark:text-amber-400 space-y-2 shadow-sm"
          >
            <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider">
              <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse shrink-0" />
              <span>Automated Drug Interaction Safety Warning ({drugInteractions.length} Flagged)</span>
            </div>
            <div className="space-y-1.5 pl-7 text-xs">
              {drugInteractions.map((warning, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">•</span>
                  <span>
                    <strong className="underline">{warning.drugA}</strong> + <strong className="underline">{warning.drugB}</strong>: {warning.message}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Clinical Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Complaints, Clinical Findings, Vitals & Investigations (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Vitals Card */}
          <div className="p-5 rounded-2xl bg-card border border-card-border shadow-xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary-teal" /> Patient Vitals Signs
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">BP (mmHg)</label>
                <input
                  type="text"
                  value={vitals.bp}
                  onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-surface-card-hover border border-card-border text-xs font-bold text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Pulse (bpm)</label>
                <input
                  type="text"
                  value={vitals.pulse}
                  onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-surface-card-hover border border-card-border text-xs font-bold text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Weight (kg)</label>
                <input
                  type="text"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-surface-card-hover border border-card-border text-xs font-bold text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Temp (°F)</label>
                <input
                  type="text"
                  value={vitals.temp}
                  onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-surface-card-hover border border-card-border text-xs font-bold text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                />
              </div>
            </div>
          </div>

          {/* Chief Complaints Card */}
          <div className="p-5 rounded-2xl bg-card border border-card-border shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" /> Chief Complaints (C/C)
            </h3>
            <textarea
              rows={3}
              value={chiefComplaints}
              onChange={(e) => setChiefComplaints(e.target.value)}
              placeholder="e.g. High fever for 3 days, cough, chest tightness..."
              className="w-full p-3 rounded-xl bg-surface-card-hover border border-card-border text-xs text-fg-app leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
          </div>

          {/* Clinical Findings & Diagnosis Card */}
          <div className="p-5 rounded-2xl bg-card border border-card-border shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-purple-500" /> Clinical Findings & Diagnosis (O/E)
            </h3>
            <textarea
              rows={3}
              value={clinicalFindings}
              onChange={(e) => setClinicalFindings(e.target.value)}
              placeholder="e.g. S1 S2 audible, chest clear, no edema..."
              className="w-full p-3 rounded-xl bg-surface-card-hover border border-card-border text-xs text-fg-app leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
          </div>

          {/* Investigations & Doctor Advice */}
          <div className="p-5 rounded-2xl bg-card border border-card-border shadow-xs space-y-4">
            <div className="space-y-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
                Advised Lab Investigations (Rx/Inv)
              </h3>
              <input
                type="text"
                value={labInvestigations}
                onChange={(e) => setLabInvestigations(e.target.value)}
                placeholder="e.g. CBC, ECG, Lipid Profile, HbA1c..."
                className="w-full h-10 px-3.5 rounded-xl bg-surface-card-hover border border-card-border text-xs text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
                General Advice & Lifestyle (উপদেশ)
              </h3>
              <textarea
                rows={2}
                value={doctorAdvice}
                onChange={(e) => setDoctorAdvice(e.target.value)}
                placeholder="e.g. Drink plenty of water, low salt intake..."
                className="w-full p-3 rounded-xl bg-surface-card-hover border border-card-border text-xs text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Medication Selection & Prescribed Drugs List (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Medication Selector & Dosage Form */}
          <div className="p-5 rounded-2xl bg-card border border-card-border shadow-xs space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary-teal" /> Add Medication (Rx)
            </h3>

            {/* Autocomplete Medication Search */}
            <div className="relative">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                Search Generic or Brand Name
              </label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Type Seclo, Sergel, Napa, Aspirin, Rosuva..."
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface-card-hover border border-card-border text-xs text-fg-app font-semibold focus:outline-none focus:ring-2 focus:ring-primary-teal"
                />
              </div>

              {/* Autocomplete Dropdown List */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto no-scrollbar">
                  {filteredSuggestions.map((med, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDrugTemplate(med);
                        setSearchQuery(`${med.brandName} (${med.genericName})`);
                        setShowSuggestions(false);
                      }}
                      className="p-3 hover:bg-surface-card-hover cursor-pointer border-b border-card-border/50 last:border-b-0 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-fg-app block">{med.brandName} <span className="text-[11px] text-muted-foreground">({med.strength})</span></span>
                        <span className="text-[10px] text-primary-teal font-semibold">{med.genericName} • {med.dosageForm}</span>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dosage Pattern Selection Chips */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                Select Dosage Pattern (মাত্রা)
              </label>
              <div className="flex flex-wrap gap-2">
                {DOSAGE_PATTERNS.map((pattern) => (
                  <button
                    key={pattern}
                    type="button"
                    onClick={() => setSelectedPattern(pattern)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedPattern === pattern
                        ? "bg-primary-teal text-white shadow-xs"
                        : "bg-surface-card-hover border border-card-border text-muted-foreground hover:text-fg-app"
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Days & Meal Timing Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl bg-surface-card-hover border border-card-border text-xs font-bold text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  />
                  <div className="flex gap-1">
                    {[7, 14, 30].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDurationDays(d)}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-muted text-muted-foreground hover:text-fg-app"
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Meal Timing (খাবার সময়)
                </label>
                <select
                  value={timing}
                  onChange={(e) => setTiming(e.target.value as "Before Meal" | "After Meal" | "With Meal")}
                  className="w-full h-10 px-3 rounded-xl bg-surface-card-hover border border-card-border text-xs font-bold text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                >
                  <option value="Before Meal">Before Meal (খাবার আগে)</option>
                  <option value="After Meal">After Meal (খাবার পর)</option>
                  <option value="With Meal">With Meal (খাবারের সাথে)</option>
                </select>
              </div>
            </div>

            {/* Special Instruction Note */}
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="e.g. Take with warm water at bedtime..."
                className="w-full h-9 px-3.5 rounded-xl bg-surface-card-hover border border-card-border text-xs text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
              />
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={() => handleAddDrug(selectedDrugTemplate)}
              className="w-full h-10 rounded-xl font-bold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Drug to Prescription List
            </Button>
          </div>

          {/* Active Prescribed Drugs List Card */}
          <div className="p-5 rounded-2xl bg-card border border-card-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Pill className="h-4 w-4 text-emerald-500" /> Prescribed Medications ({prescribedDrugs.length})
              </h3>
              <span className="text-[11px] font-semibold text-muted-foreground">Rx List</span>
            </div>

            {prescribedDrugs.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-card-border text-xs text-muted-foreground space-y-1">
                <Pill className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                <p className="font-bold">No drugs added yet</p>
                <p className="text-[11px]">Use the drug selector above to add medications.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescribedDrugs.map((drug, index) => (
                  <div
                    key={drug.id}
                    className="p-4 rounded-xl border border-card-border bg-surface-card-hover flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-primary-teal/10 text-primary-teal font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-fg-app">
                          {drug.brandName} <span className="text-xs font-normal text-muted-foreground">({drug.strength})</span>
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                          {drug.dosageForm}
                        </span>
                      </div>

                      <p className="text-[11px] text-primary-teal font-medium pl-7">
                        Generic: {drug.genericName}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pl-7 pt-1 text-[11px]">
                        <span className="px-2.5 py-0.5 rounded-md bg-card border border-card-border font-bold text-fg-app">
                          {drug.pattern}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-semibold text-fg-app">{drug.durationDays} Days</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-semibold text-amber-500">{drug.timing}</span>
                      </div>

                      {drug.instructions && (
                        <p className="text-[10px] italic text-muted-foreground pl-7 pt-0.5">
                          Note: {drug.instructions}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveDrug(drug.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Remove Drug"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Digital Prescription Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPdfPreview(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* PDF Header Controls */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="h-5 w-5 text-primary-teal" />
                  <span className="font-bold text-sm">Official Digital Prescription Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" className="h-8 px-3 text-xs bg-primary-teal font-bold">
                    <Download className="h-3.5 w-3.5 mr-1" /> Download PDF
                  </Button>
                  <button onClick={() => setShowPdfPreview(false)} className="p-1.5 text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* PDF Document Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-800 bg-white no-scrollbar font-serif">
                {/* Doctor Letterhead */}
                <div className="border-b-2 border-teal-600 pb-4 flex justify-between items-start font-sans">
                  <div>
                    <h2 className="text-xl font-black text-teal-700">Prof. Dr. Syed Mahmudul Hasan</h2>
                    <p className="text-xs text-slate-600 font-semibold">MBBS, FCPS (Cardiology), MD (Internal Medicine)</p>
                    <p className="text-[11px] text-slate-500">Senior Consultant Cardiology • ShebaMitro Health</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p className="font-bold text-slate-700">ShebaMitro Digital Telehealth</p>
                    <p>Reg No: BMDC #A-48912</p>
                    <p>Date: {patientInfo.date}</p>
                  </div>
                </div>

                {/* Patient Information Banner */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-4 gap-2 text-xs font-sans">
                  <div><span className="text-slate-500">Patient:</span> <strong className="text-slate-900">{patientInfo.name}</strong></div>
                  <div><span className="text-slate-500">Age/Gender:</span> <strong className="text-slate-900">{patientInfo.age} Y / {patientInfo.gender}</strong></div>
                  <div><span className="text-slate-500">BP:</span> <strong className="text-slate-900">{vitals.bp} mmHg</strong></div>
                  <div><span className="text-slate-500">Pulse:</span> <strong className="text-slate-900">{vitals.pulse} bpm</strong></div>
                </div>

                {/* Rx Clinical 2-Column Section */}
                <div className="grid grid-cols-12 gap-6 pt-2 font-sans">
                  {/* Left Column: Complaints & Advice */}
                  <div className="col-span-4 border-r border-slate-200 pr-4 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-teal-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">C/C (Chief Complaints)</h4>
                      <p className="text-slate-700 mt-1 leading-relaxed">{chiefComplaints}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-teal-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">O/E (Clinical Findings)</h4>
                      <p className="text-slate-700 mt-1 leading-relaxed">{clinicalFindings}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-teal-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">Advised Tests</h4>
                      <p className="text-slate-700 mt-1 font-medium">{labInvestigations}</p>
                    </div>
                  </div>

                  {/* Right Column: Rx Drugs */}
                  <div className="col-span-8 space-y-4">
                    <div className="flex items-center gap-2 text-teal-700">
                      <span className="font-serif italic font-extrabold text-3xl">Rx</span>
                    </div>

                    <div className="space-y-4 font-sans text-xs">
                      {prescribedDrugs.map((d, i) => (
                        <div key={d.id} className="space-y-0.5">
                          <div className="font-bold text-sm text-slate-900">
                            {i + 1}. {d.brandName} ({d.strength}) - <span className="text-slate-600 font-medium">{d.dosageForm}</span>
                          </div>
                          <div className="text-slate-600 font-semibold pl-4">
                            {d.genericName}
                          </div>
                          <div className="pl-4 font-bold text-teal-700">
                            {d.pattern} ({d.timing}) ---------- {d.durationDays} Days
                          </div>
                          {d.instructions && <div className="pl-4 italic text-[11px] text-slate-500">Note: {d.instructions}</div>}
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-200 font-sans text-xs space-y-1">
                      <h4 className="font-bold text-slate-800 uppercase text-[10px]">Advice / নির্দেশাবলী</h4>
                      <p className="text-slate-700 leading-relaxed">{doctorAdvice}</p>
                    </div>
                  </div>
                </div>

                {/* Digital Seal & Signature */}
                <div className="pt-8 border-t border-slate-200 flex justify-between items-end font-sans text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px]">
                    <ShieldCheck className="h-4 w-4" /> Cryptographically Verified Digital Signature
                  </div>
                  <div className="text-center space-y-1">
                    <div className="h-10 w-28 border-b-2 border-teal-600 mx-auto flex items-center justify-center italic text-teal-700 font-serif text-sm">
                      Dr. S. M. Hasan
                    </div>
                    <p className="font-bold text-slate-800">Doctor&apos;s Seal & Signature</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
