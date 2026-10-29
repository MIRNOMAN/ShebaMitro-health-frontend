"use client";

import React from "react";
import { BiomarkerTrendCharts } from "@/features/patient/components/BiomarkerTrendCharts";
import { MedicalDocumentVault } from "@/features/patient/components/MedicalDocumentVault";
import { ShieldCheck } from "lucide-react";

export default function PatientRecordsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/10 via-background to-background p-5 sm:p-7 rounded-3xl border border-card-border shadow-xs">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Personal Health Vault & Biomarkers
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Medical Records & <span className="text-primary-teal">Biomarker Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Longitudinal trend line graphs for Fasting Sugar, HbA1c & BP with 1-click verified PDF document vault.
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
