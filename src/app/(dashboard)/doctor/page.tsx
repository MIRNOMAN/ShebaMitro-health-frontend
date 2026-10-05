"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Video,
  Building2,
  Clock,
  CheckCircle2,
  PhoneCall,
  FileText,
  Stethoscope,
  Activity,
  AlertCircle,
  Play,
  Search,
  ChevronRight,
  UserCheck,
  UserX,
  X,
  Sparkles,
  Heart,
  Pill,
  History,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationChat } from "@/components/chat/ConsultationChat";

export interface PatientQueueItem {
  id: string;
  appointmentId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  chiefComplaint: string;
  consultationMode: "Video" | "Chamber";
  status: "waiting" | "consulting" | "completed";
  queueNumber: number;
  appointmentTime: string;
  phone: string;
  bloodGroup: string;
  allergies?: string[];
  vitalStats?: {
    bp: string;
    pulse: string;
    weight: string;
    temperature: string;
  };
  pastHistory?: {
    condition: string;
    diagnosedYear: string;
  }[];
}

const INITIAL_QUEUE: PatientQueueItem[] = [
  {
    id: "pat-101",
    appointmentId: "APT-8821",
    name: "Sabbir Ahmed",
    age: 42,
    gender: "Male",
    chiefComplaint: "Severe chest tightness and dyspnea after exertion for 3 days",
    consultationMode: "Video",
    status: "consulting",
    queueNumber: 1,
    appointmentTime: "05:30 PM",
    phone: "+880 1712-345678",
    bloodGroup: "O+",
    allergies: ["Penicillin", "Sulfa drugs"],
    vitalStats: {
      bp: "135/88 mmHg",
      pulse: "78 bpm",
      weight: "74 kg",
      temperature: "98.4 °F",
    },
    pastHistory: [
      { condition: "Essential Hypertension", diagnosedYear: "2021" },
      { condition: "Hyperlipidemia", diagnosedYear: "2023" },
    ],
  },
  {
    id: "pat-102",
    appointmentId: "APT-8822",
    name: "Nusrat Jahan",
    age: 29,
    gender: "Female",
    chiefComplaint: "High fever (102°F), dry cough, and loss of appetite for 48 hours",
    consultationMode: "Video",
    status: "waiting",
    queueNumber: 2,
    appointmentTime: "05:45 PM",
    phone: "+880 1819-987654",
    bloodGroup: "A+",
    allergies: ["Dust", "Pollen"],
    vitalStats: {
      bp: "118/75 mmHg",
      pulse: "92 bpm",
      weight: "58 kg",
      temperature: "101.8 °F",
    },
    pastHistory: [{ condition: "Bronchial Asthma", diagnosedYear: "2018" }],
  },
  {
    id: "pat-103",
    appointmentId: "APT-8823",
    name: "Dr. Rafiqul Islam",
    age: 65,
    gender: "Male",
    chiefComplaint: "Routine diabetic follow-up & HbA1c review with fasting sugar fluctuation",
    consultationMode: "Chamber",
    status: "waiting",
    queueNumber: 3,
    appointmentTime: "06:00 PM",
    phone: "+880 1911-223344",
    bloodGroup: "B+",
    allergies: [],
    vitalStats: {
      bp: "128/82 mmHg",
      pulse: "70 bpm",
      weight: "81 kg",
      temperature: "98.2 °F",
    },
    pastHistory: [
      { condition: "Type 2 Diabetes Mellitus", diagnosedYear: "2015" },
      { condition: "Diabetic Retinopathy (Mild)", diagnosedYear: "2022" },
    ],
  },
  {
    id: "pat-104",
    appointmentId: "APT-8824",
    name: "Sharmin Sultana",
    age: 36,
    gender: "Female",
    chiefComplaint: "Persistent migraine with aura and nausea during morning work",
    consultationMode: "Chamber",
    status: "waiting",
    queueNumber: 4,
    appointmentTime: "06:15 PM",
    phone: "+880 1678-554433",
    bloodGroup: "AB+",
    allergies: ["NSAIDs"],
    vitalStats: {
      bp: "122/78 mmHg",
      pulse: "74 bpm",
      weight: "62 kg",
      temperature: "98.6 °F",
    },
    pastHistory: [{ condition: "Chronic Migraine", diagnosedYear: "2019" }],
  },
  {
    id: "pat-100",
    appointmentId: "APT-8820",
    name: "Kamrul Hasan",
    age: 51,
    gender: "Male",
    chiefComplaint: "Post-surgery knee dressing review and pain management consultation",
    consultationMode: "Chamber",
    status: "completed",
    queueNumber: 0,
    appointmentTime: "05:00 PM",
    phone: "+880 1552-112233",
    bloodGroup: "O-",
    allergies: [],
    vitalStats: {
      bp: "124/80 mmHg",
      pulse: "72 bpm",
      weight: "78 kg",
      temperature: "98.5 °F",
    },
    pastHistory: [{ condition: "Left Knee Arthroscopy", diagnosedYear: "2026" }],
  },
];

