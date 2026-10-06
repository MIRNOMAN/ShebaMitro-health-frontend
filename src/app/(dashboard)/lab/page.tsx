"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, LayoutGrid, List, Check } from "lucide-react";
import { TestRequisition, RequisitionStatus } from "@/features/lab/types";
import { INITIAL_REQUISITIONS } from "@/features/lab/data/mockData";
import { LabStatsRow } from "@/features/lab/components/LabStatsRow";
import { LabFilterBar } from "@/features/lab/components/LabFilterBar";
import { LabKanbanBoard } from "@/features/lab/components/LabKanbanBoard";
import { LabRequisitionsTable } from "@/features/lab/components/LabRequisitionsTable";
import { BarcodePrintModal } from "@/features/lab/components/BarcodePrintModal";
import { ClinicalNotesModal } from "@/features/lab/components/ClinicalNotesModal";

export default function LabRequisitionsPage() {
  const [requisitions, setRequisitions] = useState<TestRequisition[]>(INITIAL_REQUISITIONS);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("ALL");
  const [selectedTest, setSelectedTest] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");

  // Modal & Toast States
  const [barcodeModalItem, setBarcodeModalItem] = useState<TestRequisition | null>(null);
  const [clinicalNotesModalItem, setClinicalNotesModalItem] = useState<TestRequisition | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const doctorOptions = useMemo(
    () => Array.from(new Set(requisitions.map((r) => r.referringDoctor))).sort(),
    [requisitions]
  );
  const testOptions = useMemo(
    () => Array.from(new Set(requisitions.map((r) => r.testName))).sort(),
    [requisitions]
  );

  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((req) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        req.patientName.toLowerCase().includes(q) ||
        req.patientId.toLowerCase().includes(q) ||
        req.referringDoctor.toLowerCase().includes(q) ||
        req.testName.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q);

      const matchDoctor = selectedDoctor === "ALL" || req.referringDoctor === selectedDoctor;
      const matchTest = selectedTest === "ALL" || req.testName === selectedTest;
      const matchPriority = selectedPriority === "ALL" || req.priority === selectedPriority;

      return matchSearch && matchDoctor && matchTest && matchPriority;
    });
  }, [requisitions, searchQuery, selectedDoctor, selectedTest, selectedPriority]);

  const handleAdvanceStatus = (id: string, currentStatus: RequisitionStatus) => {
    let nextStatus: RequisitionStatus;
    if (currentStatus === "New Order") nextStatus = "Sample Collection Scheduled";
    else if (currentStatus === "Sample Collection Scheduled") nextStatus = "Processing in Lab";
    else if (currentStatus === "Processing in Lab") nextStatus = "Report Ready";
    else return;

    setRequisitions((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
    triggerToast(`Order ${id} status updated to "${nextStatus}".`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDoctor("ALL");
    setSelectedTest("ALL");
    setSelectedPriority("ALL");
  };

  const isFiltered = searchQuery !== "" || selectedDoctor !== "ALL" || selectedTest !== "ALL" || selectedPriority !== "ALL";

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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
          <span className="text-xs font-bold uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <FlaskConical className="h-4 w-4" /> ShebaMitro Diagnostic LIMS Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Incoming Test <span className="text-primary-teal">Requisitions</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage laboratory test workflow from intake, barcoding, processing to PDF report release.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-muted border border-card-border">
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "kanban" ? "bg-card text-primary-teal shadow-xs border border-card-border" : "text-muted-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" /> Kanban View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "table" ? "bg-card text-primary-teal shadow-xs border border-card-border" : "text-muted-foreground"
            }`}
          >
            <List className="h-4 w-4" /> Table View
          </button>
        </div>
      </div>

      <LabStatsRow requisitions={requisitions} />

      <LabFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        selectedTest={selectedTest}
        setSelectedTest={setSelectedTest}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        doctorOptions={doctorOptions}
        testOptions={testOptions}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
      />

      {viewMode === "kanban" ? (
        <LabKanbanBoard
          requisitions={filteredRequisitions}
          onAdvanceStatus={handleAdvanceStatus}
          onOpenBarcode={setBarcodeModalItem}
          onOpenClinicalNotes={setClinicalNotesModalItem}
        />
      ) : (
        <LabRequisitionsTable
          requisitions={filteredRequisitions}
          onAdvanceStatus={handleAdvanceStatus}
          onOpenBarcode={setBarcodeModalItem}
          onOpenClinicalNotes={setClinicalNotesModalItem}
        />
      )}

      <BarcodePrintModal
        item={barcodeModalItem}
        onClose={() => setBarcodeModalItem(null)}
        onPrint={(item) => {
          triggerToast(`Barcode label printed for ${item.patientName} (${item.barcode})`);
          setBarcodeModalItem(null);
        }}
      />

      <ClinicalNotesModal
        item={clinicalNotesModalItem}
        onClose={() => setClinicalNotesModalItem(null)}
        onSwitchToBarcode={(item) => {
          setBarcodeModalItem(item);
          setClinicalNotesModalItem(null);
        }}
      />
    </div>
  );
}
