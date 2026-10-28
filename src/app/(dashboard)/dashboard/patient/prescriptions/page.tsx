"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Stethoscope,
  Pill,
  Download,
  Calendar,
  Search,
  Plus,
  Loader2,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetPrescriptionsQuery } from "@/redux/api/prescriptionApi";

export default function PatientPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: prescriptions, isLoading } = useGetPrescriptionsQuery();

  const list = prescriptions || [];

  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((rx) => {
      const doc = (rx.doctor?.name || "").toLowerCase();
      const spec = (rx.doctor?.specialization || "").toLowerCase();
      const diag = (rx.diagnosis || "").toLowerCase();
      const meds = (rx.items || []).map((i) => i.medicineName.toLowerCase()).join(" ");
      return doc.includes(q) || spec.includes(q) || diag.includes(q) || meds.includes(q);
    });
  }, [list, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-accent/10 via-primary-teal/10 to-surface-card p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> BMDC Verified Digital Prescriptions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            My Digital <span className="text-primary-teal">E-Prescriptions</span>
          </h1>
          <p className="text-xs text-muted-fg">
            Cryptographically verified electronic prescriptions, dosage instructions & 1-click pharmacy order.
          </p>
        </div>

        <Link href="/doctors">
          <Button variant="primary" size="sm" className="gap-2 text-xs font-bold rounded-xl cursor-pointer">
            <Plus className="h-4 w-4" /> Consult Doctor for New Rx
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-surface-card p-3 rounded-2xl border border-surface-border">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor, medicine name, or diagnosis..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted-bg/50 border border-surface-border text-xs text-fg-app placeholder:text-muted-fg/70 outline-none focus:border-primary-teal"
          />
        </div>
        <span className="text-xs font-bold text-muted-fg px-2 shrink-0">
          {filteredPrescriptions.length} Prescriptions Found
        </span>
      </div>

      {/* Prescriptions List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-3xl border border-surface-border bg-surface-card animate-pulse space-y-4">
              <div className="h-4 bg-muted-bg/60 rounded w-1/3" />
              <div className="h-3 bg-muted-bg/40 rounded w-1/2" />
              <div className="h-16 bg-muted-bg/30 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-surface-border bg-surface-card text-center space-y-3">
          <FileText className="h-12 w-12 text-muted-fg mx-auto opacity-40" />
          <h3 className="font-bold text-base text-fg-app">No Prescriptions Found</h3>
          <p className="text-xs text-muted-fg max-w-sm mx-auto">
            {searchQuery
              ? `No prescriptions matched "${searchQuery}".`
              : "You do not have any prescriptions recorded yet. Prescriptions issued by doctors will automatically appear here."}
          </p>
          <div className="pt-2">
            <Link href="/doctors">
              <Button variant="primary" size="sm" className="gap-2 text-xs">
                <span>Book a Doctor Consultation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrescriptions.map((rx) => {
            const dateStr = new Date(rx.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={rx.id}
                className="p-6 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-4 flex flex-col justify-between hover:border-primary-teal/40 transition-all"
              >
                <div className="space-y-4">
                  {/* Doctor & Date Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-surface-border pb-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20 flex items-center justify-center font-black shrink-0">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-fg-app">
                          {rx.doctor?.name || "Specialist Doctor"}
                        </h3>
                        <p className="text-xs font-bold text-primary-teal">
                          {rx.doctor?.specialization || "General Specialist"}
                        </p>
                        <p className="text-[11px] text-muted-fg flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {rx.doctor?.hospital || "Hospital Consultation"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-muted-fg flex items-center gap-1 justify-end">
                        <Calendar className="h-3 w-3" /> {dateStr}
                      </span>
                      {rx.doctor?.bmdcRegNo && (
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 block pt-0.5">
                          BMDC: {rx.doctor.bmdcRegNo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  {rx.diagnosis && (
                    <div className="p-3 rounded-2xl bg-primary-teal/5 border border-primary-teal/15 text-xs">
                      <span className="font-bold text-muted-fg text-[10px] uppercase block">Diagnosis:</span>
                      <p className="font-extrabold text-fg-app pt-0.5">{rx.diagnosis}</p>
                    </div>
                  )}

                  {/* Medicines List */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-muted-fg flex items-center gap-1.5">
                      <Pill className="h-3.5 w-3.5 text-primary-teal" /> Prescribed Medications ({rx.items?.length || 0})
                    </span>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(rx.items || []).map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-3 rounded-2xl border border-surface-border bg-muted-bg/30 text-xs flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-black text-fg-app">{item.medicineName}</p>
                            <p className="text-[11px] text-muted-fg">
                              {item.mealTiming?.replace(/_/g, " ")} • {item.durationDays} Days
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-xl bg-surface-card border border-surface-border text-primary-teal font-extrabold text-xs">
                            {item.schedulePattern}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-surface-border flex items-center gap-2">
                  <Link href="/pharmacy" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full gap-1.5 text-xs font-bold rounded-xl">
                      <Pill className="h-3.5 w-3.5" /> Order via Pharmacy
                    </Button>
                  </Link>
                  {rx.pdfUrl ? (
                    <a
                      href={rx.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-muted-bg hover:bg-muted-bg/80 border border-surface-border text-fg-app text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

