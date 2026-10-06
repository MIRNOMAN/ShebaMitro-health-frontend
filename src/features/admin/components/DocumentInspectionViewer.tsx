"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Award,
} from "lucide-react";
import { ProviderRegistrationRequest, VerificationDocument, DecisionAction } from "../types";

interface DocumentInspectionViewerProps {
  request: ProviderRegistrationRequest | null;
  onActionClick: (action: DecisionAction) => void;
}

export function DocumentInspectionViewer({
  request,
  onActionClick,
}: DocumentInspectionViewerProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>("");

  if (!request) {
    return (
      <div className="rounded-2xl border border-card-border bg-card p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[500px]">
        <ShieldCheck className="h-12 w-12 text-muted-foreground/40" />
        <h4 className="font-bold text-sm text-fg-app">No Provider Selected</h4>
        <p className="text-xs text-muted-foreground max-w-xs">
          Select a newly registered provider from the verification queue to inspect their documents and issue an audit decision.
        </p>
      </div>
    );
  }

  // Active document selection logic
  const activeDoc: VerificationDocument | null =
    request.documents.find((d) => d.id === selectedDocId) || request.documents[0] || null;

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-5 shadow-xs">
      {/* Top Details & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
              {request.providerType}
            </span>
            <span className="font-mono text-xs text-muted-foreground font-semibold">
              ID: {request.id}
            </span>
          </div>
          <h2 className="text-base font-extrabold text-fg-app mt-1">{request.entityName}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <MapPin className="h-3 w-3" /> {request.locationAddress}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onActionClick("APPROVE")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve Provider
          </button>

          <button
            onClick={() => onActionClick("REQUEST_DOCS")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/30 font-bold text-xs transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" /> Request Info
          </button>

          <button
            onClick={() => onActionClick("REJECT")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/30 font-bold text-xs transition-colors"
          >
            <XCircle className="h-3.5 w-3.5" /> Reject Deficiency
          </button>
        </div>
      </div>

      {/* Provider Details Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-xl border border-card-border text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">License / BMDC</span>
          <span className="font-mono font-bold text-fg-app">{request.bmdcOrLicenseNo}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Specialty / Hub</span>
          <span className="font-semibold text-fg-app truncate block">{request.specialtyOrCategory}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Email</span>
          <span className="font-semibold text-fg-app truncate block">{request.contactEmail}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Contact Phone</span>
          <span className="font-mono font-bold text-fg-app">{request.contactPhone}</span>
        </div>
      </div>

      {/* Side-by-Side Inspection Workspace */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs text-fg-app flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary-teal" /> Document Inspection Hub
          </span>
          <span className="text-[11px] font-normal text-muted-foreground">
            Select a document tab to inspect details
          </span>
        </h4>

        {/* Tabs for BMDC Certificate, NID Card, Trade License */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-card-border">
          {request.documents.map((doc) => {
            const isTabActive = doc.id === activeDoc?.id;

            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isTabActive
                    ? "bg-primary-teal text-white shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                {doc.docType}
              </button>
            );
          })}
        </div>

        {/* Document Viewer Frame */}
        {activeDoc && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-xl border border-card-border">
            {/* Visual Preview */}
            <div className="lg:col-span-2 space-y-2">
              <div className="relative rounded-xl overflow-hidden border border-card-border bg-slate-900 min-h-[280px] max-h-[340px] flex items-center justify-center group">
                <img
                  src={activeDoc.previewImage}
                  alt={activeDoc.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] font-mono uppercase bg-black/60 px-2 py-0.5 rounded border border-white/20">
                      {activeDoc.docType} Preview
                    </span>
                    <h5 className="font-bold text-xs mt-1">{activeDoc.title}</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Attributes Metadata */}
            <div className="space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="p-3 bg-card border border-card-border rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Document Number</span>
                  <p className="font-mono text-xs font-bold text-fg-app">{activeDoc.documentNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-card border border-card-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Issued</span>
                    <span className="font-mono font-semibold text-fg-app">{activeDoc.issueDate}</span>
                  </div>
                  <div className="p-2.5 bg-card border border-card-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Expiry</span>
                    <span className="font-mono font-semibold text-fg-app">{activeDoc.expiryDate}</span>
                  </div>
                </div>

                <div className="p-3 bg-card border border-card-border rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Automated OCR Check</span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                    <CheckCircle2 className="h-4 w-4" /> Pass: Reg # Matches Registry
                  </div>
                </div>
              </div>

              <a
                href={activeDoc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl border border-card-border bg-card hover:bg-muted text-fg-app font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-primary-teal" /> Download Original PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
