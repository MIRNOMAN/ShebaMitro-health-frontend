import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Stethoscope, ShieldAlert, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestRequisition } from "../types";

interface ClinicalNotesModalProps {
  item: TestRequisition | null;
  onClose: () => void;
  onSwitchToBarcode: (req: TestRequisition) => void;
}

export function ClinicalNotesModal({ item, onClose, onSwitchToBarcode }: ClinicalNotesModalProps) {
  if (!item) return null;

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
                <p className="text-xs text-muted-foreground">Requisition #{item.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-fg-app"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Patient Banner */}
          <div className="p-4 rounded-xl bg-surface-card-hover border border-card-border space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-base text-fg-app">{item.patientName}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.patientAge} Years • {item.patientGender} • Patient ID:{" "}
                  <span className="font-bold text-primary-teal">{item.patientId}</span>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/30 text-xs font-bold">
                {item.testCategory}
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
              {item.referringDoctor}
            </p>
            <p className="text-muted-foreground pl-5">
              {item.doctorSpecialty} • {item.doctorHospital}
            </p>
          </div>

          {/* Clinical Assessment & Diagnosis */}
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5">
              <span className="font-bold text-amber-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> Working Clinical Diagnosis
              </span>
              <p className="font-semibold text-fg-app">{item.clinicalNotes.diagnosis}</p>
            </div>

            {/* Reported Symptoms */}
            {item.clinicalNotes.symptoms.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-muted-foreground text-[11px]">
                  Presenting Symptoms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.clinicalNotes.symptoms.map((symptom, i) => (
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
                  {item.clinicalNotes.fastingRequired
                    ? `Required (${item.clinicalNotes.fastingDuration || "Overnight"})`
                    : "No Fasting Required"}
                </p>
              </div>

              {item.clinicalNotes.allergies && (
                <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-rose-500">
                    Known Patient Allergies
                  </span>
                  <p className="font-bold text-rose-500">
                    {item.clinicalNotes.allergies.join(", ")}
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
                {item.clinicalNotes.specialInstructions}
              </p>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between border-t border-card-border pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchToBarcode(item)}
              className="text-xs font-semibold"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Barcode Label
            </Button>

            <Button variant="primary" size="sm" onClick={onClose}>
              Done Reading
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
