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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-accent/10 via-primary-teal/10 to-surface-card p-6 sm:p-7 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Welcome back, <span className="text-primary-teal">Sabbir Ahmed</span> 👋
          </h1>
          <p className="text-xs text-muted-fg">
            Here is your daily health summary, active medicine alarms, and upcoming doctor appointments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/doctors">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-primary-teal text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer active:scale-95"
            >
              <Stethoscope className="h-4 w-4" /> Book Doctor
            </button>
          </Link>
          <Link href="/pharmacy">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-emerald-accent text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer active:scale-95"
            >
              <Pill className="h-4 w-4" /> Order Medicine
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Medicine Alarm Widget */}
      <HeroMedicineAlarmWidget />

      {/* Health Vitals Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">72</span>
            <span className="text-xs text-muted-fg font-bold">BPM</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Normal Resting Heart Rate
          </span>
        </div>

        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">120 / 80</span>
            <span className="text-xs text-muted-fg font-bold">mmHg</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Optimal Range
          </span>
        </div>

        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Fasting Blood Sugar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">5.6</span>
            <span className="text-xs text-muted-fg font-bold">mmol/L</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Normal Glycemic Level
          </span>
        </div>

        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Body Mass Index (BMI)</span>
            <div className="p-2 rounded-xl bg-violet-accent/10 text-violet-accent">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">22.4</span>
            <span className="text-xs text-muted-fg font-bold">kg/m²</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Healthy Weight Category
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column (Appointments & Alarms) + Right Column (Reports & Prescriptions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Appointment Banner */}
          <div className="rounded-3xl border border-primary-teal/30 bg-primary-teal/5 dark:bg-primary-teal/10 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-primary-teal/20 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Upcoming Consultation
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-accent text-white shadow-xs animate-pulse">
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
                <h3 className="font-black text-base text-fg-app">Prof. Dr. Syed Mahmudul Hasan</h3>
                <p className="text-xs font-bold text-primary-teal">Cardiology & Heart Care</p>
                <p className="text-xs text-muted-fg">Square Hospitals Ltd. • Panthapath Chamber</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <span className="text-xs text-muted-fg font-medium">Serial #08 • Booking Ref: SM-489201</span>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-emerald-accent text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer active:scale-95"
              >
                <Video className="h-4 w-4" /> Join Teleconsultation Room
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Columns */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Diagnostic Reports */}
          <div className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-black text-base text-fg-app flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-violet-accent" /> Recent Lab Reports
              </h3>
              <Link href="/diagnostics" className="text-xs font-bold text-primary-teal hover:underline">
                Book Test
              </Link>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl border border-surface-border bg-muted-bg/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-black text-fg-app">
                  <span>Executive Full Body Checkup</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-accent/10 px-2 py-0.5 rounded-lg border border-emerald-accent/20">
                    Completed
                  </span>
                </div>
                <p className="text-[11px] text-muted-fg">Popular Diagnostic Center • Oct 2, 2026</p>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-teal/10 text-primary-teal font-bold text-xs border border-primary-teal/20 hover:bg-primary-teal/20 transition-all cursor-pointer active:scale-95"
                >
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
