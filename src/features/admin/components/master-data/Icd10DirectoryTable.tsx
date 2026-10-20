"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Activity,
  Layers,
} from "lucide-react";
import { Icd10MasterItem } from "../../types/masterData";

interface Icd10DirectoryTableProps {
  icd10Items: Icd10MasterItem[];
  isLoading?: boolean;
  onEditIcd: (item: Icd10MasterItem) => void;
  onViewIcd: (item: Icd10MasterItem) => void;
  onDeleteIcd: (item: Icd10MasterItem) => void;
  onToggleStatus: (item: Icd10MasterItem) => void;
  onAddNew: () => void;
}

export function Icd10DirectoryTable({
  icd10Items,
  isLoading,
  onEditIcd,
  onViewIcd,
  onDeleteIcd,
  onToggleStatus,
  onAddNew,
}: Icd10DirectoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = icd10Items.filter((i) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (i.code || "").toLowerCase().includes(q) ||
      (i.diagnosisTitle || "").toLowerCase().includes(q) ||
      (i.category || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary-teal" /> ICD-10 Clinical Diagnosis Master
          </h3>
          <p className="text-xs text-muted-foreground">
            Standardized diagnostic codes used by doctors across EMR prescriptions and telemedicine routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search code, title, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
            />
          </div>

          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Add ICD-10 Code
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-card-border text-[10px] uppercase font-bold text-muted-foreground bg-muted/40">
              <th className="py-2.5 px-3">ICD-10 Code</th>
              <th className="py-2.5 px-3">Diagnosis Description</th>
              <th className="py-2.5 px-3">Disease Category</th>
              <th className="py-2.5 px-3">Chronicity</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-primary-teal border-t-transparent animate-spin" />
                    <span>Loading ICD-10 diagnoses from database...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No matching ICD-10 diagnosis entries found in master table.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id || item.code} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded bg-primary-teal/10 text-primary-teal border border-primary-teal/20 inline-block">
                      {item.code}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <span className="font-bold text-fg-app block">{item.diagnosisTitle}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-fg-app flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {item.isChronic ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 border border-purple-500/30">
                        <Activity className="h-3 w-3" /> Chronic Condition
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-muted-foreground">Acute / Episodic</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onToggleStatus(item)}
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        item.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20"
                      }`}
                    >
                      {item.status === "Active" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {item.status}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewIcd(item)}
                        className="p-1.5 rounded-lg border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5 text-fg-app" />
                      </button>
                      <button
                        onClick={() => onEditIcd(item)}
                        className="p-1.5 rounded-lg border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
                        title="Edit ICD-10 Record"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary-teal" />
                      </button>
                      <button
                        onClick={() => onDeleteIcd(item)}
                        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-600 transition-colors"
                        title="Delete ICD-10 Record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
