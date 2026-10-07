"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  FlaskConical,
  Pill,
} from "lucide-react";
import { toast } from "sonner";
import { registerSchema } from "../schemas/authSchema";
import { UserRole } from "../types";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/api/authApi";

interface RegisterFormProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

const ROLES: {
  id: UserRole;
  label: string;
  icon: React.ElementType;
  badge: string;
}[] = [
  {
    id: "patient",
    label: "Patient",
    icon: UserCheck,
    badge: "Personal Health",
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: Stethoscope,
    badge: "BMDC Verified",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    icon: Pill,
    badge: "DGDA Licensed",
  },
  {
    id: "lab",
    label: "Diagnostic Lab",
    icon: FlaskConical,
    badge: "ISO Certified",
  },
];

export function RegisterForm({ currentRole, onChangeRole }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [registerUser, { isLoading }] = useRegisterMutation();

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(
    Boolean
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      const msg = "Passwords do not match. Please re-type your password.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    const backendRole = currentRole.toUpperCase() as
      | "PATIENT"
      | "DOCTOR"
      | "LAB"
      | "PHARMACY";

    const validation = registerSchema.safeParse({
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
      role: backendRole,
      agreeToTerms,
    });

    if (!validation.success) {
      const msg = validation.error.issues[0]?.message || "Please check your inputs";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      const result = await registerUser({
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role: backendRole,
      }).unwrap();

      toast.success(
        `Account created successfully! Welcome to ShebaMitro as ${result.user?.role || backendRole}.`
      );

      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      // Route to respective role dashboard
      switch (currentRole) {
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
    } catch (err: unknown) {
      const apiError = err as {
        data?: {
          message?: string | string[];
          detail?: string;
          invalidParams?: Array<{ field?: string; message: string }> | string[];
          title?: string;
        };
        status?: number;
      };

      let errorMsg = "Registration failed. Please try again.";

      if (apiError?.data?.invalidParams && Array.isArray(apiError.data.invalidParams)) {
        errorMsg = apiError.data.invalidParams
          .map((item) => (typeof item === "string" ? item : item.message || JSON.stringify(item)))
          .join(", ");
      } else if (apiError?.data?.detail) {
        errorMsg = apiError.data.detail;
      } else if (apiError?.data?.message) {
        const raw = apiError.data.message;
        errorMsg = Array.isArray(raw) ? raw.join(", ") : raw;
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Selection Grid */}
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-muted-fg flex items-center justify-between">
          <span>Select Account Type</span>
          <span className="text-primary-teal text-[11px] font-bold">Step 1 of 2</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onChangeRole(r.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all duration-200 relative cursor-pointer ${
                  isSelected
                    ? "border-primary-teal bg-primary-teal/15 shadow-sm ring-1 ring-primary-teal"
                    : "border-surface-border bg-surface-card hover:bg-muted-bg"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={`p-1.5 rounded-xl ${
                      isSelected ? "bg-primary-teal text-white" : "bg-muted-bg text-muted-fg"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {isSelected && (
                    <span className="h-3.5 w-3.5 rounded-full bg-emerald-accent text-white flex items-center justify-center">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-fg-app">{r.label}</div>
                <div className="text-[9px] text-muted-fg font-mono uppercase">{r.badge}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-3 pt-1">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center group">
            <Mail className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`Enter your ${currentRole} email`}
              required
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
            Phone Number (Optional)
          </label>
          <div className="relative flex items-center group">
            <Phone className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01712345678"
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center group">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase & number"
              required
              className="w-full h-11 pl-10 pr-11 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-muted-fg hover:text-fg-app transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength Bar */}
          {password && (
            <div className="pt-1 space-y-1">
              <div className="flex gap-1 h-1.5 w-full bg-muted-bg rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strengthScore === 1
                      ? "w-1/4 bg-rose-500"
                      : strengthScore === 2
                      ? "w-2/4 bg-amber-500"
                      : strengthScore === 3
                      ? "w-3/4 bg-teal-500"
                      : "w-full bg-emerald-500"
                  }`}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-fg">
                <span>
                  {strengthScore <= 1
                    ? "Weak"
                    : strengthScore <= 2
                    ? "Medium"
                    : strengthScore === 3
                    ? "Good"
                    : "Strong ✓"}
                </span>
                <span>8+ chars • Uppercase • Numbers</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center group">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 rounded border-surface-border text-primary-teal focus:ring-primary-teal"
          />
          <span className="text-xs text-muted-fg leading-tight">
            I agree to ShebaMitro&apos;s{" "}
            <a href="/terms" className="text-primary-teal font-bold hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary-teal font-bold hover:underline">
              Patient Data Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-start gap-2 text-xs font-bold text-rose-500">
            <span>{errorMessage}</span>
          </div>
          {errorMessage.toLowerCase().includes("already exist") && (
            <button
              type="button"
              onClick={() => router.push(`/login?role=${currentRole}`)}
              className="inline-flex items-center gap-1.5 text-xs font-black text-primary-teal hover:underline cursor-pointer"
            >
              <span>Click here to Sign In with this email</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !agreeToTerms}
        className="w-full h-12 justify-center text-sm font-black uppercase tracking-wider rounded-2xl bg-gradient-to-r from-primary-teal via-teal-500 to-emerald-accent text-white shadow-lg shadow-primary-teal/25 hover:shadow-primary-teal/40 hover:brightness-110 transition-all cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Create {currentRole.toUpperCase()} Account <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-fg pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-accent" />
        <span>256-Bit Encrypted Healthcare Records</span>
      </div>
    </form>
  );
}
