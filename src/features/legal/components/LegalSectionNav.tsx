"use client";

import React from "react";
import { List, ChevronRight } from "lucide-react";
import { LegalSection } from "../types/legal";

interface LegalSectionNavProps {
  sections: LegalSection[];
  activeSectionId?: string;
}

export function LegalSectionNav({ sections }: LegalSectionNavProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-4 space-y-3 shadow-xs sticky top-24">
      <h4 className="font-extrabold text-xs text-fg-app flex items-center gap-2 border-b border-card-border pb-2">
        <List className="h-4 w-4 text-primary-teal" /> Table of Contents
      </h4>

      <nav className="space-y-1">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-primary-teal hover:bg-muted/50 transition-colors flex items-center justify-between group"
          >
            <span className="truncate">{sec.title}</span>
            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        ))}
      </nav>
    </div>
  );
}