export default function DoctorDashboardPage() {
  const [queue, setQueue] = useState<PatientQueueItem[]>(INITIAL_QUEUE);
  const [activeTab, setActiveTab] = useState<"all" | "waiting" | "consulting" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEhrPatient, setSelectedEhrPatient] = useState<PatientQueueItem | null>(null);
  const [activeVideoPatient, setActiveVideoPatient] = useState<PatientQueueItem | null>(null);
  const [isCallingNext, setIsCallingNext] = useState(false);
  const [callNotification, setCallNotification] = useState<string | null>(null);

  // Play synthesized Web Audio chime when calling next patient
  const playCallChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime + 0.15);
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (err) {
      console.error("Web Audio API chime playback failed", err);
    }
  };

  // Quick Action: "Call Next Patient"
  const handleCallNextPatient = () => {
    const nextWaiting = queue.find((p) => p.status === "waiting");
    if (!nextWaiting) {
      setCallNotification("No patients currently waiting in lobby!");
      setTimeout(() => setCallNotification(null), 3000);
      return;
    }

    setIsCallingNext(true);
    playCallChime();

    setCallNotification(`Calling Token #${nextWaiting.queueNumber} - ${nextWaiting.name} to Consultation`);

    setQueue((prev) =>
      prev.map((p) => {
        if (p.id === nextWaiting.id) {
          return { ...p, status: "consulting" };
        }
        if (p.status === "consulting") {
          return { ...p, status: "completed" };
        }
        return p;
      })
    );

    setTimeout(() => {
      setIsCallingNext(false);
    }, 1200);

    setTimeout(() => {
      setCallNotification(null);
    }, 4500);
  };

  const handleCompleteConsultation = (patientId: string) => {
    setQueue((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: "completed" } : p))
    );
  };

  // Filtered queue items
  const filteredQueue = queue.filter((p) => {
    const matchesTab = activeTab === "all" ? true : p.status === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const waitingList = queue.filter((p) => p.status === "waiting");
  const consultingList = queue.filter((p) => p.status === "consulting");
  const completedList = queue.filter((p) => p.status === "completed");

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Stats & Quick Action Masthead */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-primary-teal/90 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-teal/20 border border-primary-teal/40 text-primary-teal text-xs font-bold">
            <Stethoscope className="h-3.5 w-3.5" /> Doctor Live OPD Queue System
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Prof. Dr. Syed Mahmudul Hasan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Cardiology & Internal Medicine • Chamber Room #402 & Teleconsultation Hub
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full sm:w-auto">
          <Button
            variant="primary"
            onClick={handleCallNextPatient}
            disabled={isCallingNext || waitingList.length === 0}
            className="h-12 px-5 rounded-2xl font-bold text-sm shadow-lg shadow-primary-teal/30 bg-primary-teal hover:bg-teal-600 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <PhoneCall className={`h-4 w-4 ${isCallingNext ? "animate-bounce" : ""}`} />
            Call Next Patient
          </Button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary-teal/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Call Notification Toast Banner */}
      <AnimatePresence>
        {callNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3 font-bold text-xs sm:text-sm">
              <span className="p-2 rounded-xl bg-emerald-500 text-white">
                <PhoneCall className="h-4 w-4 animate-pulse" />
              </span>
              <span>{callNotification}</span>
            </div>
            <button
              onClick={() => setCallNotification(null)}
              className="text-muted-foreground hover:text-fg-app"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Group Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Waiting Lobby Card */}
        <div
          onClick={() => setActiveTab("waiting")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "waiting"
              ? "border-amber-500 bg-amber-500/5 shadow-md"
              : "border-card-border bg-card hover:bg-surface-card-hover"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Waiting Lobby
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/30">
              {waitingList.length} Patients
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-fg-app">{waitingList.length}</span>
            <span className="text-xs text-muted-foreground">in line today</span>
          </div>
        </div>

        {/* Consulting Now Card */}
        <div
          onClick={() => setActiveTab("consulting")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "consulting"
              ? "border-primary-teal bg-primary-teal/5 shadow-md"
              : "border-card-border bg-card hover:bg-surface-card-hover"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-teal uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 animate-pulse" /> Consulting Now
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary-teal/10 text-primary-teal border border-primary-teal/30">
              {consultingList.length} Active
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-fg-app">{consultingList.length}</span>
            <span className="text-xs text-muted-foreground">in active session</span>
          </div>
        </div>

        {/* Completed Card */}
        <div
          onClick={() => setActiveTab("completed")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === "completed"
              ? "border-emerald-500 bg-emerald-500/5 shadow-md"
              : "border-card-border bg-card hover:bg-surface-card-hover"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Completed
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              {completedList.length} Finished
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-fg-app">{completedList.length}</span>
            <span className="text-xs text-muted-foreground">discharged today</span>
          </div>
        </div>
      </div>

      {/* Queue Filter Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {(["all", "waiting", "consulting", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                  : "bg-card border border-card-border text-muted-foreground hover:text-fg-app"
              }`}
            >
              {tab === "all" ? "All Appointments" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patient, complaint, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal"
          />
        </div>
      </div>

      {/* Queue List Table / Cards Feed */}
      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-card-border bg-card space-y-2">
            <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <h3 className="font-bold text-sm text-fg-app">No Patients Found</h3>
            <p className="text-xs text-muted-foreground">
              No appointments matching status &quot;{activeTab}&quot; or search query.
            </p>
          </div>
        ) : (
          filteredQueue.map((patient) => (
            <div
              key={patient.id}
              className={`p-5 rounded-2xl border bg-card transition-all space-y-4 hover:shadow-md ${
                patient.status === "consulting"
                  ? "border-primary-teal ring-2 ring-primary-teal/20"
                  : "border-card-border"
              }`}
            >
              {/* Patient Badge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary-teal/10 border border-primary-teal/30 text-primary-teal font-extrabold flex items-center justify-center text-sm shrink-0">
                    #{patient.queueNumber || "—"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-fg-app">{patient.name}</h3>
                      
                      {/* Age & Gender Badges */}
                      <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-semibold text-muted-foreground">
                        {patient.age} yrs • {patient.gender}
                      </span>

                      {/* Consultation Mode Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          patient.consultationMode === "Video"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        }`}
                      >
                        {patient.consultationMode === "Video" ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <Building2 className="h-3 w-3" />
                        )}
                        {patient.consultationMode} Consultation
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          patient.status === "consulting"
                            ? "bg-primary-teal/10 text-primary-teal border-primary-teal/30 animate-pulse"
                            : patient.status === "waiting"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                        }`}
                      >
                        {patient.status === "consulting"
                          ? "Consulting Now"
                          : patient.status === "waiting"
                          ? "In Waiting Lobby"
                          : "Completed"}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Appt #{patient.appointmentId} • Scheduled {patient.appointmentTime} • Blood Group: {patient.bloodGroup}
                    </p>
                  </div>
                </div>

                {/* Patient Quick Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* View Past EHR History */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEhrPatient(patient)}
                    className="h-9 px-3 text-xs font-semibold rounded-xl border-card-border"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1 text-primary-teal" />
                    EHR History
                  </Button>

                  {/* Start Video Room / Enter Consultation */}
                  {patient.consultationMode === "Video" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveVideoPatient(patient)}
                      className="h-9 px-3.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                    >
                      <Video className="h-3.5 w-3.5 mr-1" />
                      Start Video Room
                    </Button>
                  )}

                  {patient.status === "consulting" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCompleteConsultation(patient.id)}
                      className="h-9 px-3 text-xs font-semibold rounded-xl border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Complete Session
                    </Button>
                  )}
                </div>
              </div>

              {/* Chief Complaint & Vital Signs Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-surface-card-hover p-3.5 rounded-xl border border-card-border/40 text-xs">
                <div className="md:col-span-2 space-y-1">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block">
                    Chief Complaint
                  </span>
                  <p className="font-medium text-fg-app leading-relaxed">{patient.chiefComplaint}</p>
                </div>

                <div className="space-y-1 border-t md:border-t-0 md:border-l border-card-border/60 pt-2 md:pt-0 md:pl-3">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block">
                    Latest Vitals
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <span className="text-muted-foreground">BP:</span>{" "}
                      <span className="font-bold text-fg-app">{patient.vitalStats?.bp || "120/80"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pulse:</span>{" "}
                      <span className="font-bold text-fg-app">{patient.vitalStats?.pulse || "72 bpm"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temp:</span>{" "}
                      <span className="font-bold text-fg-app">{patient.vitalStats?.temperature || "98.4 °F"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weight:</span>{" "}
                      <span className="font-bold text-fg-app">{patient.vitalStats?.weight || "70 kg"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EHR History Drawer Modal */}
      <AnimatePresence>
        {selectedEhrPatient && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEhrPatient(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-card border-l border-card-border h-full shadow-2xl z-10 flex flex-col"
            >
              {/* EHR Header */}
              <div className="p-4 bg-slate-950 text-white border-b border-card-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary-teal text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Patient Electronic Health Record (EHR)</h3>
                    <p className="text-[11px] text-slate-400">
                      {selectedEhrPatient.name} • {selectedEhrPatient.age} yrs • Blood Group: {selectedEhrPatient.bloodGroup}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEhrPatient(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* EHR Body Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
                {/* Patient Summary Card */}
                <div className="p-4 rounded-2xl bg-surface-card-hover border border-card-border space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-card-border pb-2">
                    <span className="font-bold text-fg-app">Contact & Demographics</span>
                    <span className="text-[11px] text-muted-foreground">{selectedEhrPatient.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Chief Complaint</span>
                      <span className="font-semibold text-fg-app">{selectedEhrPatient.chiefComplaint}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">Known Allergies</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {selectedEhrPatient.allergies && selectedEhrPatient.allergies.length > 0 ? (
                          selectedEhrPatient.allergies.map((allergy) => (
                            <span key={allergy} className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                              {allergy}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-500 font-semibold text-[11px]">No known drug allergies</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chronic Medical Conditions History */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <History className="h-4 w-4 text-primary-teal" /> Diagnosed Conditions
                  </h4>
                  <div className="space-y-2">
                    {selectedEhrPatient.pastHistory?.map((item) => (
                      <div
                        key={item.condition}
                        className="p-3 rounded-xl border border-card-border bg-card flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-fg-app">{item.condition}</span>
                        <span className="text-[11px] text-muted-foreground">Diagnosed: {item.diagnosedYear}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Biomarker Vitals Trend Log */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-emerald-500" /> Recorded Vital Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-card-border bg-card space-y-1 text-xs">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Blood Pressure</span>
                      <p className="font-black text-base text-fg-app">{selectedEhrPatient.vitalStats?.bp}</p>
                      <span className="text-[10px] text-emerald-500 font-bold">Optimal Standard</span>
                    </div>
                    <div className="p-3 rounded-xl border border-card-border bg-card space-y-1 text-xs">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Pulse Rate</span>
                      <p className="font-black text-base text-fg-app">{selectedEhrPatient.vitalStats?.pulse}</p>
                      <span className="text-[10px] text-emerald-500 font-bold">Regular Rhythm</span>
                    </div>
                  </div>
                </div>

                {/* Attached Diagnostic Reports */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-purple-500" /> Vault Documents & Lab Reports
                  </h4>
                  <div className="p-3 rounded-xl border border-card-border bg-card flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary-teal" />
                      <span className="font-semibold text-fg-app">ECG_12Lead_Report_Oct2026.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-primary-teal">
                      <ExternalLink className="h-3 w-3 mr-1" /> View PDF
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Active Video Room Modal */}
      <AnimatePresence>
        {activeVideoPatient && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideoPatient(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col lg:flex-row"
            >
              {/* Main Video Screen Container */}
              <div className="flex-1 flex flex-col bg-slate-900 relative p-4">
                {/* Video Header */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-extrabold text-white">LIVE Video Session</span>
                    <span className="text-xs text-slate-400">| Appt #{activeVideoPatient.appointmentId}</span>
                  </div>

                  <button
                    onClick={() => setActiveVideoPatient(null)}
                    className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Main Patient Video Simulation Stream */}
                <div className="flex-1 my-3 rounded-2xl bg-linear-to-b from-slate-950 to-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <div className="text-center space-y-3 z-10">
                    <div className="h-20 w-20 rounded-full bg-primary-teal/20 border-2 border-primary-teal flex items-center justify-center mx-auto text-white font-black text-xl">
                      {activeVideoPatient.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-base">{activeVideoPatient.name}</h3>
                      <p className="text-xs text-slate-400">
                        {activeVideoPatient.age} yrs • {activeVideoPatient.gender} • Chief Complaint: {activeVideoPatient.chiefComplaint}
                      </p>
                    </div>
                  </div>

                  {/* Doctor Picture-in-Picture Preview */}
                  <div className="absolute bottom-4 right-4 h-32 w-24 sm:h-40 sm:w-28 rounded-xl bg-slate-950 border-2 border-primary-teal shadow-xl flex flex-col items-center justify-center p-2 text-center text-white">
                    <Stethoscope className="h-6 w-6 text-primary-teal mb-1" />
                    <span className="text-[10px] font-bold">Dr. Hasan (You)</span>
                    <span className="text-[9px] text-emerald-400">720p HD</span>
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="flex items-center justify-center gap-3 py-2 z-10">
                  <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-700 text-white bg-slate-800">
                    Mute Mic
                  </Button>
                  <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-700 text-white bg-slate-800">
                    Turn Off Video
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setActiveVideoPatient(null)}
                    className="h-10 px-5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700"
                  >
                    End Call
                  </Button>
                </div>
              </div>

              {/* Consultation Chat Docked Component */}
              <ConsultationChat
                appointmentId={activeVideoPatient.appointmentId}
                currentUserId="doc-1"
                currentUserName="Prof. Dr. Syed Mahmudul Hasan"
                currentUserRole="doctor"
                otherPartyName={activeVideoPatient.name}
                otherPartyRole="patient"
                onEmergencyEndSession={() => setActiveVideoPatient(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
