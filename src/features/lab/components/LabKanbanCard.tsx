import React from "react";
import { motion } from "framer-motion";
import { User, Stethoscope, Printer, FileText, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestRequisition, RequisitionStatus } from "../types";

interface LabKanbanCardProps {
  requisition: TestRequisition;
  onAdvanceStatus: (id: string, currentStatus: RequisitionStatus) => void;
  onOpenBarcode: (req: TestRequisition) => void;
  onOpenClinicalNotes: (req: TestRequisition) => void;
}

export function LabKanbanCard({
  requisition: req,
  onAdvanceStatus,
  onOpenBarcode,
  onOpenClinicalNotes,
}: LabKanbanCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="group p-4 rounded-xl border border-card-border bg-card hover:border-primary-teal/40 hover:shadow-md transition-all space-y-3 relative"
    >
      {/* Top Info Bar */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-mono font-bold text-muted-foreground">{req.id}</span>
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
        <p className="font-semibold text-fg-app line-clamp-2">{req.testName}</p>
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenBarcode(req)}
            title="Print Sample Barcode"
            className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-primary-teal/15 hover:text-primary-teal hover:border-primary-teal/30 transition-colors text-muted-foreground"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onOpenClinicalNotes(req)}
            title="View Patient Clinical Notes"
            className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-purple-500/15 hover:text-purple-500 hover:border-purple-500/30 transition-colors text-muted-foreground"
          >
            <FileText className="h-3.5 w-3.5" />
          </button>
        </div>

        {req.status === "New Order" && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onAdvanceStatus(req.id, req.status)}
            className="h-7 text-[11px] px-2.5 font-bold shadow-xs"
          >
            Accept Order <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        )}

        {req.status === "Sample Collection Scheduled" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAdvanceStatus(req.id, req.status)}
            className="h-7 text-[11px] px-2.5 font-bold text-purple-500 border-purple-500/40 hover:bg-purple-500/10"
          >
            Start Processing <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        )}

        {req.status === "Processing in Lab" && (
          <Button
            size="sm"
            variant="emerald"
            onClick={() => onAdvanceStatus(req.id, req.status)}
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
  );
}
