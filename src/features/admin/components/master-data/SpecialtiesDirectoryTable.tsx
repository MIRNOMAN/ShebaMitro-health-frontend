"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Tag,
} from "lucide-react";
import { SpecialtyMasterItem } from "../../types/masterData";

interface SpecialtiesDirectoryTableProps {
  specialties: SpecialtyMasterItem[];
  isLoading?: boolean;
  onEditSpecialty: (specialty: SpecialtyMasterItem) => void;
  onViewSpecialty: (specialty: SpecialtyMasterItem) => void;
  onDeleteSpecialty: (specialty: SpecialtyMasterItem) => void;
  onToggleStatus: (specialty: SpecialtyMasterItem) => void;
  onAddNew: () => void;
}

export function SpecialtiesDirectoryTable({
  specialties,
  isLoading,
  onEditSpecialty,
  onViewSpecialty,
  onDeleteSpecialty,
  onToggleStatus,
  onAddNew,
}: SpecialtiesDirectoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = specialties.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const kwMatch = (s.keywords || []).some((kw) => kw.toLowerCase().includes(q));
    return (
      s.titleEn.toLowerCase().includes(q) ||
      s.titleBn.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q) ||
      kwMatch
    );
  });

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary-teal" /> Medical Specialties Catalog
          </h3>
          <p className="text-xs text-muted-foreground">
            Live database records for doctor routing, clinical categorization, and patient consultation booking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search specialty, Bengali, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-card border border-card-border text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
            />
          </div>

          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Add Specialty
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-card-border text-[10px] uppercase font-bold text-muted-foreground bg-muted/40">
              <th className="py-2.5 px-3">Specialty / Category</th>
              <th className="py-2.5 px-3">Bangla Name</th>
              <th className="py-2.5 px-3">Active Doctors</th>
              <th className="py-2.5 px-3">Keywords</th>
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
                    <span>Loading specialties from database...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No matching medical specialties found in master database.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id || s.code} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-primary-teal/10 border border-primary-teal/20 flex items-center justify-center text-primary-teal shrink-0">
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-fg-app text-sm block">{s.titleEn}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">Code: {s.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-fg-app block">{s.titleBn}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-teal/10 text-primary-teal font-bold text-xs border border-primary-teal/20">
                      <Users className="h-3.5 w-3.5" />
                      {s.doctorCount || `${s.count ?? 0} Doctors`}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(s.keywords || []).slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground border border-card-border"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {kw}
                        </span>
                      ))}
                      {(s.keywords || []).length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{(s.keywords || []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onToggleStatus(s)}
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        s.status === "Active" || s.isActive !== false
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/30 hover:bg-rose-500/20"
                      }`}
                    >
                      {s.status === "Active" || s.isActive !== false ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {s.status === "Active" || s.isActive !== false ? "Active" : "Deprecated"}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewSpecialty(s)}
                        className="p-1.5 rounded-lg border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5 text-fg-app" />
                      </button>
                      <button
                        onClick={() => onEditSpecialty(s)}
                        className="p-1.5 rounded-lg border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
                        title="Edit Specialty"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary-teal" />
                      </button>
                      <button
                        onClick={() => onDeleteSpecialty(s)}
                        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-600 transition-colors"
                        title="Delete Specialty"
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
