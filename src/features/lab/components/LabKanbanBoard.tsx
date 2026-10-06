import React from "react";
import { FlaskConical } from "lucide-react";
import { TestRequisition, RequisitionStatus } from "../types";
import { COLUMNS } from "./LabStatsRow";
import { LabKanbanCard } from "./LabKanbanCard";

interface LabKanbanBoardProps {
  requisitions: TestRequisition[];
  onAdvanceStatus: (id: string, currentStatus: RequisitionStatus) => void;
  onOpenBarcode: (req: TestRequisition) => void;
  onOpenClinicalNotes: (req: TestRequisition) => void;
}

export function LabKanbanBoard({
  requisitions,
  onAdvanceStatus,
  onOpenBarcode,
  onOpenClinicalNotes,
}: LabKanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {COLUMNS.map((col) => {
        const columnRequisitions = requisitions.filter((r) => r.status === col.status);
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
                  <LabKanbanCard
                    key={req.id}
                    requisition={req}
                    onAdvanceStatus={onAdvanceStatus}
                    onOpenBarcode={onOpenBarcode}
                    onOpenClinicalNotes={onOpenClinicalNotes}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
