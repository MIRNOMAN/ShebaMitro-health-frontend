/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  MailCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/redux/api/authApi";

interface EmailVerificationFormProps {
  initialEmail?: string;
  onSuccess?: () => void;
  onBack?: () => void;
  showBackToRegister?: boolean;
}

export function EmailVerificationForm({
  initialEmail = "",
  onSuccess,
  onBack,
  showBackToRegister = true,
}: EmailVerificationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const queryEmail = searchParams.get("email");

  const [email, setEmail] = useState<string>(initialEmail || queryEmail || "");
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(!initialEmail && !queryEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(60);

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    // Focus first digit box on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Pasting full OTP code
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

    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      const msg = "Please provide your registered email address.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      const msg = "Please enter the complete 6-digit verification code.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      const result = await verifyEmail({
        email: cleanEmail,
        code: fullOtp,
      }).unwrap();

      toast.success(result.message || "Email verified successfully! Welcome to ShebaMitro.");

      if (onSuccess) {
        onSuccess();
      } else if (redirectUrl && !redirectUrl.startsWith("/dashboard")) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Invalid or expired verification code. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }

    try {
      const res = await resendVerification({ email: cleanEmail }).unwrap();
      setResendTimer(60);
      const demoHint = res.demoCode ? ` (Code: ${res.demoCode})` : "";
      toast.success(`New verification code sent to ${cleanEmail}!${demoHint}`);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to resend code. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-teal/15 border border-primary-teal/30 flex items-center justify-center text-primary-teal shadow-inner">
          <MailCheck className="w-7 h-7 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-fg-app tracking-tight">
          Verify Your Email
        </h2>
        <p className="text-xs sm:text-sm text-muted-fg max-w-sm mx-auto">
          We sent a 6-digit verification code to{" "}
          <span className="font-extrabold text-primary-teal">
            {email || "your registered email"}
          </span>
          . Please enter it below to activate your account.
        </p>
      </div>

      {/* Email Edit Row */}
      {isEditingEmail ? (
        <div className="space-y-1.5 p-3 rounded-2xl bg-muted-bg/50 border border-surface-border">
          <label className="text-xs font-bold text-muted-fg">Email Address</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 bg-surface-card px-3 py-2 rounded-xl border border-surface-border text-sm font-semibold outline-none focus:border-primary-teal"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditingEmail(false)}
              className="rounded-xl text-xs font-bold"
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-muted-bg/40 border border-surface-border/60 text-xs">
          <div className="flex items-center gap-2 text-fg-app font-semibold truncate">
            <Mail className="w-4 h-4 text-muted-fg shrink-0" />
            <span className="truncate">{email || "No email set"}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingEmail(true)}
            className="text-[11px] font-bold text-primary-teal hover:underline cursor-pointer shrink-0"
          >
            Change
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form with 6-Digit OTP Box */}
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-fg text-center block">
            6-Digit Verification Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl border-2 border-surface-border bg-surface-card text-fg-app shadow-sm outline-none transition-all focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/20"
              />
            ))}
          </div>
        </div>

        {/* Resend Code Button & Countdown */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-muted-fg">Didn&apos;t receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className={`font-black flex items-center gap-1.5 transition-colors cursor-pointer ${
              resendTimer > 0 || isResending
                ? "text-muted-fg/60 cursor-not-allowed"
                : "text-primary-teal hover:underline"
            }`}
          >
            {isResending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : resendTimer > 0 ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-muted-fg" />
                <span>Resend in {resendTimer}s</span>
              </>
            ) : (
              <span>Resend Code</span>
            )}
          </button>
        </div>

        {/* Submit Verification Button */}
        <Button
          type="submit"
          disabled={isVerifying || otpDigits.join("").length !== 6}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify & Activate Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Back button */}
      {showBackToRegister && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onBack ? onBack : () => router.push("/register")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-fg hover:text-fg-app transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registration</span>
          </button>
        </div>
      )}

      {/* Security badge */}
      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-fg/80 border-t border-surface-border/60">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>256-Bit SSL Encrypted Verification • ShebaMitro SafeCare</span>
      </div>
    </div>
  );
}
