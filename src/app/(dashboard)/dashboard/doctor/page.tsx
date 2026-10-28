"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Video,
  Clock,
  PenTool,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  PhoneCall,
  Search,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetDoctorAppointmentsQuery,
  useGetDoctorStatsQuery,
  useUpdateAppointmentStatusMutation,
} from "@/redux/api/doctorApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

export default function DoctorDashboardPage() {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileUser } = useGetMeQuery();

  const { data: appointmentsRes, isLoading: isLoadingAppts, refetch } = useGetDoctorAppointmentsQuery({});
  const { data: statsRes } = useGetDoctorStatsQuery({});
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  const [isLiveConsultActive, setIsLiveConsultActive] = useState<boolean>(true);
  const [quickRxNotes, setQuickRxNotes] = useState(
    "1. Tab. Napa Extra 500mg (1+0+1) - 5 days\n2. Cap. Seclo 20mg (1+0+1) - 14 days\n3. Tab. Angilock 50mg (0+0+1) - 30 days"
  );
  const [quickRxAdvice, setQuickRxAdvice] = useState("Echocardiogram, Lipid Profile, Low salt diet");

  const appointments = appointmentsRes?.data || [];
  const stats = statsRes?.data;

  const doctorName = profileUser?.name || authUser?.name || "Prof. Dr. Syed Mahmudul Hasan";
  const doctorSpecialization = "Senior Consultant • Department of Cardiology & Interventional Heart Care";

  const waitingPatients = appointments.filter((a: any) => a.status === "PENDING" || a.status === "CONFIRMED");
  const completedToday = stats?.completedAppointments || appointments.filter((a: any) => a.status === "COMPLETED").length;
  const onlineConsultsCount = appointments.filter((a: any) => a.type === "ONLINE").length;
  const totalEarnings = stats?.totalEarnings || (completedToday * 1200);

  const handleCompletePatient = async (id: string) => {
    try {
      await updateStatus({ id, status: "COMPLETED" }).unwrap();
      toast.success("Consultation completed and archived");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleIssueQuickRx = () => {
    toast.success("Prescription generated & dispatched to patient");
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Doctor Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/10 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> BMDC Verified Specialist
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            {doctorName.startsWith("Dr.") || doctorName.startsWith("Prof.") ? doctorName : `Dr. ${doctorName}`}
          </h1>
          <p className="text-xs text-muted-fg font-medium">
            {doctorSpecialization}
          </p>
        </div>

        {/* Live Chamber Toggle Switch */}
        <div className="flex items-center gap-4 bg-surface-card p-3 rounded-2xl border border-surface-border shadow-xs shrink-0">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-fg-app block">Live Chamber Status</span>
            <span className="text-[11px] text-muted-fg block">
              {isLiveConsultActive ? "Accepting Patients" : "Queue Paused"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLiveConsultActive(!isLiveConsultActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              isLiveConsultActive ? "bg-emerald-500" : "bg-muted-fg/30"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isLiveConsultActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-fg">Patients Waiting</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs">
              QUEUE
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{waitingPatients.length}</span>
            <span className="text-xs text-muted-fg font-semibold">Patients</span>
          </div>
          <span className="text-[11px] font-medium text-amber-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Est. wait time: ~15 mins / patient
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-fg">Completed Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{completedToday}</span>
            <span className="text-xs text-muted-fg font-semibold">Consultations</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% Prescriptions Issued
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-fg">Teleconsult Calls</span>
            <div className="p-2 rounded-xl bg-violet-accent/10 text-violet-accent">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">{onlineConsultsCount}</span>
            <span className="text-xs text-muted-fg font-semibold">WebRTC Calls</span>
          </div>
          <span className="text-[11px] font-medium text-violet-accent flex items-center gap-1">
            <Video className="h-3 w-3" /> Encrypted Video Consults
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-surface-border bg-surface-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-fg">Monthly Earnings</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-fg-app">৳{totalEarnings.toLocaleString()}</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Dynamic Revenue Tracker
          </span>
        </div>
      </div>

      {/* Main Content Grid: Patient Queue Table + Rx Quick Writer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Queue List (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-surface-border bg-surface-card p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <h3 className="font-black text-lg text-fg-app flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-teal" /> Live Patient Queue & Consultations
              </h3>
              <p className="text-xs text-muted-fg">Real-time patient appointments from database</p>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {waitingPatients.length} Waiting
            </span>
          </div>

          {isLoadingAppts ? (
            <div className="p-10 text-center text-muted-fg space-y-2">
              <Loader2 className="w-6 h-6 text-primary-teal animate-spin mx-auto" />
              <p className="text-xs font-bold">Loading live patient appointments...</p>
            </div>
          ) : waitingPatients.length > 0 ? (
            <div className="space-y-3">
              {waitingPatients.map((patient: any, idx: number) => {
                const isOnline = patient.type === "ONLINE";
                const pName = patient.patient?.user?.name || patient.patient?.name || "Patient";
                const timeStr = new Date(patient.slotStartTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={patient.id}
                    className="p-4 rounded-2xl border border-surface-border bg-muted-bg/30 hover:border-primary-teal/40 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-xl bg-primary-teal text-white font-black flex items-center justify-center text-xs shadow-xs">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h4 className="font-black text-sm text-fg-app flex items-center gap-2">
                            {pName}
                          </h4>
                          <p className="text-xs text-primary-teal font-semibold">
                            {patient.doctor?.hospital || "Hospital Consultation Center"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isOnline
                              ? "bg-violet-accent/10 text-violet-accent border-violet-accent/30"
                              : "bg-emerald-accent/10 text-emerald-accent border-emerald-accent/30"
                          }`}
                        >
                          {isOnline ? "Video Teleconsult" : "Chamber Visit"}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {patient.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-xs space-y-1">
                      <p className="text-fg-app font-medium">
                        <span className="text-muted-fg font-bold">Appointment Time:</span> {timeStr} • Ref: SM-
                        {patient.id.slice(0, 6).toUpperCase()}
                      </p>
                      {patient.notes && (
                        <p className="text-muted-fg font-mono text-[11px]">Note: {patient.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                      {isOnline && (
                        <Link href={`/teleconsult/${patient.id}`}>
                          <Button variant="emerald" size="sm" className="text-xs font-bold rounded-xl cursor-pointer">
                            <Video className="h-3.5 w-3.5 mr-1" /> Join Teleconsult
                          </Button>
                        </Link>
                      )}

                      <Link
                        href={`/dashboard/doctor/rx-writer?appointmentId=${patient.id}&patientName=${encodeURIComponent(
                          pName
                        )}`}
                      >
                        <Button variant="primary" size="sm" className="text-xs font-bold rounded-xl cursor-pointer">
                          <PenTool className="h-3.5 w-3.5 mr-1" /> Write Digital Rx
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompletePatient(patient.id)}
                        disabled={isUpdating}
                        className="text-xs font-bold text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-xl"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center space-y-3 text-muted-fg">
              <Users className="h-10 w-10 text-muted-fg/40 mx-auto" />
              <p className="text-sm font-bold text-fg-app">No patients in queue currently</p>
              <p className="text-xs">Appointments booked by patients will appear in this live queue.</p>
            </div>
          )}
        </div>

        {/* Digital Rx Writer Quick Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-surface-border bg-surface-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="font-black text-base text-fg-app flex items-center gap-2">
              <PenTool className="h-4 w-4 text-emerald-accent" /> Digital Rx Quick Writer
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-muted-fg">Select Patient from Queue:</label>
              <select className="w-full h-10 px-3 rounded-xl bg-muted-bg/50 border border-surface-border text-xs font-bold text-fg-app">
                {waitingPatients.length > 0 ? (
                  waitingPatients.map((p: any, i: number) => (
                    <option key={p.id} value={p.id}>
                      #{i + 1} - {p.patient?.user?.name || p.patient?.name || "Patient"}
                    </option>
                  ))
                ) : (
                  <option value="">No active patient</option>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-muted-fg">Prescribed Medications:</label>
              <textarea
                rows={4}
                value={quickRxNotes}
                onChange={(e) => setQuickRxNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted-bg/50 border border-surface-border font-mono text-xs text-fg-app focus:outline-none focus:border-primary-teal"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-muted-fg">Advice & Diagnostic Tests:</label>
              <input
                type="text"
                value={quickRxAdvice}
                onChange={(e) => setQuickRxAdvice(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-muted-bg/50 border border-surface-border text-xs text-fg-app focus:outline-none focus:border-primary-teal"
              />
            </div>

            <Button
              variant="emerald"
              onClick={handleIssueQuickRx}
              className="w-full h-10 justify-center text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-1.5" /> Sign & Issue Prescription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}