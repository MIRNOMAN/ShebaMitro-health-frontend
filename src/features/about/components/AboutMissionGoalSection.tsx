"use client";

import React from "react";
import { Target, Compass, CheckCircle2, Award } from "lucide-react";
import { OUR_MISSION_DATA, OUR_GOAL_DATA } from "../data/aboutData";

export function AboutMissionGoalSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-teal/10 text-primary-teal text-xs font-bold">
          <Award className="h-3.5 w-3.5" /> Our Strategic Vision
        </div>
        <h2 className="text-2xl font-black text-fg-app">Driven by Purpose, Guided by Impact</h2>
        <p className="text-xs text-muted-foreground">
          Discover the core mission and strategic long-term goals steering ShebaMitro's digital healthcare platform.
        </p>
      </div>

      {/* Grid: Mission & Goal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission Card */}
        <div className="rounded-3xl border border-card-border bg-gradient-to-br from-card via-card to-primary-teal/5 p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden group hover:border-primary-teal/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20 shrink-0">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-teal font-mono">
                Purpose Statement
              </span>
              <h3 className="text-xl font-extrabold text-fg-app">{OUR_MISSION_DATA.title}</h3>
            </div>
          </div>

          <p className="text-xs font-bold text-primary-teal leading-snug">
            "{OUR_MISSION_DATA.tagline}"
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {OUR_MISSION_DATA.summary}
          </p>

          <div className="space-y-2 pt-2 border-t border-card-border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Mission Pillars & Commitments:
            </span>
            <ul className="space-y-2 text-xs text-fg-app">
              {OUR_MISSION_DATA.keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary-teal shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Goal Card */}
        <div className="rounded-3xl border border-card-border bg-gradient-to-br from-card via-card to-emerald-500/5 p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 font-mono">
                Long-Term Horizon
              </span>
              <h3 className="text-xl font-extrabold text-fg-app">{OUR_GOAL_DATA.title}</h3>
            </div>
          </div>

          <p className="text-xs font-bold text-emerald-600 leading-snug">
            "{OUR_GOAL_DATA.tagline}"
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {OUR_GOAL_DATA.summary}
          </p>

          <div className="space-y-2 pt-2 border-t border-card-border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Target Milestones (2026-2028):
            </span>
            <ul className="space-y-2 text-xs text-fg-app">
              {OUR_GOAL_DATA.keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
