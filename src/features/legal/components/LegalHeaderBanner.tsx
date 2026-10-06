"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Lock, Printer, Download } from "lucide-react";
import { LegalDocument } from "../types/legal";

interface LegalHeaderBannerProps {
  document: LegalDocument;
}

export function LegalHeaderBanner({ document }: LegalHeaderBannerProps) {
  const isTerms = document.docType === "TERMS";

  return (
    <div className="rounded-3xl border border-card-border bg-gradient-to-r from-card via-card to-primary-teal/10 p-6 sm:p-8 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20 uppercase">
              {document.version} Compliance
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Last Updated: {document.lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-fg-app mt-1 flex items-center gap-2.5">
            {isTerms ? <FileText className="h-7 w-7 text-primary-teal" /> : <Lock className="h-7 w-7 text-emerald-500" />}
            {document.title}
          </h1>
        </div>

        {/* Switcher & Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/terms"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isTerms
                ? "bg-primary-teal text-white shadow-xs"
                : "bg-card border border-card-border text-fg-app hover:bg-muted"
            }`}
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !isTerms
                ? "bg-primary-teal text-white shadow-xs"
                : "bg-card border border-card-border text-fg-app hover:bg-muted"
            }`}
          >
            Privacy Policy
          </Link>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-card-border bg-card hover:bg-muted text-fg-app transition-colors"
            title="Print Policy Document"
          >
            <Printer className="h-4 w-4 text-primary-teal" />
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {document.summaryNote}
      </p>
    </div>
  );
}
