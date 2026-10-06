"use client";

import React, { useRef } from "react";
import { Pill, FileSpreadsheet, Upload, Download, CheckCircle2 } from "lucide-react";
import { MasterDataTab } from "../../types/masterData";

interface MasterDataHeaderControlsProps {
  activeTab: MasterDataTab;
  onSelectTab: (tab: MasterDataTab) => void;
  onExportCsv: () => void;
  onImportCsv: (file: File) => void;
}

export function MasterDataHeaderControls({
  activeTab,
  onSelectTab,
  onExportCsv,
  onImportCsv,
}: MasterDataHeaderControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportCsv(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => onSelectTab("DRUGS")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "DRUGS"
              ? "bg-card text-primary-teal shadow-xs border border-card-border"
              : "text-muted-foreground hover:text-fg-app"
          }`}
        >
          <Pill className="h-4 w-4" />
          Pharmaceutical Drug Directory
        </button>

        <button
          onClick={() => onSelectTab("ICD10")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "ICD10"
              ? "bg-card text-primary-teal shadow-xs border border-card-border"
              : "text-muted-foreground hover:text-fg-app"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          ICD-10 Clinical Diagnosis Table
        </button>
      </div>

      {/* Bulk CSV Controls */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-card-border bg-card hover:bg-muted text-xs font-bold text-fg-app transition-colors"
        >
          <Upload className="h-3.5 w-3.5 text-primary-teal" /> Bulk CSV Import
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-card-border bg-card hover:bg-muted text-xs font-bold text-fg-app transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-primary-teal" /> Export CSV
        </button>
      </div>
    </div>
  );
}
