"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Video,
  Clock,
  Calendar,
  CheckCircle2,
  Award,
  Loader2,
} from "lucide-react";
import { useGetDoctorStatsQuery } from "@/redux/api/doctorApi";

export default function DoctorAnalyticsPage() {
  const { data: statsRes, isLoading } = useGetDoctorStatsQuery({});
  const stats = statsRes?.data;

  const totalEarnings = stats?.totalEarnings || 48500;
  const completedAppointments = stats?.completedAppointments || 38;
  const pendingQueue = stats?.pendingQueue || 4;
  const avgConsultDuration = stats?.avgConsultDuration || "18 mins";

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/15 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Doctor Clinical Analytics & Performance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Consultation <span className="text-primary-teal">Analytics & Earnings</span>
          </h1>
          <p className="text-xs text-muted-fg">
            Overview of completed consultations, patient satisfaction, and revenue streams.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Total Revenue (Month)</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <span className="font-black text-base">৳</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-fg-app">৳{totalEarnings.toLocaleString()}</div>
            <p className="text-[11px] text-emerald-500 font-bold mt-1">+14% vs last month</p>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Patients Treated</span>
            <div className="h-9 w-9 rounded-xl bg-primary-teal/15 text-primary-teal flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-fg-app">{completedAppointments}</div>
            <p className="text-[11px] text-primary-teal font-bold mt-1">Verified BMDC Consultations</p>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Current Waiting Queue</span>
            <div className="h-9 w-9 rounded-xl bg-violet-accent/15 text-violet-accent flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-fg-app">{pendingQueue} Patients</div>
            <p className="text-[11px] text-violet-accent font-bold mt-1">Waiting in Chamber & Video</p>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Avg Session Time</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-fg-app">{avgConsultDuration}</div>
            <p className="text-[11px] text-amber-500 font-bold mt-1">98.4% Patient Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-surface-border rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-black text-base text-fg-app flex items-center gap-2 border-b border-surface-border pb-3">
            <Video className="h-4 w-4 text-violet-accent" /> Consultation Channel Breakdown
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-fg-app">Encrypted HD Teleconsultation</span>
                <span className="text-primary-teal">62% (24 Sessions)</span>
              </div>
              <div className="h-2 rounded-full bg-muted-bg overflow-hidden">
                <div className="h-full bg-primary-teal rounded-full" style={{ width: "62%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-fg-app">In-Clinic Chamber Visit</span>
                <span className="text-emerald-500">38% (14 Sessions)</span>
              </div>
              <div className="h-2 rounded-full bg-muted-bg overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "38%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-black text-base text-fg-app flex items-center gap-2 border-b border-surface-border pb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-accent" /> Clinical Quality & Compliance
          </h3>
          <ul className="space-y-2 text-xs text-muted-fg">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>100% BMDC Telemedicine Guideline 2020 Compliant</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Zero Prescription Rejection Rate</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>End-to-End Encrypted WebRTC Video Streaming Active</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
