"use client";

import React from "react";
import {
  ShieldCheck,
  Clock,
  Pill,
  FileText,
  Calendar,
  AlertTriangle,
  Heart,
  CheckCircle2,
  Video,
  Download,
  Stethoscope,
} from "lucide-react";
import { FamilyMember } from "../types/family";
import { Button } from "@/components/ui/button";

interface DependentHealthViewProps {
  member: FamilyMember;
}

export function DependentHealthView({ member }: DependentHealthViewProps) {
  return (
    <div className="space-y-6">
      {/* Active Member Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl border border-primary-teal/30 bg-primary-teal/5 dark:bg-primary-teal/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-primary-teal shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-lg text-fg-app">{member.name}</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-teal text-white shadow-xs">
                {member.relationship} ({member.age} Yrs)
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-surface-card border border-surface-border text-coral-accent">
                Blood Group: {member.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-muted-fg pt-1">
              Emergency Contact: <span className="font-bold text-fg-app">{member.emergencyPhone}</span>
            </p>
          </div>
        </div>

        {/* Chronic Conditions & Allergy Badges */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
          {member.chronicConditions.map((cond, i) => (
            <span
              key={i}
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
            >
              {cond}
            </span>
          ))}
          {member.allergies.map((alg, i) => (
            <span
              key={i}
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25 flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" /> Allergy: {alg}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid: Alarms (Left) + Appointments & Prescriptions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dependent Medicine Alarms (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h4 className="font-black text-base text-fg-app flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" /> {member.name}'s Medicine Alarms ({member.alarms.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {member.alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="p-3.5 rounded-2xl border border-surface-border bg-muted-bg/30 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary-teal/10 text-primary-teal font-bold flex items-center justify-center border border-primary-teal/20">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-black text-fg-app block">{alarm.medicineName}</span>
                      <span className="text-[11px] text-muted-fg font-medium">
                        {alarm.dosage} • {alarm.time}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                      alarm.status === "TAKEN"
                        ? "bg-emerald-accent/10 text-emerald-600 dark:text-emerald-400 border-emerald-accent/20"
                        : alarm.status === "DUE_NOW"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
                        : "bg-muted-bg text-muted-fg border-surface-border"
                    }`}
                  >
                    {alarm.status === "TAKEN" ? "Taken ✓" : alarm.status === "DUE_NOW" ? "Due Now ⏱" : "Upcoming"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dependent Appointments & Prescriptions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Appointments */}
          <div className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h4 className="font-black text-base text-fg-app flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-teal" /> Upcoming Appointments
              </h4>
            </div>

            <div className="space-y-2.5">
              {member.appointments.length > 0 ? (
                member.appointments.map((ap) => (
                  <div
                    key={ap.id}
                    className="p-3.5 rounded-2xl border border-surface-border bg-muted-bg/30 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-black text-fg-app">
                      <span>{ap.doctorName}</span>
                      <span className="text-[10px] text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded-lg border border-primary-teal/20">
                        {ap.specialty}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-fg">
                      {ap.chamber} • <span className="font-bold text-emerald-accent">{ap.dateTime}</span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-fg italic py-2">No upcoming appointments scheduled.</p>
              )}
            </div>
          </div>

          {/* Prescriptions */}
          <div className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h4 className="font-black text-base text-fg-app flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-accent" /> Digital Prescriptions
              </h4>
            </div>

            <div className="space-y-2.5">
              {member.prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-3.5 rounded-2xl border border-surface-border bg-muted-bg/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-black text-fg-app block">{rx.title}</span>
                    <span className="text-[11px] text-muted-fg">
                      {rx.doctorName} • {rx.date} ({rx.medicinesCount} Meds)
                    </span>
                  </div>
                  <button className="p-2 rounded-xl bg-emerald-accent/10 text-emerald-accent hover:bg-emerald-accent/20 transition-colors cursor-pointer active:scale-95">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
