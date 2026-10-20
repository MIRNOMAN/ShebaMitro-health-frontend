"use client";

import React from "react";
import {
  X,
  Stethoscope,
  Pill,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Building,
  Activity,
  Layers,
  Calendar,
  Tag,
  Hash,
  DollarSign,
  Package,
} from "lucide-react";
import {
  SpecialtyMasterItem,
  DrugMasterItem,
  Icd10MasterItem,
  MasterDataTab,
} from "../../types/masterData";

interface MasterDataSingleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: MasterDataTab;
  specialty?: SpecialtyMasterItem | null;
  drug?: DrugMasterItem | null;
  icd10?: Icd10MasterItem | null;
  onEdit?: () => void;
}

export function MasterDataSingleViewModal({
  isOpen,
  onClose,
  tab,
  specialty,
  drug,
  icd10,
  onEdit,
}: MasterDataSingleViewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-card-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-teal/10 border border-primary-teal/20 flex items-center justify-center text-primary-teal shrink-0">
              {tab === "SPECIALTIES" && <Stethoscope className="h-5 w-5" />}
              {tab === "DRUGS" && <Pill className="h-5 w-5" />}
              {tab === "ICD10" && <FileSpreadsheet className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-fg-app">
                {tab === "SPECIALTIES" && "Medical Specialty Record"}
                {tab === "DRUGS" && "Drug Master File"}
                {tab === "ICD10" && "ICD-10 Clinical Diagnosis"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Detailed database inspection of master catalog entity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-fg-app p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* SPECIALTY VIEW */}
          {tab === "SPECIALTIES" && specialty && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-card-border">
                <div>
                  <h4 className="text-xl font-extrabold text-fg-app">{specialty.titleEn}</h4>
                  <p className="text-sm font-semibold text-primary-teal">{specialty.titleBn}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                    specialty.status === "Active" || specialty.isActive !== false
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                  }`}
                >
                  {specialty.status === "Active" || specialty.isActive !== false ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  {specialty.status === "Active" || specialty.isActive !== false ? "Active Status" : "Deprecated"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">Specialty Identifier / Code</span>
                  <span className="font-mono font-bold text-fg-app text-sm">{specialty.code}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">Active Doctors Count</span>
                  <span className="font-bold text-primary-teal text-sm">
                    {specialty.doctorCount || `${specialty.count ?? 0} Doctors`}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-card-border text-xs space-y-1">
                <span className="text-muted-foreground block">Clinical Description</span>
                <p className="text-fg-app leading-relaxed">
                  {specialty.description || "No formal description provided for this medical category."}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-muted-foreground block font-semibold">Associated Search Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {(specialty.keywords || []).length > 0 ? (
                    specialty.keywords?.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-teal/10 text-primary-teal border border-primary-teal/20 text-xs font-medium"
                      >
                        <Tag className="h-3 w-3" />
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">No keywords assigned.</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-card-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Database ID: <span className="font-mono text-fg-app">{specialty.id}</span></span>
                <span>Updated: {specialty.updatedAt}</span>
              </div>
            </div>
          )}

          {/* DRUG VIEW */}
          {tab === "DRUGS" && drug && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-card-border">
                <div>
                  <h4 className="text-xl font-extrabold text-fg-app">{drug.brandName}</h4>
                  <p className="text-sm font-semibold text-primary-teal">{drug.genericName}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                    drug.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                  }`}
                >
                  {drug.status === "Active" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  {drug.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">Manufacturer</span>
                  <span className="font-bold text-fg-app flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    {drug.manufacturer}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">Strength & Formulation</span>
                  <span className="font-bold text-fg-app">
                    {drug.strength} — {drug.formulation}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">DGDA DAR No.</span>
                  <span className="font-mono font-bold text-fg-app">{drug.dgdaApprovalNo}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">Unit Price & Stock</span>
                  <span className="font-bold text-fg-app">
                    BDT {drug.price ?? 10} • Stock: {drug.stockCount ?? drug.stockQuantity ?? 100}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-card-border text-xs space-y-1">
                <span className="text-muted-foreground block">Regulatory Category</span>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded bg-primary-teal/10 text-primary-teal font-bold border border-primary-teal/20">
                    Category: {drug.category || "General"}
                  </span>
                  <span className="text-muted-foreground">
                    {drug.requiresPrescription ? "Prescription Required" : "Over-The-Counter (OTC)"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-card-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Database ID: <span className="font-mono text-fg-app">{drug.id}</span></span>
                <span>Last Updated: {drug.updatedAt}</span>
              </div>
            </div>
          )}

          {/* ICD-10 VIEW */}
          {tab === "ICD10" && icd10 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-card-border">
                <div>
                  <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded bg-primary-teal/10 text-primary-teal border border-primary-teal/20 inline-block mb-1.5">
                    {icd10.code}
                  </span>
                  <h4 className="text-lg font-extrabold text-fg-app">{icd10.diagnosisTitle}</h4>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                    icd10.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                  }`}
                >
                  {icd10.status === "Active" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  {icd10.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">Disease Category</span>
                  <span className="font-bold text-fg-app flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    {icd10.category}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-card-border">
                  <span className="text-muted-foreground block mb-1">Clinical Chronicity</span>
                  {icd10.isChronic ? (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-600">
                      <Activity className="h-3.5 w-3.5" /> Chronic Medical Condition
                    </span>
                  ) : (
                    <span className="font-medium text-fg-app">Acute / Episodic Diagnosis</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-card-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Database ID: <span className="font-mono text-fg-app">{icd10.id}</span></span>
                <span>Last Updated: {icd10.updatedAt}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t border-card-border flex items-center justify-end gap-2.5">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="px-4 py-2 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Edit Entity
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-card-border bg-card hover:bg-muted text-xs font-bold text-fg-app transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
