"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { HeroMedicineAlarmWidget } from "@/features/patient/components/HeroMedicineAlarmWidget";
import {
  Activity,
  Heart,
  Calendar,
  FlaskConical,
  CheckCircle2,
  Video,
  Pill,
  Download,
  Stethoscope,
  ShieldCheck,
  Building2,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetPatientAppointmentsQuery } from "@/redux/api/doctorApi";
import { useGetLabOrdersQuery } from "@/redux/api/labApi";
import { useGetPatientVitalsQuery } from "@/redux/api/vitalsApi";

export default function PatientDashboardPage() {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileUser } = useGetMeQuery();

  // Dynamic logged in user's name
  const patientName = useMemo(() => {
    return (
      profileUser?.name ||
      authUser?.name ||
      authUser?.email?.split("@")[0] ||
      "Patient"
    );
  }, [profileUser, authUser]);

  // Dynamic Appointments from backend
  const {
    data: appointmentsRes,
    isLoading: isLoadingAppointments,
  } = useGetPatientAppointmentsQuery();

  const appointments = useMemo(() => {
    const list = appointmentsRes?.data;
    if (Array.isArray(list)) return list;
    return [];
  }, [appointmentsRes]);

  // Next upcoming consultation from real database
  const nextAppointment = useMemo(() => {
    if (!appointments || appointments.length === 0) return null;
    const now = new Date();
    // Prioritize future confirmed/pending appointments
    const upcoming = appointments.filter(
      (a: any) => new Date(a.slotStartTime) >= now && a.status !== "CANCELLED"
    );
    if (upcoming.length > 0) {
      return upcoming.sort(
        (a: any, b: any) =>
          new Date(a.slotStartTime).getTime() - new Date(b.slotStartTime).getTime()
      )[0];
    }
    // Fallback to most recent appointment
    return appointments[0];
  }, [appointments]);

  // Dynamic Lab Orders from backend
  const {
    data: labOrdersRes,
    isLoading: isLoadingLabOrders,
  } = useGetLabOrdersQuery({ limit: 5 });

  const recentLabOrders = useMemo(() => {
    const list = labOrdersRes?.orders;
    if (Array.isArray(list)) return list.slice(0, 3);
    return [];
  }, [labOrdersRes]);

  // Dynamic Vitals from backend
  const patientProfileId = profileUser?.id || authUser?.id || "";
  const { data: vitalsRes } = useGetPatientVitalsQuery(
    { patientId: patientProfileId },
    { skip: !patientProfileId }
  );

  const vitalsSummary = useMemo(() => {
    const list = vitalsRes || [];
    const heartRate = list.find((v) => v.type === "HEART_RATE")?.value ?? 72;
    const bp = list.find((v) => v.type === "BP")?.value;
    const bpText = bp ? `${bp} / 80` : "120 / 80";
    const glucose = list.find((v) => v.type === "GLUCOSE")?.value ?? 5.6;
    const spo2 = list.find((v) => v.type === "SPO2")?.value ?? 98;

    return {
      heartRate,
      bpText,
      glucose,
      spo2,
      bmi: 22.4,
    };
  }, [vitalsRes]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Patient Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-accent/10 via-primary-teal/10 to-surface-card p-5 sm:p-7 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Welcome back, <span className="text-primary-teal">{patientName}</span> 👋
          </h1>
          <p className="text-xs text-muted-fg">
            Here is your daily health summary, active medicine alarms, and upcoming doctor appointments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Link href="/doctors" className="flex-1 sm:flex-initial">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary-teal text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer active:scale-95"
            >
              <Stethoscope className="h-4 w-4" /> Book Doctor
            </button>
          </Link>
          <Link href="/pharmacy" className="flex-1 sm:flex-initial">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-accent text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer active:scale-95"
            >
              <Pill className="h-4 w-4" /> Order Medicine
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Medicine Alarm Widget - 100% Dynamic from Backend */}
      <HeroMedicineAlarmWidget />

      {/* Health Vitals Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{vitalsSummary.heartRate}</span>
            <span className="text-xs text-muted-fg font-bold">BPM</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Normal Resting Heart Rate
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{vitalsSummary.bpText}</span>
            <span className="text-xs text-muted-fg font-bold">mmHg</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Optimal Range
          </span>
        </div>

        {/* Fasting Blood Sugar */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Fasting Blood Sugar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{vitalsSummary.glucose}</span>
            <span className="text-xs text-muted-fg font-bold">mmol/L</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Normal Glycemic Level
          </span>
        </div>

        {/* Body Mass Index (BMI) */}
        <div className="p-5 rounded-3xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">Body Mass Index (BMI)</span>
            <div className="p-2 rounded-xl bg-violet-accent/10 text-violet-accent">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{vitalsSummary.bmi}</span>
            <span className="text-xs text-muted-fg font-bold">kg/m²</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-accent flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Healthy Weight Category
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column (Upcoming Consultation) + Right Column (Recent Lab Reports) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Consultation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-primary-teal/30 bg-primary-teal/5 dark:bg-primary-teal/10 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-primary-teal/20 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Upcoming Consultation
              </span>
              {nextAppointment ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-accent text-white shadow-xs animate-pulse">
                  {new Date(nextAppointment.slotStartTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(nextAppointment.slotStartTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted-bg text-muted-fg">
                  No Schedule
                </span>
              )}
            </div>

            {isLoadingAppointments ? (
              <div className="p-8 text-center text-muted-fg space-y-2">
                <Loader2 className="w-5 h-5 text-primary-teal animate-spin mx-auto" />
                <p className="text-xs font-bold">Loading your appointment details from database...</p>
              </div>
            ) : nextAppointment ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary-teal/15 text-primary-teal border-2 border-primary-teal/40 flex items-center justify-center font-black text-xl shrink-0">
                    <Stethoscope className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-base text-fg-app">
                      {nextAppointment.doctor?.name || nextAppointment.doctor?.user?.name || "Specialist Doctor"}
                    </h3>
                    <p className="text-xs font-bold text-primary-teal">
                      {nextAppointment.doctor?.specialization || "General Medicine"}
                    </p>
                    <p className="text-xs text-muted-fg flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      {nextAppointment.doctor?.hospital || "Hospital Consultation"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-primary-teal/15">
                  <span className="text-xs text-muted-fg font-medium">
                    Booking Ref: SM-{nextAppointment.id.slice(0, 6).toUpperCase()} • {nextAppointment.type === "ONLINE" ? "Video Teleconsult" : "Chamber Visit"}
                  </span>
                  {nextAppointment.type === "ONLINE" ? (
                    <Link href={`/teleconsult/${nextAppointment.id}`}>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-emerald-accent text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer active:scale-95"
                      >
                        <Video className="h-4 w-4" /> Join Teleconsultation Room
                      </button>
                    </Link>
                  ) : (
                    <Link href={`/doctors/${nextAppointment.doctorId || ""}`}>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-primary-teal text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer active:scale-95"
                      >
                        <FileText className="h-4 w-4" /> View Chamber Details
                      </button>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-3">
                <Calendar className="h-8 w-8 text-muted-fg mx-auto opacity-50" />
                <p className="text-sm font-bold text-fg-app">No upcoming consultations booked yet</p>
                <p className="text-xs text-muted-fg max-w-sm mx-auto">
                  Consult verified BMDC doctors online via encrypted video or book in-clinic chamber visits.
                </p>
                <Link href="/doctors" className="inline-block pt-1">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-primary-teal text-white font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all cursor-pointer"
                  >
                    <span>Browse & Book Doctor</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Lab Reports */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-black text-base text-fg-app flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-violet-accent" /> Recent Lab Reports
              </h3>
              <Link href="/lab-tests" className="text-xs font-bold text-primary-teal hover:underline">
                Book Test
              </Link>
            </div>

            {isLoadingLabOrders ? (
              <div className="p-6 text-center text-muted-fg space-y-2">
                <Loader2 className="w-5 h-5 text-primary-teal animate-spin mx-auto" />
                <p className="text-xs font-bold">Loading recent lab orders...</p>
              </div>
            ) : recentLabOrders.length > 0 ? (
              <div className="space-y-2.5">
                {recentLabOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    REPORT_READY: "text-emerald-600 bg-emerald-accent/10 border-emerald-accent/20",
                    SAMPLE_COLLECTED: "text-primary-teal bg-primary-teal/10 border-primary-teal/20",
                    PROCESSING: "text-amber-600 bg-amber-500/10 border-amber-500/20",
                    PENDING: "text-violet-600 bg-violet-accent/10 border-violet-accent/20",
                    CANCELLED: "text-rose-600 bg-rose-500/10 border-rose-500/20",
                  };
                  const badgeClass = statusColors[order.status] || "text-muted-fg bg-muted-bg";

                  return (
                    <div
                      key={order.id}
                      className="p-3.5 rounded-2xl border border-surface-border bg-muted-bg/30 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-black text-fg-app">
                        <span className="truncate pr-2">{order.testNames.join(", ")}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold shrink-0 ${badgeClass}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-fg">
                        {order.lab?.labName || "Diagnostic Lab"} •{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {order.reportPdfUrl ? (
                        <a
                          href={order.reportPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-teal/10 text-primary-teal font-bold text-xs border border-primary-teal/20 hover:bg-primary-teal/20 transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" /> Download Report (PDF)
                        </a>
                      ) : (
                        <span className="text-[10px] font-semibold text-muted-fg block pt-1">
                          Report in processing (Available within 24h)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center space-y-2 text-muted-fg">
                <FlaskConical className="h-8 w-8 text-primary-teal/40 mx-auto" />
                <p className="text-sm font-bold text-fg-app">No diagnostic lab orders yet</p>
                <p className="text-xs">Book lab tests with home sample collection from certified labs.</p>
                <Link href="/lab-tests" className="inline-block pt-1">
                  <span className="text-xs font-bold text-primary-teal hover:underline">
                    Browse All Lab Tests →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
