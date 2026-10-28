"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Users,
  Search,
  Loader2,
  CheckCircle2,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDoctorAppointmentsQuery } from "@/redux/api/doctorApi";

export default function DoctorAppointmentsSchedulePage() {
  const [filter, setFilter] = useState<"ALL" | "ONLINE" | "CHAMBER">("ALL");
  const { data: appointmentsRes, isLoading, refetch } = useGetDoctorAppointmentsQuery({});
  const appointments = appointmentsRes?.data || [];

  const filtered = appointments.filter((a: any) => {
    if (filter !== "ALL" && a.type !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/15 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Doctor Consultation Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Today&apos;s <span className="text-primary-teal">Appointments</span>
          </h1>
          <p className="text-xs text-muted-fg">
            Real-time schedule of your in-clinic consultations and live video teleconsultation sessions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="text-xs font-bold rounded-xl"
        >
          Refresh Schedule
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {(["ALL", "ONLINE", "CHAMBER"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === t
                ? "bg-primary-teal text-white shadow-xs"
                : "text-muted-fg hover:bg-muted-bg"
            }`}
          >
            {t === "ALL" ? "All Appointments" : t === "ONLINE" ? "Online Video" : "Chamber Visit"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-fg space-y-3">
          <Loader2 className="w-6 h-6 text-primary-teal animate-spin mx-auto" />
          <p className="text-xs font-bold">Loading schedule from database...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((appt: any) => {
            const isOnline = appt.type === "ONLINE";
            const patientName = appt.patient?.user?.name || appt.patient?.name || "Patient";
            const time = new Date(appt.slotStartTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={appt.id}
                className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-4 shadow-sm hover:border-primary-teal/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isOnline
                          ? "bg-violet-accent/10 text-violet-accent border-violet-accent/20"
                          : "bg-emerald-accent/10 text-emerald-accent border-emerald-accent/20"
                      }`}
                    >
                      {isOnline ? "Video Teleconsult" : "In-Clinic Chamber"}
                    </span>
                    <span className="text-xs font-bold text-fg-app flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary-teal" />
                      {time}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-fg-app">{patientName}</h3>
                    <p className="text-xs text-muted-fg mt-0.5">
                      Ref: SM-{appt.id.slice(0, 6).toUpperCase()} • Status: {appt.status}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center gap-2">
                  {isOnline ? (
                    <Link href={`/teleconsult/${appt.id}`} className="flex-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full gap-1.5 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        <Video className="h-3.5 w-3.5" /> Join Room
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/doctor/rx-writer?appointmentId=${appt.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        <PenTool className="h-3.5 w-3.5" /> Open EHR & Rx
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center space-y-3 bg-surface-card border border-surface-border rounded-3xl text-muted-fg">
          <Calendar className="h-10 w-10 mx-auto text-muted-fg/40" />
          <p className="text-sm font-bold text-fg-app">No appointments scheduled</p>
          <p className="text-xs max-w-sm mx-auto">
            Your daily appointments will display here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
