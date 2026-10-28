"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Clock,
  User,
  ShieldCheck,
  Calendar,
  ArrowRight,
  PhoneCall,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDoctorAppointmentsQuery } from "@/redux/api/doctorApi";

export default function DoctorTeleconsultationLobbyPage() {
  const { data: appointmentsRes, isLoading, refetch } = useGetDoctorAppointmentsQuery({});
  const appointments = appointmentsRes?.data || [];

  // Media preview states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Filter video consultations
  const onlineConsultations = appointments.filter(
    (appt: any) => appt.type === "ONLINE" || !appt.type
  );

  useEffect(() => {
    let active = true;
    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (!active) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Camera preview permission not granted:", err);
        setCameraError(true);
      }
    }

    if (isVideoOn) {
      initCamera();
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn]);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = !isMicOn));
    }
    setIsMicOn((prev) => !prev);
  };

  const toggleVideo = () => {
    if (isVideoOn && streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => (t.enabled = false));
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setIsVideoOn((prev) => !prev);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/15 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <Video className="h-4 w-4" /> Telemedicine Command Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Doctor <span className="text-primary-teal">Teleconsultation</span> Room
          </h1>
          <p className="text-xs text-muted-fg">
            Conduct HD encrypted WebRTC teleconsultations with live EHR, prescription writer, and chat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            WebRTC Live Room Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera / Mic Hardware Self-Check */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-fg-app flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary-teal" /> Hardware & Audio Check
              </h3>
              <span className="text-[11px] font-bold text-muted-fg">Preview Mode</span>
            </div>

            {/* Video Preview Box */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
              {isVideoOn && !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-4 text-center">
                  <User className="h-12 w-12 text-slate-600" />
                  <p className="text-xs font-bold">Camera is inactive</p>
                  <p className="text-[10px] text-slate-500">Enable camera access in your browser to preview.</p>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isVideoOn ? "bg-emerald-400" : "bg-rose-500"}`} />
                <span>{isVideoOn ? "Camera Active" : "Camera Muted"}</span>
              </div>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isMicOn
                    ? "bg-primary-teal/10 border-primary-teal/30 text-primary-teal hover:bg-primary-teal/20"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
                }`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={toggleVideo}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isVideoOn
                    ? "bg-primary-teal/10 border-primary-teal/30 text-primary-teal hover:bg-primary-teal/20"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
                }`}
                title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Teleconsultation Appointments Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="font-black text-base text-fg-app flex items-center gap-2">
                  <Clock className="h-4 w-4 text-violet-accent" /> Teleconsultation Patient Queue
                </h3>
                <p className="text-xs text-muted-fg mt-0.5">
                  Scheduled video appointments waiting for consultation.
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

            {isLoading ? (
              <div className="p-10 text-center text-muted-fg space-y-3">
                <Loader2 className="w-6 h-6 text-primary-teal animate-spin mx-auto" />
                <p className="text-xs font-bold">Loading live teleconsultation queue...</p>
              </div>
            ) : onlineConsultations.length > 0 ? (
              <div className="space-y-3">
                {onlineConsultations.map((appt: any) => {
                  const startTime = new Date(appt.slotStartTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                  const pName = appt.patient?.user?.name || appt.patient?.name || "Patient Consultation";

                  return (
                    <div
                      key={appt.id}
                      className="p-4 rounded-2xl border border-surface-border bg-muted-bg/30 hover:border-primary-teal/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="h-11 w-11 rounded-2xl bg-violet-accent/15 text-violet-accent border border-violet-accent/30 flex items-center justify-center font-black shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-fg-app">{pName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-accent/10 text-violet-accent border border-violet-accent/20">
                              Online Video
                            </span>
                          </div>
                          <p className="text-xs text-muted-fg mt-0.5">
                            Scheduled: <span className="font-bold text-fg-app">{startTime}</span> • Ref: SM-
                            {appt.id.slice(0, 6).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <Link href={`/teleconsult/${appt.id}`} className="w-full sm:w-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full sm:w-auto gap-2 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Join Call
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 text-muted-fg">
                <Video className="h-10 w-10 text-muted-fg/40 mx-auto" />
                <p className="text-sm font-bold text-fg-app">No active online appointments right now</p>
                <p className="text-xs max-w-sm mx-auto">
                  Patients will appear here automatically when they book an online consultation slot with you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
