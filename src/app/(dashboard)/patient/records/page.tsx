"use client";

import React from "react";
import { BiomarkerTrendCharts } from "@/features/patient/components/BiomarkerTrendCharts";
import { MedicalDocumentVault } from "@/features/patient/components/MedicalDocumentVault";
import { FileText, ShieldCheck, TrendingUp } from "lucide-react";

export default function PatientRecordsPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/10 via-background to-background p-6 rounded-2xl border border-card-border">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Personal Health Vault & Biomarkers
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Medical Records & <span className="text-primary-teal">Biomarker Analytics</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Longitudinal trend line graphs for Blood Sugar, HbA1c & BP with 1-click PDF document vault.
          </p>
        </div>
      </div>

      {/* Recharts Biomarker Trend Charts */}
      <BiomarkerTrendCharts />

      {/* Filterable Medical Document Vault */}
      <MedicalDocumentVault />
    </div>
  );
}
