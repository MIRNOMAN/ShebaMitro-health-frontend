import React from "react";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { TestTemplate } from "../../types";

interface BiomarkerFormTableProps {
  currentTemplate: TestTemplate;
  biomarkerValues: Record<string, number>;
  onBiomarkerChange: (bmId: string, val: string) => void;
  outOfRangeBiomarkers: any[];
}

export function BiomarkerFormTable({
  currentTemplate,
  biomarkerValues,
  onBiomarkerChange,
  outOfRangeBiomarkers,
}: BiomarkerFormTableProps) {
  return (
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
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-fg-app block">{bm.name}</span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  Ref Bounds: {bm.minRef} - {bm.maxRef} {bm.unit}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => onBiomarkerChange(bm.id, e.target.value)}
                    className={`w-28 h-9 px-3 rounded-lg text-right font-mono font-extrabold text-xs focus:outline-none transition-colors border ${
                      isOutOfRange
                        ? "bg-rose-500/20 text-rose-500 border-rose-500 ring-2 ring-rose-500/30"
                        : "bg-card text-fg-app border-card-border focus:border-primary-teal"
                    }`}
                  />
                  <span className="text-[10px] font-semibold text-muted-foreground ml-1.5">
                    {bm.unit}
                  </span>
                </div>

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
  );
}
