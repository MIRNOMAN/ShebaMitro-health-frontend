"use client";

import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { LegalDocument } from "../types/legal";

interface LegalDocumentViewerProps {
  document: LegalDocument;
}

export function LegalDocumentViewer({ document }: LegalDocumentViewerProps) {
  return (
    <div className="space-y-6">
      {document.sections.map((sec) => (
        <section
          key={sec.id}
          id={sec.id}
          className="rounded-2xl border border-card-border bg-card p-6 space-y-3 shadow-xs scroll-mt-28"
        >
          <h3 className="text-base font-extrabold text-fg-app border-b border-card-border pb-2">
            {sec.title}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {sec.content}
          </p>

          {sec.bulletPoints && sec.bulletPoints.length > 0 && (
            <ul className="space-y-2 pt-2">
              {sec.bulletPoints.map((bp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-fg-app">
                  <CheckCircle2 className="h-4 w-4 text-primary-teal shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{bp}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Security Disclaimer footer */}
      <div className="p-4 bg-muted/40 border border-card-border rounded-2xl flex items-center gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-5 w-5 text-primary-teal shrink-0" />
        <span>
          ShebaMitro operates under the digital health regulations of Bangladesh Ministry of Health & DGDA guidelines. For legal inquiries, contact legal@shebamitro.health.
        </span>
      </div>
    </div>
  );
}
