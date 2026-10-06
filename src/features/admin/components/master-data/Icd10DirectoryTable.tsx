"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Search, Edit3, CheckCircle2, AlertCircle, Plus, Activity, Tag } from "lucide-react";
import { Icd10MasterItem } from "../../types/masterData";

interface Icd10DirectoryTableProps {
  icd10Items: Icd10MasterItem[];
  onEditIcd: (item: Icd10MasterItem) => void;
  onToggleStatus: (id: string) => void;
  onAddNew: () => void;
}

export function Icd10DirectoryTable({
  icd10Items,
  onEditIcd,
  onToggleStatus,
  onAddNew,
}: Icd10DirectoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = icd10Items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      item.code.toLowerCase().includes(q) ||
      item.diagnosisTitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary-teal" /> Standard ICD-10 Diagnosis Table
          </h3>
          <p className="text-xs text-muted-foreground">
            International Classification of Diseases 10th Revision clinical code repository.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search code, diagnosis, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
            />
          </div>

          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Add ICD-10
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-card-border text-[10px] uppercase font-bold text-muted-foreground bg-muted/40">
              <th className="py-2.5 px-3">ICD-10 Code</th>
              <th className="py-2.5 px-3">Diagnosis Title</th>
              <th className="py-2.5 px-3">Clinical Category</th>
              <th className="py-2.5 px-3">Type / Severity</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  No matching ICD-10 diagnoses found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono font-extrabold text-primary-teal text-sm bg-primary-teal/10 px-2 py-0.5 rounded border border-primary-teal/20 inline-block">
                      {item.code}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-fg-app text-xs block">{item.diagnosisTitle}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-fg-app">
                      <Tag className="h-3 w-3 text-muted-foreground" />
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
                      onClick={() => onToggleStatus(item.id)}
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
                    <button
                      onClick={() => onEditIcd(item)}
                      className="p-1.5 rounded-lg border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
                      title="Edit ICD-10 Record"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-primary-teal" />
                    </button>
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
