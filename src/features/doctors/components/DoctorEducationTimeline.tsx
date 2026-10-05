"use client";

import React from "react";
import { GraduationCap, Award, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { EducationItem } from "../types";

interface DoctorEducationTimelineProps {
  qualifications: string[];
  timeline?: EducationItem[];
}

export function DoctorEducationTimeline({
  qualifications,
  timeline,
}: DoctorEducationTimelineProps) {
  // Fallback timeline if timeline not provided
  const educationList: EducationItem[] = timeline && timeline.length > 0
    ? timeline
    : [
        {
          degree: qualifications[0] || "MBBS",
          institution: "Dhaka Medical College & Hospital",
          year: "2006",
          location: "Dhaka, Bangladesh",
          description: "Completed Bachelor of Medicine and Bachelor of Surgery with Distinction.",
        },
        {
          degree: qualifications[1] || "FCPS",
          institution: "Bangladesh College of Physicians & Surgeons (BCPS)",
          year: "2012",
          location: "Dhaka, Bangladesh",
          description: "Post-graduate Fellowship in Clinical Specialty.",
        },
        {
          degree: qualifications[2] || "MD / Fellowship",
          institution: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
          year: "2016",
          location: "Dhaka, Bangladesh",
          description: "Advanced Doctor of Medicine specialization.",
        },
      ];

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-xs">
      <div className="flex items-center gap-2.5 pb-4 border-b border-card-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-fg-app">Educational Journey & Credentials</h3>
          <p className="text-xs text-muted-foreground">Academic qualifications & specialized training</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary-teal before:via-emerald-500 before:to-transparent">
        {educationList.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Bullet Node */}
            <div className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-card border-2 border-primary-teal text-primary-teal group-hover:bg-primary-teal group-hover:text-white transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>

            <div className="space-y-1 bg-surface-card-hover/40 p-4 rounded-xl border border-card-border/60 hover:border-primary-teal/40 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-fg-app flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary-teal" />
                  {item.degree}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
                  <Calendar className="h-3 w-3" /> {item.year}
                </span>
              </div>

              <p className="text-xs font-semibold text-fg-app/90">
                {item.institution}
              </p>

              {item.location && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-coral-accent" /> {item.location}
                </p>
              )}

              {item.description && (
                <p className="text-xs text-muted-foreground pt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
