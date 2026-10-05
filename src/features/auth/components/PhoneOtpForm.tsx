"use client";

import React, { useState, useRef, useEffect } from "react";
import { Phone, ArrowRight, ShieldCheck, KeyRound, RotateCcw, CheckCircle2 } from "lucide-react";
import { phoneSchema, otpSchema } from "../schemas/authSchema";
import { UserRole } from "../types";
import { Button } from "@/components/ui/button";

interface PhoneOtpFormProps {
  role: UserRole;
  onSuccessAuth: (role: UserRole) => void;
}

export function PhoneOtpForm({ role, onSuccessAuth }: PhoneOtpFormProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState<string>("01712345678");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer for resend OTP
  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const result = phoneSchema.safeParse({ phone: phoneNumber });
    if (!result.success) {
      setPhoneError(result.error.issues[0]?.message || "Invalid phone number");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("otp");
      setResendTimer(60);
    }, 500);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of 6 digits
      const digits = value.slice(0, 6).split("");
      const newOtp = [...otpDigits];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtpDigits(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    const fullOtp = otpDigits.join("");
    const result = otpSchema.safeParse({ otp: fullOtp });
    if (!result.success) {
      setOtpError(result.error.issues[0]?.message || "Invalid 6-digit OTP code");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessAuth(role);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mobile Phone Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-1.5 text-xs font-bold text-fg-app border-r border-card-border pr-2.5">
                <span>🇧🇩</span>
                <span>+880</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="1712345678"
                className="w-full h-11 pl-24 pr-4 rounded-xl bg-card border border-card-border text-sm text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all shadow-xs"
              />
            </div>
            {phoneError && (
              <p className="text-xs font-semibold text-rose-500 pt-0.5">{phoneError}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full h-11 justify-center text-sm shadow-md"
          >
            {isSubmitting ? (
              "Sending OTP..."
            ) : (
              <span className="flex items-center gap-1.5">
                Get Verification Code <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto border border-emerald-500/20">
              <KeyRound className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-base text-fg-app">Enter 6-Digit OTP Code</h4>
            <p className="text-xs text-muted-foreground">
              Code sent to <span className="font-bold text-fg-app">{phoneNumber}</span>.{" "}
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-primary-teal font-semibold hover:underline"
              >
                Change
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
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold rounded-xl bg-card border border-card-border text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all shadow-xs"
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs font-semibold text-rose-500 text-center">{otpError}</p>
          )}

          {/* Resend Timer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Didn't receive code?</span>
            {resendTimer > 0 ? (
              <span className="font-mono text-primary-teal font-semibold">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setResendTimer(60)}
                className="text-primary-teal font-semibold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Resend OTP
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="emerald"
            disabled={isSubmitting}
            className="w-full h-11 justify-center text-sm shadow-md"
          >
            {isSubmitting ? (
              "Verifying..."
            ) : (
              <span className="flex items-center gap-1.5">
                Verify & Login <CheckCircle2 className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
