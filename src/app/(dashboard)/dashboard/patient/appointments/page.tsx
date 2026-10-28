"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
  Search,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetPatientAppointmentsQuery } from "@/redux/api/doctorApi";

export default function PatientAppointmentsPage() {
  const [filterTab, setFilterTab] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: appointmentsRes, isLoading, refetch } = useGetPatientAppointmentsQuery();

  const appointments = useMemo(() => {
    const list = appointmentsRes?.data;
    if (Array.isArray(list)) return list;
    return [];
  }, [appointmentsRes]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter((appt: any) => {
      // Tab filter
      const apptDate = new Date(appt.slotStartTime);
      if (filterTab === "UPCOMING") {
        if (appt.status === "CANCELLED" || apptDate < now) return false;
      } else if (filterTab === "COMPLETED") {
        if (appt.status !== "COMPLETED" && apptDate >= now) return false;
      } else if (filterTab === "CANCELLED") {
        if (appt.status !== "CANCELLED") return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const docName = (appt.doctor?.name || appt.doctor?.user?.name || "").toLowerCase();
        const spec = (appt.doctor?.specialization || "").toLowerCase();
        const hosp = (appt.doctor?.hospital || "").toLowerCase();
        return docName.includes(q) || spec.includes(q) || hosp.includes(q);
      }

      return true;
    });
  }, [appointments, filterTab, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/10 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Doctor Appointments & Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            My Doctor <span className="text-primary-teal">Consultations</span>
          </h1>
          <p className="text-xs text-muted-fg">
            View, track and join your live telemedicine video calls or in-clinic chamber appointments.
          </p>
        </div>

        <Link href="/doctors">
          <Button variant="primary" size="sm" className="gap-2 text-xs font-bold rounded-xl cursor-pointer">
            <Plus className="h-4 w-4" /> Book New Specialist
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-card p-3 rounded-2xl border border-surface-border">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "UPCOMING", "COMPLETED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterTab === tab
                  ? "bg-primary-teal text-white shadow-xs"
                  : "text-muted-fg hover:bg-muted-bg/60 hover:text-fg-app"
              }`}
            >
              {tab === "ALL"
                ? "All"
                : tab === "UPCOMING"
                ? "Upcoming"
                : tab === "COMPLETED"
                ? "Completed"
                : "Cancelled"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor or hospital..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted-bg/50 border border-surface-border text-xs text-fg-app placeholder:text-muted-fg/70 outline-none focus:border-primary-teal"
          />
        </div>
      </div>

      {/* Appointment Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-surface-border bg-surface-card animate-pulse space-y-3">
              <div className="h-4 bg-muted-bg/60 rounded w-1/3" />
              <div className="h-3 bg-muted-bg/40 rounded w-1/2" />
              <div className="h-10 bg-muted-bg/30 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-surface-border bg-surface-card text-center space-y-3">
          <Calendar className="h-12 w-12 text-muted-fg mx-auto opacity-40" />
          <h3 className="font-bold text-base text-fg-app">No Appointments Found</h3>
          <p className="text-xs text-muted-fg max-w-sm mx-auto">
            {searchQuery
              ? `No appointments match your search "${searchQuery}".`
              : "You do not have any scheduled doctor appointments in this section."}
          </p>
          <div className="pt-2">
            <Link href="/doctors">
              <Button variant="primary" size="sm" className="gap-2 text-xs">
                <span>Browse Verified Doctors</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((appt: any) => {
            const isVideo = appt.type === "ONLINE";
            const dateObj = new Date(appt.slotStartTime);
            const dateStr = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            const statusColors: Record<string, string> = {
              CONFIRMED: "bg-emerald-accent/10 text-emerald-600 dark:text-emerald-400 border-emerald-accent/30",
              PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
              COMPLETED: "bg-primary-teal/10 text-primary-teal border-primary-teal/30",
              CANCELLED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
            };
            const statusClass = statusColors[appt.status] || "bg-muted-bg text-muted-fg border-surface-border";

            return (
              <div
                key={appt.id}
                className="p-5 rounded-3xl border border-surface-border bg-surface-card space-y-4 shadow-xs hover:border-primary-teal/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${statusClass}`}>
                      {appt.status}
                    </span>
                    <span className="text-[11px] font-bold text-muted-fg flex items-center gap-1">
                      {isVideo ? (
                        <>
                          <Video className="h-3.5 w-3.5 text-violet-accent" />
                          <span>Video Call</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="h-3.5 w-3.5 text-coral-accent" />
                          <span>Chamber Visit</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-primary-teal/10 text-primary-teal flex items-center justify-center font-black shrink-0 border border-primary-teal/20">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-sm text-fg-app truncate">
                        {appt.doctor?.name || appt.doctor?.user?.name || "Specialist Doctor"}
                      </h3>
                      <p className="text-xs font-bold text-primary-teal truncate">
                        {appt.doctor?.specialization || "General Specialist"}
                      </p>
                      <p className="text-[11px] text-muted-fg truncate">
                        {appt.doctor?.hospital || "Hospital Consultation Center"}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time Pill */}
                  <div className="p-3 rounded-2xl bg-muted-bg/50 border border-surface-border/60 flex items-center justify-between text-xs font-bold">
                    <span className="text-fg-app flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary-teal" />
                      {dateStr}
                    </span>
                    <span className="text-primary-teal flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {timeStr}
                    </span>
                  </div>

                  {/* Booking ID & Fee */}
                  <div className="flex items-center justify-between text-[11px] text-muted-fg pt-1">
                    <span>Ref: SM-{appt.id.slice(0, 6).toUpperCase()}</span>
                    <span>Fee: ৳{appt.doctor?.consultFee || 1000}</span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-2 border-t border-surface-border/60">
                  {isVideo && appt.status !== "CANCELLED" ? (
                    <Link href={`/teleconsult/${appt.id}`} className="block">
                      <Button variant="primary" size="sm" className="w-full gap-2 text-xs font-bold rounded-xl">
                        <Video className="h-3.5 w-3.5" />
                        Join Teleconsultation Call
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/doctors/${appt.doctorId || ""}`} className="block">
                      <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-xl">
                        View Doctor Profile & Chamber
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

