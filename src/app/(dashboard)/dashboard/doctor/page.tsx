"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_PATIENT_QUEUE = [
  {
    id: "p-101",
    serialNo: "01",
    name: "Kamrul Islam Manik",
    ageGender: "48 Yrs / Male",
    complaint: "Chest pressure & palpitation after walking 500m",
    type: "Chamber Visit",
    chamber: "Square Hospital - Panthapath",
    status: "In-Consultation",
    vitals: "BP: 135/85 • HR: 88 • SpO2: 98%",
  },
  {
    id: "p-102",
    serialNo: "02",
    name: "Dr. Selina Begum",
    ageGender: "52 Yrs / Female",
    complaint: "Post-angiogram follow-up consultation",
    type: "Video Consultation",
    chamber: "HD Video Call",
    status: "Waiting",
    vitals: "BP: 120/80 • HR: 74 • SpO2: 99%",
  },
  {
    id: "p-103",
    serialNo: "03",
    name: "Tariqul Alam",
    ageGender: "36 Yrs / Male",
    complaint: "High lipid report review & ECG evaluation",
    type: "Chamber Visit",
    chamber: "Labaid Specialized Hospital",
    status: "Waiting",
    vitals: "BP: 128/82 • HR: 80 • SpO2: 97%",
  },
  {
    id: "p-104",
    serialNo: "04",
    name: "Nusrat Parveen",
    ageGender: "29 Yrs / Female",
    complaint: "Shortness of breath during stairs climbing",
    type: "Video Consultation",
    chamber: "HD Video Call",
    status: "Waiting",
    vitals: "BP: 115/75 • HR: 78 • SpO2: 98%",
  },
];

export default function DoctorDashboardPage() {
  const [activeQueue, setActiveQueue] = useState(MOCK_PATIENT_QUEUE);
  const [isLiveConsultActive, setIsLiveConsultActive] = useState<boolean>(true);

  const handleCompletePatient = (id: string) => {
    setActiveQueue((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Doctor Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/10 via-background to-background p-6 rounded-2xl border border-card-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> BMDC A-34281 Verified Specialist
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Prof. Dr. <span className="text-primary-teal">Syed Mahmudul Hasan</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Senior Consultant • Department of Cardiology & Interventional Heart Care
          </p>
        </div>

        {/* Live Chamber Toggle Switch */}
        <div className="flex items-center gap-4 bg-card p-3 rounded-xl border border-card-border shadow-xs shrink-0">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-fg-app block">Live Chamber Status</span>
            <span className="text-[11px] text-muted-foreground block">
              {isLiveConsultActive ? "Accepting Patients" : "Queue Paused"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLiveConsultActive(!isLiveConsultActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              isLiveConsultActive ? "bg-emerald-500" : "bg-muted-foreground/30"
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
        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Patients Waiting</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs">
              QUEUE
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">{activeQueue.length}</span>
            <span className="text-xs text-muted-foreground font-semibold">Patients</span>
          </div>
          <span className="text-[11px] font-medium text-amber-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Est. wait time: ~15 mins / patient
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Completed Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">14</span>
            <span className="text-xs text-muted-foreground font-semibold">Patients</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% Prescriptions Issued
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Teleconsult Calls</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">6</span>
            <span className="text-xs text-muted-foreground font-semibold">HD Calls</span>
          </div>
          <span className="text-[11px] font-medium text-cyan-500 flex items-center gap-1">
            <Video className="h-3 w-3" /> 2 Video Calls Remaining
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Monthly Earnings</span>
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-fg-app">৳45,200</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +18% vs last month
          </span>
        </div>
      </div>

      {/* Main Content Grid: Patient Queue Table + Rx Quick Writer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Queue List (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-card-border bg-card p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <div>
              <h3 className="font-bold text-lg text-fg-app flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-teal" /> Live Patient Queue & Consultations
              </h3>
              <p className="text-xs text-muted-foreground">Real-time patient serials & chief complaints</p>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {activeQueue.length} Serials Active
            </span>
          </div>

          <div className="space-y-3">
            {activeQueue.map((patient) => (
              <div
                key={patient.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  patient.status === "In-Consultation"
                    ? "bg-primary-teal/10 border-primary-teal shadow-xs"
                    : "bg-surface-card-hover/40 border-card-border/80 hover:border-card-border"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-primary-teal text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                      #{patient.serialNo}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-fg-app flex items-center gap-2">
                        {patient.name}
                        <span className="text-xs font-normal text-muted-foreground">
                          ({patient.ageGender})
                        </span>
                      </h4>
                      <p className="text-xs text-primary-teal font-medium">{patient.chamber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        patient.type === "Video Consultation"
                          ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/30"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      }`}
                    >
                      {patient.type}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        patient.status === "In-Consultation"
                          ? "bg-emerald-500 text-white animate-pulse"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                </div>

                {/* Vitals & Chief Complaint */}
                <div className="p-3 rounded-lg bg-card/60 border border-card-border/50 text-xs space-y-1">
                  <p className="text-fg-app font-medium">
                    <span className="text-muted-foreground font-semibold">Complaint:</span>{" "}
                    {patient.complaint}
                  </p>
                  <p className="text-muted-foreground font-mono text-[11px]">{patient.vitals}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {patient.type === "Video Consultation" && (
                    <Button variant="emerald" size="sm" className="h-8 text-xs">
                      <Video className="h-3.5 w-3.5 mr-1" /> Start Teleconsult
                    </Button>
                  )}

                  <Button variant="primary" size="sm" className="h-8 text-xs">
                    <PenTool className="h-3.5 w-3.5 mr-1" /> Write Digital Rx
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompletePatient(patient.id)}
                    className="h-8 text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Rx Writer Quick Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <h3 className="font-bold text-base text-fg-app flex items-center gap-2">
              <PenTool className="h-4 w-4 text-emerald-500" /> Digital Rx Quick Writer
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Select Patient:</label>
              <select className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app">
                {activeQueue.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.serialNo} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Prescribed Medicines:</label>
              <textarea
                rows={4}
                defaultValue={`1. Tab. Napa Extra 500mg (1+0+1) - 5 days\n2. Cap. Seclo 20mg (1+0+1) - 14 days\n3. Tab. Angilock 50mg (0+0+1) - 30 days`}
                className="w-full p-2.5 rounded-xl bg-card border border-card-border font-mono text-xs text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Advice & Diagnostic Tests:</label>
              <input
                type="text"
                defaultValue="Echocardiogram, Lipid Profile, Low salt diet"
                className="w-full h-9 px-3 rounded-xl bg-card border border-card-border text-xs text-fg-app"
              />
            </div>

            <Button variant="emerald" className="w-full h-10 justify-center text-xs shadow-md">
              <FileText className="h-4 w-4 mr-1.5" /> Generate & Sign Digital Prescription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
