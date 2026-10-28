"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Video,
  Clock,
  PenTool,
  CheckCircle2,
  AlertCircle,
  Building2,
  Search,
  Filter,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetDoctorAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from "@/redux/api/doctorApi";

export default function DoctorPatientQueuePage() {
  const [filterType, setFilterType] = useState<"ALL" | "ONLINE" | "CHAMBER">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: appointmentsRes, isLoading, refetch } = useGetDoctorAppointmentsQuery({});
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  const appointments = appointmentsRes?.data || [];

  const filtered = appointments.filter((appt: any) => {
    if (filterType !== "ALL" && appt.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const pName = (appt.patient?.user?.name || appt.patient?.name || "").toLowerCase();
      return pName.includes(q) || appt.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleMarkCompleted = async (id: string) => {
    try {
      await updateStatus({ id, status: "COMPLETED" }).unwrap();
      refetch();
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/15 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Live OPD Patient Queue
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Doctor <span className="text-primary-teal">Patient Queue</span>
          </h1>
          <p className="text-xs text-muted-fg">
            Manage your daily waiting list, conduct teleconsultations, and issue digital prescriptions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="text-xs font-bold rounded-xl"
        >
          Refresh Queue
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-card p-3 rounded-2xl border border-surface-border">
        <div className="flex items-center gap-1.5">
          {(["ALL", "ONLINE", "CHAMBER"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === t
                  ? "bg-primary-teal text-white shadow-xs"
                  : "text-muted-fg hover:bg-muted-bg"
              }`}
            >
              {t === "ALL" ? "All Patients" : t === "ONLINE" ? "Online Video" : "Chamber Visit"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
          <input
            type="text"
            placeholder="Search patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-muted-bg/50 border border-surface-border focus:outline-none focus:border-primary-teal text-fg-app"
          />
        </div>
      </div>

      {/* Queue List */}
      {isLoading ? (
        <div className="p-12 text-center text-muted-fg space-y-3">
          <Loader2 className="w-6 h-6 text-primary-teal animate-spin mx-auto" />
          <p className="text-xs font-bold">Loading live patient queue from database...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((appt: any, idx: number) => {
            const isOnline = appt.type === "ONLINE";
            const patientName = appt.patient?.user?.name || appt.patient?.name || "Patient";
            const startTime = new Date(appt.slotStartTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={appt.id}
                className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:border-primary-teal/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20 flex items-center justify-center font-black text-sm shrink-0">
                    #{String(idx + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-base text-fg-app">{patientName}</h3>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isOnline
                            ? "bg-violet-accent/10 text-violet-accent border-violet-accent/20"
                            : "bg-emerald-accent/10 text-emerald-accent border-emerald-accent/20"
                        }`}
                      >
                        {isOnline ? "Video Teleconsult" : "Chamber Visit"}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted-bg text-muted-fg">
                        {appt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-fg mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-fg-app">
                        <Clock className="h-3.5 w-3.5 text-primary-teal" />
                        {startTime}
                      </span>
                      <span>• Ref: SM-{appt.id.slice(0, 6).toUpperCase()}</span>
                      {appt.notes && <span>• Note: {appt.notes}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                  {isOnline && appt.status !== "CANCELLED" && (
                    <Link href={`/teleconsult/${appt.id}`} className="flex-1 md:flex-initial">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full gap-1.5 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        <Video className="h-3.5 w-3.5" /> Join Room
                      </Button>
                    </Link>
                  )}

                  <Link
                    href={`/dashboard/doctor/rx-writer?appointmentId=${appt.id}&patientName=${encodeURIComponent(
                      patientName
                    )}`}
                    className="flex-1 md:flex-initial"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      <PenTool className="h-3.5 w-3.5 text-primary-teal" /> Write Rx
                    </Button>
                  </Link>

                  {appt.status !== "COMPLETED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkCompleted(appt.id)}
                      disabled={isUpdating}
                      className="text-xs font-bold rounded-xl text-emerald-600 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center space-y-3 bg-surface-card border border-surface-border rounded-3xl text-muted-fg">
          <Users className="h-10 w-10 mx-auto text-muted-fg/40" />
          <p className="text-sm font-bold text-fg-app">No patients in queue</p>
          <p className="text-xs max-w-sm mx-auto">
            Your patient list will update dynamically when new appointments are booked.
          </p>
        </div>
      )}
    </div>
  );
}