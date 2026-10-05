"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RoleTabs } from "@/features/auth/components/RoleTabs";
import { PhoneOtpForm } from "@/features/auth/components/PhoneOtpForm";
import { PasswordLoginForm } from "@/features/auth/components/PasswordLoginForm";
import { UserRole, AuthMode } from "@/features/auth/types";
import { ShieldCheck, Smartphone, Lock, Sparkles, HeartPulse } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [authMode, setAuthMode] = useState<AuthMode>("otp");

  const handleSuccessAuth = (role: UserRole) => {
    // Set cookies for session & role so middleware can intercept
    document.cookie = `sheba_session=active_jwt_token_${Date.now()}; path=/; max-age=86400`;
    document.cookie = `sheba_role=${role}; path=/; max-age=86400`;

    // Role-specific redirect matching RBAC rules
    switch (role) {
      case "doctor":
        router.push("/dashboard/doctor");
        break;
      case "lab":
        router.push("/dashboard/lab");
        break;
      case "pharmacy":
        router.push("/dashboard/pharmacy");
        break;
      case "patient":
      default:
        router.push("/dashboard/patient");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-radial from-primary-teal/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center relative z-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-teal/10 text-primary-teal border border-primary-teal/30 shadow-md">
          <HeartPulse className="h-6 w-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
          Welcome to <span className="text-primary-teal">ShebaMitro</span>
        </h2>
        <p className="text-xs text-muted-foreground">
          Single Sign-On portal for Patients, Specialist Doctors, Labs & Pharmacies
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-xl space-y-6">
          {/* Role Selection Tabs with Sliding Underline */}
          <RoleTabs selectedRole={selectedRole} onSelectRole={setSelectedRole} />

          {/* Auth Mode Toggle (OTP vs Password) */}
          <div className="flex items-center justify-between bg-muted/40 p-1.5 rounded-xl border border-card-border/60 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode("otp")}
              className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                authMode === "otp"
                  ? "bg-card text-primary-teal shadow-xs border border-card-border"
                  : "text-muted-foreground hover:text-fg-app"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Phone OTP Login
            </button>

            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                authMode === "password"
                  ? "bg-card text-primary-teal shadow-xs border border-card-border"
                  : "text-muted-foreground hover:text-fg-app"
              }`}
            >
              <Lock className="h-3.5 w-3.5" /> Password Auth
            </button>
          </div>

          {/* Active Auth Form */}
          {authMode === "otp" ? (
            <PhoneOtpForm role={selectedRole} onSuccessAuth={handleSuccessAuth} />
          ) : (
            <PasswordLoginForm role={selectedRole} onSuccessAuth={handleSuccessAuth} />
          )}

          {/* Trust Footer */}
          <div className="pt-4 border-t border-card-border/60 text-center space-y-1">
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              256-Bit Encrypted Healthcare Session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
