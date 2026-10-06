import React from "react";
import { Printer, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestRequisition, RequisitionStatus } from "../types";

interface LabRequisitionsTableProps {
  requisitions: TestRequisition[];
  onAdvanceStatus: (id: string, currentStatus: RequisitionStatus) => void;
  onOpenBarcode: (req: TestRequisition) => void;
  onOpenClinicalNotes: (req: TestRequisition) => void;
}

export function LabRequisitionsTable({
  requisitions,
  onAdvanceStatus,
  onOpenBarcode,
  onOpenClinicalNotes,
}: LabRequisitionsTableProps) {
  return (
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
            {requisitions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No matching test requisitions found.
                </td>
              </tr>
            ) : (
              requisitions.map((req) => (
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
                        onClick={() => onOpenBarcode(req)}
                        title="Print Barcode Label"
                        className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-primary-teal/15 hover:text-primary-teal transition-colors"
                      >
                        <Printer className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onOpenClinicalNotes(req)}
                        title="View Clinical Notes"
                        className="p-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-purple-500/15 hover:text-purple-500 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      {req.status === "New Order" && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onAdvanceStatus(req.id, req.status)}
                          className="h-8 text-xs font-bold"
                        >
                          Accept Order
                        </Button>
                      )}

                      {req.status === "Sample Collection Scheduled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAdvanceStatus(req.id, req.status)}
                          className="h-8 text-xs font-bold text-purple-500 border-purple-500/40"
                        >
                          Start Processing
                        </Button>
                      )}

                      {req.status === "Processing in Lab" && (
                        <Button
                          size="sm"
                          variant="emerald"
                          onClick={() => onAdvanceStatus(req.id, req.status)}
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
  );
}
