"use client";

import React, { useState } from "react";
import {
  Pill,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Building,
} from "lucide-react";
import { DrugMasterItem } from "../../types/masterData";

interface DrugDirectoryTableProps {
  drugs: DrugMasterItem[];
  isLoading?: boolean;
  onEditDrug: (drug: DrugMasterItem) => void;
  onViewDrug: (drug: DrugMasterItem) => void;
  onDeleteDrug: (drug: DrugMasterItem) => void;
  onToggleStatus: (drug: DrugMasterItem) => void;
  onAddNew: () => void;
}

export function DrugDirectoryTable({
  drugs,
  isLoading,
  onEditDrug,
  onViewDrug,
  onDeleteDrug,
  onToggleStatus,
  onAddNew,
}: DrugDirectoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = drugs.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (d.brandName || "").toLowerCase().includes(q) ||
      (d.genericName || "").toLowerCase().includes(q) ||
      (d.manufacturer || "").toLowerCase().includes(q) ||
      (d.strength || "").toLowerCase().includes(q) ||
      (d.dgdaApprovalNo || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary-teal" /> Platform Drug Directory
          </h3>
          <p className="text-xs text-muted-foreground">
            Master database of brand names, generics, manufacturers, and DGDA licenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search brand, generic, or DGDA #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
            />
          </div>

          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Add Drug
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-card-border text-[10px] uppercase font-bold text-muted-foreground bg-muted/40">
              <th className="py-2.5 px-3">Brand Name</th>
              <th className="py-2.5 px-3">Generic Name</th>
              <th className="py-2.5 px-3">Strength & Form</th>
              <th className="py-2.5 px-3">Manufacturer</th>
              <th className="py-2.5 px-3">DGDA Registration</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-primary-teal border-t-transparent animate-spin" />
                    <span>Loading medicines from database...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No matching pharmaceutical drugs found in master directory.
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-fg-app text-sm block">{d.brandName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{d.id}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-primary-teal block">{d.genericName}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="font-bold text-fg-app block">{d.strength}</span>
                    <span className="text-[10px] text-muted-foreground">{d.formulation}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-fg-app flex items-center gap-1">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      {d.manufacturer}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-muted text-fg-app border border-card-border">
                      {d.dgdaApprovalNo}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onToggleStatus(d)}
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        d.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20"
                      }`}
                    >
                      {d.status === "Active" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {d.status}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDrug(d)}
                        className="p-1.5 rounded-lg border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5 text-fg-app" />
                      </button>
                      <button
                        onClick={() => onEditDrug(d)}
                        className="p-1.5 rounded-lg border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
                        title="Edit Master Record"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary-teal" />
                      </button>
                      <button
                        onClick={() => onDeleteDrug(d)}
                        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-600 transition-colors"
                        title="Delete Drug"
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
