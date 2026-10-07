"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthVisualShowcase } from "@/features/auth/components/AuthVisualShowcase";
import { UserRole } from "@/features/auth/types";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") || "patient").toLowerCase() as UserRole;

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    ["patient", "doctor", "lab", "pharmacy"].includes(initialRole)
      ? initialRole
      : "patient"
  );

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Visual Showcase */}
      <div className="hidden lg:block lg:col-span-6 xl:col-span-6">
        <AuthVisualShowcase role={selectedRole} />
      </div>

      {/* Right Column: Registration Card */}
      <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
        <div className="relative w-full rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-9 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-52 h-52 bg-primary-teal/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-emerald-accent/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative space-y-2.5 pb-5 border-b border-surface-border">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-teal/15 border border-primary-teal/30 text-primary-teal text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Join ShebaMitro Health</span>
              </div>

              <span className="text-[11px] font-bold text-muted-fg flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-accent" /> DGDA Compliant
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-fg-app">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-muted-fg mt-1 leading-relaxed">
                Connect with Bangladesh&apos;s unified digital healthcare network with instant access to verified doctors & diagnostics.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="relative pt-4">
            <RegisterForm currentRole={selectedRole} onChangeRole={setSelectedRole} />
          </div>

          {/* Footer Link */}
          <div className="relative pt-5 mt-5 border-t border-surface-border text-center space-y-2">
            <p className="text-xs text-muted-fg">
              Already have an account?{" "}
              <Link
                href={`/login?role=${selectedRole}`}
                className="font-black text-primary-teal hover:underline underline-offset-4 inline-flex items-center gap-1"
              >
                Sign In Here <ArrowRight className="h-3.5 w-3.5" />
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 rounded-3xl border border-surface-border bg-surface-card animate-pulse flex items-center justify-center">
          <span className="text-xs text-muted-fg font-bold">Loading ShebaMitro Registration Portal...</span>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
