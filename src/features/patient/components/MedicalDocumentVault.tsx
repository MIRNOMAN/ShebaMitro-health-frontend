"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  FlaskConical,
  Download,
  Search,
  CheckCircle2,
  Eye,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MedicalDocument {
  id: string;
  title: string;
  category: "Prescriptions" | "Lab Reports" | "Scans & Imaging";
  issuer: string;
  date: string;
  fileSize: string;
  thumbnailUrl?: string;
  downloadUrl: string;
}

const MOCK_DOCUMENTS: MedicalDocument[] = [
  {
    id: "doc-1",
    title: "Executive Full Body Checkup Report",
    category: "Lab Reports",
    issuer: "Popular Diagnostic Center",
    date: "Oct 2, 2026",
    fileSize: "3.4 MB PDF",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300&auto=format&fit=crop",
    downloadUrl: "#download-full-body",
  },
  {
    id: "doc-2",
    title: "Cardiology Consultation E-Prescription",
    category: "Prescriptions",
    issuer: "Prof. Dr. Syed Mahmudul Hasan",
    date: "Sep 28, 2026",
    fileSize: "1.2 MB PDF",
    thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop",
    downloadUrl: "#download-rx",
  },
  {
    id: "doc-3",
    title: "Chest X-Ray Digital Imaging Scan",
    category: "Scans & Imaging",
    issuer: "Square Hospitals Ltd.",
    date: "Sep 15, 2026",
    fileSize: "8.6 MB DICOM/PDF",
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=300&auto=format&fit=crop",
    downloadUrl: "#download-xray",
  },
  {
    id: "doc-4",
    title: "Diabetes Care & HbA1c Lab Report",
    category: "Lab Reports",
    issuer: "Labaid Diagnostics",
    date: "Aug 10, 2026",
    fileSize: "2.1 MB PDF",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300&auto=format&fit=crop",
    downloadUrl: "#download-hba1c",
  },
  {
    id: "doc-5",
    title: "Brain & Spine MRI Diagnostic Scan",
    category: "Scans & Imaging",
    issuer: "Evercare Hospital Dhaka",
    date: "Jul 22, 2026",
    fileSize: "14.2 MB PDF",
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=300&auto=format&fit=crop",
    downloadUrl: "#download-mri",
  },
];

export function MedicalDocumentVault() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchesCategory = activeCategory === "All" || doc.category === activeCategory;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleDownload = (id: string, title: string) => {
    setDownloadSuccessId(id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2000);
  };

  return (
    <div className="rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-7 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-black text-lg text-fg-app tracking-tight">Medical Document Vault</h2>
            <p className="text-xs text-muted-fg">
              Filterable vault for digital prescriptions, lab reports & imaging scans
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-accent/10 text-emerald-600 dark:text-emerald-400 border border-emerald-accent/20">
          <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit Encrypted Vault
        </span>
      </div>

      {/* Filter Ribbon & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["All", "Prescriptions", "Lab Reports", "Scans & Imaging"].map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-teal text-white shadow-xs"
                    : "border border-surface-border bg-muted-bg/40 hover:bg-surface-card-hover text-fg-app"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-fg pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report title or hospital..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-muted-bg/30 border border-surface-border text-xs text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal shadow-xs"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          const isDownloading = downloadSuccessId === doc.id;

          return (
            <div
              key={doc.id}
              className="group rounded-2xl border border-surface-border bg-surface-card p-4 space-y-3 hover:border-primary-teal/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Thumbnail Preview Image */}
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-surface-border">
                  {doc.thumbnailUrl ? (
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-fg">
                      <FileImage className="h-10 w-10" />
                    </div>
                  )}

                  {/* Category Pill Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-950/80 text-white border border-primary-teal/40 backdrop-blur-xs">
                    {doc.category}
                  </span>
                </div>

                {/* Title & Metadata */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-fg-app line-clamp-1 group-hover:text-primary-teal transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-muted-fg flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-primary-teal shrink-0" />
                    <span className="truncate">{doc.issuer}</span>
                  </p>
                  <p className="text-[11px] text-muted-fg flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{doc.date} • {doc.fileSize}</span>
                  </p>
                </div>
              </div>

              {/* 1-Click PDF Download Button */}
              <div className="pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => handleDownload(doc.id, doc.title)}
                  className={`w-full h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    isDownloading
                      ? "bg-emerald-accent text-white shadow-xs"
                      : "bg-muted-bg/60 hover:bg-surface-card-hover text-fg-app border border-surface-border"
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> PDF Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" /> 1-Click PDF Download
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
