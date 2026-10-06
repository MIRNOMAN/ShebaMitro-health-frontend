import React from "react";
import { Sparkles, Calendar, FlaskConical, CheckCircle2 } from "lucide-react";
import { TestRequisition, RequisitionStatus } from "../types";

export const COLUMNS: {
  status: RequisitionStatus;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ElementType;
}[] = [
  { status: "New Order", label: "New Order", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: Sparkles },
  { status: "Sample Collection Scheduled", label: "Sample Collection Scheduled", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Calendar },
  { status: "Processing in Lab", label: "Processing in Lab", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30", icon: FlaskConical },
  { status: "Report Ready", label: "Report Ready", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: CheckCircle2 },
];

interface LabStatsRowProps {
  requisitions: TestRequisition[];
}

export function LabStatsRow({ requisitions }: LabStatsRowProps) {
  return (
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
  );
}
