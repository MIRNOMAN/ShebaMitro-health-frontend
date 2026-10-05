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
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-card-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-fg-app">Medical Document Vault</h2>
            <p className="text-xs text-muted-foreground">
              Filterable vault for digital prescriptions, lab reports & imaging scans
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
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
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary-teal text-white border border-primary-teal shadow-xs"
                    : "border border-card-border bg-card hover:bg-muted/40 text-fg-app"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report title or hospital..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-card border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal shadow-xs"
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
              className="group rounded-2xl border border-card-border bg-card p-4 space-y-3 hover:border-luminous transition-all duration-300 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Thumbnail Preview Image */}
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-card-border/60">
                  {doc.thumbnailUrl ? (
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <FileImage className="h-10 w-10" />
                    </div>
                  )}

                  {/* Category Pill Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-white border border-primary-teal/40 backdrop-blur-xs">
                    {doc.category}
                  </span>
                </div>

                {/* Title & Metadata */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-fg-app line-clamp-1 group-hover:text-primary-teal transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-primary-teal shrink-0" />
                    <span className="truncate">{doc.issuer}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{doc.date} • {doc.fileSize}</span>
                  </p>
                </div>
              </div>

              {/* 1-Click PDF Download Button */}
              <div className="pt-2 border-t border-card-border">
                <Button
                  variant={isDownloading ? "emerald" : "outline"}
                  size="sm"
                  onClick={() => handleDownload(doc.id, doc.title)}
                  className="w-full h-9 justify-center text-xs"
                >
                  {isDownloading ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> PDF Downloaded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" /> 1-Click PDF Download
                    </span>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
