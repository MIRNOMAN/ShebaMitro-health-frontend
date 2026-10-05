"use client";

import React from "react";
import Link from "next/link";
import { HeroMedicineAlarmWidget } from "@/features/patient/components/HeroMedicineAlarmWidget";
import {
  Activity,
  Heart,
  Calendar,
  Clock,
  FileText,
  FlaskConical,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Video,
  Pill,
  Download,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero Medicine Alarm Widget */}
      <HeroMedicineAlarmWidget />

      {/* Health Vitals Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">72</span>
            <span className="text-xs text-muted-foreground font-semibold">BPM</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Normal Resting Heart Rate
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">120 / 80</span>
            <span className="text-xs text-muted-foreground font-semibold">mmHg</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Optimal Range
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Fasting Blood Sugar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">5.6</span>
            <span className="text-xs text-muted-foreground font-semibold">mmol/L</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Normal Glycemic Level
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Body Mass Index (BMI)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">22.4</span>
            <span className="text-xs text-muted-foreground font-semibold">kg/m²</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Healthy Weight Category
          </span>
        </div>
      </div>
    </div>
  );
}
