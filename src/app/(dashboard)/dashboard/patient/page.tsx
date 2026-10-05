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
  AlertCircle,
  Pill,
  Download,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientDashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Patient Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-primary-teal/10 to-background p-6 rounded-2xl border border-card-border">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Welcome back, <span className="text-primary-teal">Sabbir Ahmed</span> 👋
          </h1>
          <p className="text-xs text-muted-foreground">
            Here is your daily health summary, active medicine alarms, and upcoming doctor appointments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/doctors">
            <Button variant="primary" size="sm">
              <Stethoscope className="h-4 w-4 mr-1.5" /> Book Doctor
            </Button>
          </Link>
          <Link href="/pharmacy">
            <Button variant="emerald" size="sm">
              <Pill className="h-4 w-4 mr-1.5" /> Order Medicine
            </Button>
          </Link>
        </div>
      </div>

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

      {/* Main Grid: Left Column (Appointments & Alarms) + Right Column (Reports & Prescriptions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Appointment Banner */}
          <div className="rounded-2xl border border-primary-teal/30 bg-primary-teal/5 dark:bg-primary-teal/10 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-primary-teal/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Upcoming Consultation
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
                Today at 05:30 PM
              </span>
            </div>

            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop"
                alt="Doctor"
                className="h-16 w-16 rounded-2xl object-cover border-2 border-primary-teal/40"
              />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-fg-app">Prof. Dr. Syed Mahmudul Hasan</h3>
                <p className="text-xs font-semibold text-primary-teal">Cardiology & Heart Care</p>
                <p className="text-xs text-muted-foreground">Square Hospitals Ltd. • Panthapath Chamber</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground font-medium">Serial #08 • Booking Ref: SM-489201</span>
              <Button variant="emerald" size="sm">
                <Video className="h-4 w-4 mr-1.5" /> Join Teleconsultation Room
              </Button>
            </div>
          </div>
        </div>

        {/* Right 5 Columns */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Diagnostic Reports */}
          <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h3 className="font-bold text-base text-fg-app flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-purple-500" /> Recent Lab Reports
              </h3>
              <Link href="/diagnostics" className="text-xs font-semibold text-primary-teal hover:underline">
                Book Test
              </Link>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-card-border bg-surface-card-hover/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-fg-app">
                  <span>Executive Full Body Checkup</span>
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Completed
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Popular Diagnostic Center • Oct 2, 2026</p>
                <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary-teal/10 text-primary-teal font-semibold text-xs border border-primary-teal/20 hover:bg-primary-teal/20 transition-colors">
                  <Download className="h-3.5 w-3.5" /> Download Report (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
