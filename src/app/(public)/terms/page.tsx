"use client";

import React from "react";
import { TERMS_AND_CONDITIONS_DATA } from "@/features/legal/data/legalData";
import { LegalHeaderBanner } from "@/features/legal/components/LegalHeaderBanner";
import { LegalSectionNav } from "@/features/legal/components/LegalSectionNav";
import { LegalDocumentViewer } from "@/features/legal/components/LegalDocumentViewer";

export default function TermsAndConditionsPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <LegalHeaderBanner document={TERMS_AND_CONDITIONS_DATA} />

      {/* Main Grid with Sidebar TOC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <LegalSectionNav sections={TERMS_AND_CONDITIONS_DATA.sections} />
        </div>

        <div className="lg:col-span-8">
          <LegalDocumentViewer document={TERMS_AND_CONDITIONS_DATA} />
        </div>
      </div>
    </div>
  );
}
