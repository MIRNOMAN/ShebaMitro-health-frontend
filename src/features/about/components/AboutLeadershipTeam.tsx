"use client";

import React from "react";
import { UserCheck } from "lucide-react";
import { MOCK_LEADERSHIP_TEAM } from "../data/aboutData";

export function AboutLeadershipTeam() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-teal/10 text-primary-teal text-xs font-bold">
          <UserCheck className="h-3.5 w-3.5" /> Medical Board & Leadership
        </div>
        <h2 className="text-2xl font-black text-fg-app">Guided by Clinical Experts</h2>
        <p className="text-xs text-muted-foreground">
          Combines senior medical professors, pharmacy logistics veterans, and software architects.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_LEADERSHIP_TEAM.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-card-border bg-card p-5 space-y-3 shadow-xs hover:border-primary-teal/40 transition-all group"
          >
            <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-900 border border-card-border">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-fg-app">{member.name}</h3>
              <p className="text-xs font-bold text-primary-teal">{member.role}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{member.bmdcOrTitle}</p>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-card-border">
              {member.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
