"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  Clock,
  CheckCircle2,
  Award,
  Truck,
  TestTube,
  Activity,
  HeartPulse,
} from "lucide-react";
import { UserRole } from "../types";

interface AuthVisualShowcaseProps {
  role: UserRole;
}

interface RoleShowcaseData {
  image: string;
  badge: string;
  badgeIcon: React.ElementType;
  badgeColor: string;
  title: string;
  subtitle: string;
  stats: { label: string; value: string; icon: React.ElementType }[];
  highlight: string;
}

const SHOWCASE_DATA: Record<UserRole, RoleShowcaseData> = {
  patient: {
    image: "/images/family-health.jpg",
    badge: "Integrated Patient Care",
    badgeIcon: HeartPulse,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    title: "Bangladesh's Most Trusted Digital Health Ecosystem",
    subtitle:
      "Connect with verified specialist doctors in 60 seconds, receive 2-hour express medicines, and access lifetime encrypted health records.",
    stats: [
      { label: "Active Patients", value: "50,000+", icon: Activity },
      { label: "Video Consult", value: "24/7 Live", icon: Zap },
      { label: "Cold-Chain Meds", value: "2-Hr Express", icon: Truck },
    ],
    highlight: "⭐ 4.9/5 Rating from 12,000+ Verified Patient Consultations",
  },
  doctor: {
    image: "/images/hero-doctor.jpg",
    badge: "BMDC Verified Tele-Clinic",
    badgeIcon: Award,
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    title: "Empowering Doctors with Smart Clinical Telemedicine",
    subtitle:
      "Manage queues, issue cryptographically signed e-prescriptions with drug-drug safety checks, and utilize AI voice transcription.",
    stats: [
      { label: "BMDC Doctors", value: "10,000+", icon: Award },
      { label: "AI Voice Scribe", value: "Bengali/English", icon: Sparkles },
      { label: "Doctor Payouts", value: "Instant bKash", icon: Zap },
    ],
    highlight: "🛡️ Automated Drug-to-Drug Safety & Prescription QR Verification",
  },
  pharmacy: {
    image: "/images/express-pharmacy.jpg",
    badge: "DGDA Model Pharmacy Hub",
    badgeIcon: Truck,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    title: "Cold-Chain Express Delivery & Refill Automation",
    subtitle:
      "Verify genuine doctor prescriptions via tamper-proof QR scanning, eliminate duplicate fulfillment, and automate chronic monthly refill orders.",
    stats: [
      { label: "Cold Chain Temp", value: "2°C - 8°C", icon: ShieldCheck },
      { label: "Avg Dispatch", value: "24 Minutes", icon: Clock },
      { label: "Partner Hubs", value: "500+ Outlets", icon: Truck },
    ],
    highlight: "📦 Verified 100% Authentic DGDA-Compliant Medicine Supply Chain",
  },
  lab: {
    image: "/images/home-lab.jpg",
    badge: "ISO 15189 Certified Lab Network",
    badgeIcon: TestTube,
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    title: "Precision Home Sample Collection & Smart Diagnostics",
    subtitle:
      "GPS phlebotomist dispatch, automated barcode tube tracking, and instant AWS Textract OCR extraction of lab biomarker reports.",
    stats: [
      { label: "Collection Visits", value: "100% Free Home", icon: TestTube },
      { label: "Barcode Tracking", value: "End-to-End", icon: Lock },
      { label: "Diagnostic Report", value: "Instant QR", icon: Sparkles },
    ],
    highlight: "🧪 Accredited Pathologists & Automated Biomarker Trend Tracking",
  },
  admin: {
    image: "/images/telemedicine.jpg",
    badge: "Institutional Security & Control",
    badgeIcon: ShieldCheck,
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    title: "Central Operations, Audit & Emergency Dispatch",
    subtitle:
      "Verify BMDC provider credentials, monitor nationwide real-time ambulance GPS routing, manage escrow settlements, and review HIPAA compliance audit logs.",
    stats: [
      { label: "Provider Audits", value: "BMDC Verified", icon: Award },
      { label: "Cloud Uptime", value: "99.99%", icon: Zap },
      { label: "Ambulance GPS", value: "Real-time", icon: Activity },
    ],
    highlight: "🔒 Strict Role-Based Access Control (RBAC) & Winston PHI Masking",
  },
};

export function AuthVisualShowcase({ role }: AuthVisualShowcaseProps) {
  const current = SHOWCASE_DATA[role] || SHOWCASE_DATA.patient;
  const BadgeIcon = current.badgeIcon;

  return (
    <div className="relative h-full w-full rounded-3xl overflow-hidden border border-surface-border bg-slate-950 text-white flex flex-col justify-between p-8 sm:p-10 shadow-2xl min-h-[600px] lg:min-h-[660px]">
      {/* Background Image with Dynamic Fade Transition (z-0 to stay on top of bg-slate-950) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Multi-layer Gradient Overlay for crisp text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Top Header Badge & Live Status */}
      <div className="relative z-10 flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-xs font-black uppercase tracking-wider shadow-lg ${current.badgeColor}`}
          >
            <BadgeIcon className="h-4 w-4" />
            <span>{current.badge}</span>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md text-xs font-bold shadow-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>System Online</span>
        </div>
      </div>

      {/* Center & Bottom Information Overlay */}
      <div className="relative z-10 space-y-6 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="space-y-3"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg drop-shadow-sm font-medium">
              {current.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Stats Pill Matrix */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            {current.stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white space-y-1 hover:bg-white/15 transition-all shadow-lg"
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                    <StatIcon className="h-3.5 w-3.5 text-primary-teal flex-shrink-0" />
                    <span className="truncate">{stat.label}</span>
                  </div>
                  <div className="text-sm sm:text-base font-black tracking-tight text-white">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Trust Highlight Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 text-xs font-bold text-emerald-300 flex items-center gap-2.5 shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{current.highlight}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
