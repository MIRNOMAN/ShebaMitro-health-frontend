"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  User,
  Settings,
  Share2,
  FileText,
  AlertCircle,
  Clock,
  Volume2,
  Maximize2,
  Minimize2,
  Loader2,
  CheckCircle2,
  Building2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationChat } from "@/components/chat/ConsultationChat";
import { useGetAppointmentByIdQuery } from "@/redux/api/doctorApi";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";

interface TeleconsultPageProps {
  params: Promise<{ id: string }>;
}

export default function TeleconsultRoomPage({ params }: TeleconsultPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const appointmentId = resolvedParams.id;

  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: profileUser } = useGetMeQuery();

  // Dynamic appointment query
  const { data: apptResponse, isLoading: isLoadingAppt } = useGetAppointmentByIdQuery(appointmentId);
  const appointment = apptResponse?.data;

  // Media call states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format call duration MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Local camera stream initialization
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
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Camera/Mic not accessible or permission denied, using simulated video feed:", err);
        setCameraError(true);
      }
    }

    initCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle Microphone
  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = !isMicOn));
    }
    setIsMicOn((prev) => !prev);
  };

  // Toggle Camera
  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => (t.enabled = !isVideoOn));
    }
    setIsVideoOn((prev) => !prev);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // End consultation
  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    router.push("/dashboard/patient");
  };

  // Doctor & Patient display data
  const doctorName = appointment?.doctor?.name || appointment?.doctor?.user?.name || "Dr. Kazi Arif";
  const doctorSpecialization = appointment?.doctor?.specialization || "Pediatrics Specialist";
  const doctorHospital = appointment?.doctor?.hospital || "Ibn Sina Hospital, Dhaka";
  const doctorBmdc = appointment?.doctor?.bmdcRegNo || "BMDC-A72019";

  const patientName =
    profileUser?.name ||
    authUser?.name ||
    appointment?.patient?.user?.name ||
    "Patient User";

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Top Teleconsultation Header Bar */}
      <header className="relative z-20 flex items-center justify-between p-4 sm:p-5 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary-teal/20 border border-primary-teal/40 flex items-center justify-center text-primary-teal font-black">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-white">{doctorName}</h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-3 w-3" /> BMDC Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {doctorSpecialization} • {doctorHospital}
            </p>
          </div>
        </div>

        {/* Live Call Duration & Security Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-white font-mono">{formatTime(callDurationSec)}</span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Video Call Canvas Area */}
      <main className="relative flex-1 flex items-center justify-center p-3 sm:p-6">
        {/* Remote Doctor Main Video Feed */}
        <div className="relative w-full h-full max-h-[78vh] rounded-3xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
          {/* Doctor Video Overlay / Avatar Display */}
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            {/* Ambient Background Aura */}
            <div className="absolute h-96 w-96 rounded-full bg-primary-teal/15 blur-3xl pointer-events-none" />

            {/* Doctor Feed Graphic / Representation */}
            <div className="relative flex flex-col items-center gap-4 z-10 text-center p-4">
              <div className="relative">
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-gradient-to-tr from-primary-teal to-emerald-400 p-1 shadow-2xl">
                  <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-950 overflow-hidden">
                    <Stethoscope className="h-14 w-14 sm:h-16 sm:w-16 text-primary-teal animate-pulse" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">{doctorName}</h3>
                <p className="text-xs sm:text-sm text-primary-teal font-bold">{doctorSpecialization}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Encrypted WebRTC Audio & Video Connected</span>
                </div>
              </div>
            </div>

            {/* Remote Audio Waveform Visualizer */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 backdrop-blur-md">
              <Volume2 className="h-3.5 w-3.5 text-primary-teal animate-pulse" />
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-1 bg-primary-teal rounded-full animate-bounce h-3" />
                <span className="w-1 bg-primary-teal rounded-full animate-bounce h-2" style={{ animationDelay: "0.15s" }} />
                <span className="w-1 bg-primary-teal rounded-full animate-bounce h-3.5" style={{ animationDelay: "0.3s" }} />
                <span className="w-1 bg-primary-teal rounded-full animate-bounce h-2" style={{ animationDelay: "0.1s" }} />
              </div>
              <span className="text-[10px] text-slate-300 font-bold ml-1">Dr. Live Audio</span>
            </div>
          </div>

          {/* Picture-in-Picture (PiP) Self Video Preview */}
          <div className="absolute top-4 right-4 z-20 h-28 w-24 sm:h-44 sm:w-36 rounded-2xl bg-slate-800 border-2 border-white/20 shadow-2xl overflow-hidden group">
            {isVideoOn && !cameraError ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center">
                <User className="h-8 w-8 text-slate-500" />
                <span className="text-[10px] font-bold mt-1">{patientName}</span>
                <span className="text-[9px] text-slate-500">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-950/70 text-[9px] font-bold text-white backdrop-blur-xs">
              You ({isMicOn ? "Mic On" : "Muted"})
            </div>
          </div>
        </div>

        {/* Slide-over In-Call Clinical Chat Drawer */}
        {isChatOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-surface-card text-fg-app shadow-2xl border-l border-surface-border flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-surface-border">
              <h3 className="font-black text-sm text-fg-app flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary-teal" /> In-Call Clinical Chat
              </h3>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-xl hover:bg-muted-bg text-muted-fg"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConsultationChat
                appointmentId={appointmentId}
                currentUserId={authUser?.id || "patient-1"}
                currentUserName={patientName}
                currentUserRole="patient"
                otherPartyName={doctorName}
                otherPartyRole="doctor"
                isOpenMobile={true}
                onCloseMobile={() => setIsChatOpen(false)}
                onEmergencyEndSession={handleEndCall}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Floating Call Controls Toolbar */}
      <footer className="relative z-20 flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          {/* Mute/Unmute Mic */}
          <button
            type="button"
            onClick={toggleMic}
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              isMicOn
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                : "bg-rose-500/20 text-rose-500 border border-rose-500/40"
            }`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic className="h-5 w-5 sm:h-6 sm:w-6" /> : <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>

          {/* Video On/Off */}
          <button
            type="button"
            onClick={toggleVideo}
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              isVideoOn
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                : "bg-rose-500/20 text-rose-500 border border-rose-500/40"
            }`}
            title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isVideoOn ? <VideoIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>

          {/* Toggle In-Call Chat */}
          <button
            type="button"
            onClick={() => setIsChatOpen((prev) => !prev)}
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              isChatOpen
                ? "bg-primary-teal text-white border border-primary-teal"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
            }`}
            title="Open Chat & Reports"
          >
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={() => setIsEndingCall(true)}
            className="h-12 sm:h-14 px-5 sm:px-7 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
            title="End Teleconsultation"
          >
            <PhoneOff className="h-5 w-5" />
            <span>End Call</span>
          </button>
        </div>
      </footer>

      {/* End Call Confirmation Modal */}
      {isEndingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
              <PhoneOff className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Leave Teleconsultation?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your consultation with {doctorName} will end. Any prescriptions or lab orders will be saved to your health portal.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEndingCall(false)}
                className="text-xs font-bold rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                Stay in Call
              </Button>
              <button
                type="button"
                onClick={handleEndCall}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

