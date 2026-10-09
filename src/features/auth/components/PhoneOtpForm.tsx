/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { phoneSchema, otpSchema } from "../schemas/authSchema";
import { UserRole } from "../types";
import { Button } from "@/components/ui/button";
import { useRequestOtpMutation, useVerifyOtpMutation } from "@/redux/api/authApi";

interface PhoneOtpFormProps {
  role: UserRole;
  onSuccessAuth?: (role: UserRole) => void;
}

const DEMO_PHONES: Record<UserRole, string> = {
  patient: "01711223344",
  doctor: "01811223344",
  pharmacy: "01911223344",
  lab: "01611223344",
  admin: "01511223344",
};

export function PhoneOtpForm({ role, onSuccessAuth }: PhoneOtpFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState<string>(DEMO_PHONES[role] || "01712345678");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(60);

  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const isSubmitting = isRequestingOtp || isVerifyingOtp;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update phone when role changes
  useEffect(() => {
    if (DEMO_PHONES[role]) {
      setPhoneNumber(DEMO_PHONES[role]);
    }
  }, [role]);

  // 60-second countdown timer for resend OTP
  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const getFormattedPhone = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.startsWith("880")) return `+${cleaned}`;
    if (cleaned.startsWith("0")) return `+88${cleaned}`;
    return `+880${cleaned}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const formattedPhone = getFormattedPhone(phoneNumber);

    const result = phoneSchema.safeParse({ phone: formattedPhone });
    if (!result.success) {
      const msg = "Enter a valid 11-digit Bangladeshi number (e.g. 01712345678)";
      setPhoneError(msg);
      toast.error(msg);
      return;
    }

    try {
      const res = await requestOtp({ phone: formattedPhone }).unwrap();
      setStep("otp");
      setResendTimer(60);
      const demoHint = res.demoOtp ? ` (Code: ${res.demoOtp})` : "";
      toast.success(`6-Digit OTP sent to ${phoneNumber}!${demoHint}`);
      // Auto-focus first digit on next tick
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to send OTP. Please try again.";
      setPhoneError(msg);
      toast.error(msg);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    // Handle paste of full 6 digits
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const cleanDigit = value.replace(/\D/g, "");
    const newOtp = [...otpDigits];
    newOtp[index] = cleanDigit;
    setOtpDigits(newOtp);

    // Auto-focus next input
    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    const fullOtp = otpDigits.join("");
    const result = otpSchema.safeParse({ otp: fullOtp });
    if (!result.success) {
      const msg = "Please enter all 6 numeric digits";
      setOtpError(msg);
      toast.error(msg);
      return;
    }

    const formattedPhone = getFormattedPhone(phoneNumber);

    try {
      const response = await verifyOtp({
        phone: formattedPhone,
        code: fullOtp,
      }).unwrap();

      toast.success(`Phone verified! Logged in as ${response.user?.role || role.toUpperCase()}`);
      if (onSuccessAuth) {
        onSuccessAuth(role);
      }

      const targetRole = (response.user?.role || role).toLowerCase();
      switch (targetRole) {
        case "doctor":
          router.push("/dashboard/doctor");
          break;
        case "lab":
          router.push("/dashboard/lab");
          break;
        case "pharmacy":
          router.push("/dashboard/pharmacy");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "patient":
        default:
          router.push("/dashboard/patient");
          break;
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Invalid or expired OTP code.";
      setOtpError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {/* Mobile Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
              Mobile Phone Number <span className="text-rose-500">*</span>
            </label>

            <div className="relative flex items-center group">
              {/* Country Code Pill */}
              <div className="absolute left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted-bg border border-surface-border text-xs font-black text-fg-app select-none shadow-2xs">
                <span>🇧🇩</span>
                <span className="font-mono text-primary-teal">+880</span>
              </div>

              {/* Number Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d]/g, "");
                  setPhoneNumber(val);
                }}
                placeholder="1712345678"
                required
                className="w-full h-12 pl-24 pr-4 rounded-2xl bg-surface-card border border-surface-border text-sm font-semibold text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
              />
            </div>

            {phoneError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-500 animate-in fade-in duration-200">
                {phoneError}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 justify-center text-sm font-black uppercase tracking-wider rounded-2xl bg-gradient-to-r from-primary-teal via-teal-500 to-emerald-accent text-white shadow-lg shadow-primary-teal/25 hover:shadow-primary-teal/40 hover:brightness-110 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Sending SMS OTP...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Get Verification Code <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>

          {/* 1-Click Demo Fill for Phones */}
          <div className="pt-2">
            <div className="p-3.5 rounded-2xl bg-muted-bg/60 border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-extrabold text-fg-app flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary-teal" />
                  1-Click Demo Phone:
                </span>
                <span className="text-muted-fg text-[10px]">Instant SMS OTP</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(["patient", "doctor", "pharmacy", "lab", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setPhoneNumber(DEMO_PHONES[r]);
                      toast.info(`Filled demo phone for ${r.toUpperCase()}`);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      role === r
                        ? "bg-primary-teal/20 text-primary-teal border-primary-teal/40 font-extrabold"
                        : "bg-surface-card border-surface-border text-muted-fg hover:text-fg-app hover:border-primary-teal/30"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-accent/15 text-emerald-accent mx-auto border border-emerald-accent/30 shadow-md">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg text-fg-app tracking-tight">Enter 6-Digit OTP</h3>
            <p className="text-xs text-muted-fg">
              SMS code sent to{" "}
              <span className="font-mono font-bold text-fg-app">+880 {phoneNumber}</span>.{" "}
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-primary-teal font-black hover:underline ml-1"
              >
                Change Number
              </button>
            </p>
          </div>

          {/* 6 Digit Inputs */}
          <div className="flex justify-center items-center gap-2">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl bg-surface-card border border-surface-border text-fg-app focus:outline-none focus:ring-2 focus:ring-emerald-accent focus:border-transparent transition-all shadow-md"
              />
            ))}
          </div>

          {otpError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-500 text-center animate-in fade-in duration-200">
              {otpError}
            </div>
          )}

          {/* Resend Timer */}
          <div className="flex items-center justify-between text-xs text-muted-fg px-1">
            <span>Didn&apos;t receive code?</span>
            {resendTimer > 0 ? (
              <span className="font-mono text-primary-teal font-bold">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setResendTimer(60);
                  toast.success("New OTP sent via SMS!");
                }}
                className="text-primary-teal font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Resend Code
              </button>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 justify-center text-sm font-black uppercase tracking-wider rounded-2xl bg-gradient-to-r from-emerald-accent via-teal-500 to-primary-teal text-white shadow-lg shadow-emerald-accent/25 hover:shadow-emerald-accent/40 hover:brightness-110 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying Code...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Verify & Sign In <CheckCircle2 className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
