"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RoleTabs } from "@/features/auth/components/RoleTabs";
import { PasswordLoginForm } from "@/features/auth/components/PasswordLoginForm";
import { PhoneOtpForm } from "@/features/auth/components/PhoneOtpForm";
import { AuthVisualShowcase } from "@/features/auth/components/AuthVisualShowcase";
import { UserRole, AuthMode } from "@/features/auth/types";
import {
  KeyRound,
  Smartphone,
  ShieldCheck,
  Sparkles,
  User,
  Stethoscope,
  Pill,
  FlaskConical,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") || "patient").toLowerCase() as UserRole;

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    ["patient", "doctor", "lab", "pharmacy", "admin"].includes(initialRole)
      ? initialRole
      : "patient"
  );
  const [authMode, setAuthMode] = useState<AuthMode>("password");

  const getRoleHeader = (role: UserRole) => {
    switch (role) {
      case "doctor":
        return {
          title: "BMDC Doctor Tele-Clinic",
          badge: "BMDC Verified Registry",
          icon: Stethoscope,
          color: "text-primary-teal bg-primary-teal/10 border-primary-teal/30",
        };
      case "pharmacy":
        return {
          title: "Model Pharmacy Partner",
          badge: "DGDA Model Pharmacy",
          icon: Pill,
          color: "text-coral-accent bg-coral-accent/10 border-coral-accent/30",
        };
      case "lab":
        return {
          title: "Diagnostic Lab Network",
          badge: "ISO 15189 Diagnostic Hub",
          icon: FlaskConical,
          color: "text-violet-accent bg-violet-accent/10 border-violet-accent/30",
        };
      case "admin":
        return {
          title: "Institutional Security Hub",
          badge: "Security & Operations",
          icon: ShieldAlert,
          color: "text-rose-500 bg-rose-500/10 border-rose-500/30",
        };
      case "patient":
      default:
        return {
          title: "Patient & Family Portal",
          badge: "Smart Healthcare Account",
          icon: User,
          color: "text-emerald-accent bg-emerald-accent/10 border-emerald-accent/30",
        };
    }
  };

  const headerInfo = getRoleHeader(selectedRole);
  const HeaderIcon = headerInfo.icon;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Visual Dynamic Showcase (Spans 5 cols on lg, 6 on xl) */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-6">
        <AuthVisualShowcase role={selectedRole} />
      </div>

      {/* Right Column: Authentication Card (Spans 7 cols on lg, 6 on xl) */}
      <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
        <div className="relative w-full rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-9 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Ambient Glow Bubbles */}
          <div className="absolute -top-24 -right-24 w-52 h-52 bg-primary-teal/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-emerald-accent/15 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative space-y-2.5 pb-5 border-b border-surface-border">
            <div className="flex items-center justify-between">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider ${headerInfo.color}`}
              >
                <HeaderIcon className="h-3.5 w-3.5" />
                <span>{headerInfo.badge}</span>
              </div>

              <span className="text-[11px] font-bold text-muted-fg flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-accent" /> 256-Bit SSL
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-fg-app">
                Sign In to ShebaMitro
              </h1>
              <p className="text-xs sm:text-sm text-muted-fg mt-1 leading-relaxed">
                Access your personalized clinical dashboard, prescriptions, and health network.
              </p>
            </div>
          </div>

          {/* Interactive Role Tabs */}
          <div className="pt-4">
            <RoleTabs selectedRole={selectedRole} onSelectRole={setSelectedRole} />
          </div>

          {/* Auth Method Toggle (Password vs Phone OTP) */}
          <div className="flex p-1.5 my-5 rounded-2xl bg-muted-bg/70 border border-surface-border">
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "password"
                  ? "bg-surface-card text-fg-app shadow-md border border-surface-border"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              <KeyRound className="h-4 w-4 text-primary-teal" />
              <span>Email & Password</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode("otp")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === "otp"
                  ? "bg-surface-card text-fg-app shadow-md border border-surface-border"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              <Smartphone className="h-4 w-4 text-emerald-accent" />
              <span>Instant Phone OTP</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="relative">
            {authMode === "password" ? (
              <PasswordLoginForm role={selectedRole} />
            ) : (
              <PhoneOtpForm role={selectedRole} />
            )}
          </div>

          {/* Footer Registration Link */}
          <div className="relative pt-5 mt-5 border-t border-surface-border text-center space-y-2">
            <p className="text-xs text-muted-fg">
              Don&apos;t have an account yet?{" "}
              <Link
                href={`/register?role=${selectedRole}`}
                className="font-black text-primary-teal hover:underline underline-offset-4 inline-flex items-center gap-1"
              >
                Register as {selectedRole.toUpperCase()} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-fg/70 pt-1">
              <span>National Healthcare Network</span>
              <span>•</span>
              <span>DGDA Licensed</span>
              <span>•</span>
              <span>BMDC Accredited</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 rounded-3xl border border-surface-border bg-surface-card animate-pulse flex items-center justify-center">
          <span className="text-xs text-muted-fg font-bold">Loading ShebaMitro Portal...</span>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
