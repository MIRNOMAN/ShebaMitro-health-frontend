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
  Building2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetPatientAppointmentsQuery } from "@/redux/api/doctorApi";

export default function PatientPage() {
  const { data: appointmentsResponse, isLoading } = useGetPatientAppointmentsQuery();
  const appointments = appointmentsResponse?.data || [];

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

      {/* Dynamic Booked Doctor Appointments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-fg-app flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary-teal" />
              My Doctor Consultations & Appointments
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time schedule of your in-clinic visits and live video telemedicine consultations
            </p>
          </div>
          <Link href="/doctors">
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              <Plus className="h-3.5 w-3.5" /> Book Specialist
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-card-border bg-card animate-pulse space-y-3">
                <div className="h-4 bg-muted/40 rounded-sm w-1/2" />
                <div className="h-3 bg-muted/20 rounded-sm w-3/4" />
                <div className="h-8 bg-muted/30 rounded-xl" />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-card-border bg-card text-center space-y-3">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <h3 className="font-bold text-sm text-fg-app">No Active Doctor Appointments</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t scheduled any doctor appointments yet. Consult top BMDC verified doctors across 20+ specialties today.
            </p>
            <Link href="/doctors">
              <Button variant="primary" size="sm" className="mt-2 text-xs">
                Browse Verified Doctors
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appt: any) => {
              const isVideo = appt.type === "ONLINE";
              const dateStr = new Date(appt.slotStartTime).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const timeStr = new Date(appt.slotStartTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={appt.id}
                  className="p-5 rounded-2xl border border-card-border bg-card hover:border-primary-teal/40 transition-all shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isVideo
                              ? "bg-violet-500/10 text-violet-500 border border-violet-500/20"
                              : "bg-primary-teal/10 text-primary-teal border border-primary-teal/20"
                          }`}
                        >
                          {isVideo ? <Video className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                          {isVideo ? "Telemedicine Video" : "Chamber Visit"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            appt.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : appt.status === "IN_PROGRESS"
                              ? "bg-primary-teal/20 text-primary-teal animate-pulse"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-fg-app truncate">
                        {appt.doctor?.name || "Dr. Specialist"}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {appt.doctor?.specialization} • {appt.doctor?.hospital || "Dhaka Medical College"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-card-border/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary-teal" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>{timeStr}</span>
                    </div>
                  </div>

                  {appt.notes && (
                    <p className="text-[11px] text-muted-foreground bg-muted/10 p-2.5 rounded-xl border border-card-border/40">
                      <strong className="text-fg-app font-semibold">Chief Complaint:</strong> {appt.notes}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-fg-app">
                      Fee: ৳{appt.doctor?.consultFee || 1000}
                    </span>
                    {isVideo && appt.status !== "COMPLETED" ? (
                      <Button variant="primary" size="sm" className="text-xs h-8 gap-1.5">
                        <Video className="h-3.5 w-3.5" /> Start Call
                      </Button>
                    ) : (
                      <Link href={`/doctors/${appt.doctorId}`}>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          View Doctor
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
    </div>
  );
}
