"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  KeyRound,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/redux/api/authApi";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"identifier" | "reset">("identifier");
  const [identifier, setIdentifier] = useState<string>("patient@shebamitro.health");
  const [identifierError, setIdentifierError] = useState<string | null>(null);

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(60);

  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer for resend OTP
  useEffect(() => {
    if (step !== "reset" || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdentifierError(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      const msg = "Please enter your registered email or phone number.";
      setIdentifierError(msg);
      toast.error(msg);
      return;
    }

    try {
      const res = await forgotPassword({ identifier: cleanIdentifier }).unwrap();
      setStep("reset");
      setResendTimer(60);
      const demoHint = res.demoCode ? ` (OTP: ${res.demoCode})` : "";
      toast.success(`Password reset OTP sent to ${cleanIdentifier}!${demoHint}`);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to send reset code. Please try again.";
      setIdentifierError(msg);
      toast.error(msg);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
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

    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      const msg = "Please enter the complete 6-digit OTP code.";
      setResetError(msg);
      toast.error(msg);
      return;
    }

    if (newPassword.length < 8) {
      const msg = "New password must be at least 8 characters long.";
      setResetError(msg);
      toast.error(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match. Please re-enter.";
      setResetError(msg);
      toast.error(msg);
      return;
    }

    try {
      const res = await resetPassword({
        identifier: identifier.trim(),
        code: fullOtp,
        newPassword,
      }).unwrap();

      toast.success(res.message || "Password reset successfully! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Invalid or expired reset code. Please try again.";
      setResetError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-fg hover:text-primary-teal transition-colors pb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-fg-app">
          {step === "identifier" ? "Forgot Password?" : "Reset Your Password"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-fg font-medium">
          {step === "identifier"
            ? "Enter your registered email address or mobile number. We'll send you a 6-digit verification code to reset your password."
            : `Enter the 6-digit verification code sent to ${identifier} and choose a strong new password.`}
        </p>
      </div>

      {step === "identifier" ? (
        /* Step 1: Identifier Form */
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
              Email or Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="patient@shebamitro.health or 01712345678"
                required
                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
              />
            </div>
          </div>

          {identifierError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-500">
              {identifierError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSendingOtp}
            className="w-full h-12 justify-center text-sm font-black uppercase tracking-wider rounded-2xl bg-gradient-to-r from-primary-teal via-teal-500 to-emerald-accent text-white shadow-lg shadow-primary-teal/25 hover:brightness-110 transition-all cursor-pointer"
          >
            {isSendingOtp ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Sending Verification Code...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Send Reset Code <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      ) : (
        /* Step 2: OTP + New Password Form */
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* 6-Digit OTP Inputs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
                6-Digit Reset Code <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setStep("identifier")}
                className="text-xs text-primary-teal font-bold hover:underline"
              >
                Change Email/Phone
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`h-13 sm:h-14 text-center font-mono font-black text-xl sm:text-2xl rounded-2xl bg-surface-card border transition-all focus:outline-none focus:ring-2 focus:ring-primary-teal shadow-xs ${
                    digit
                      ? "border-primary-teal text-primary-teal bg-primary-teal/5"
                      : "border-surface-border text-fg-app"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* New Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center group">
              <Lock className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="w-full h-12 pl-10 pr-11 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-muted-fg hover:text-fg-app transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center group">
              <Lock className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                required
                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
              />
            </div>
          </div>

          {resetError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-500">
              {resetError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isResettingPassword}
            className="w-full h-12 justify-center text-sm font-black uppercase tracking-wider rounded-2xl bg-gradient-to-r from-primary-teal via-teal-500 to-emerald-accent text-white shadow-lg shadow-primary-teal/25 hover:brightness-110 transition-all cursor-pointer"
          >
            {isResettingPassword ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Resetting Password...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Update Password & Sign In <CheckCircle2 className="h-4 w-4" />
              </span>
            )}
          </Button>

          {/* Resend Code Section */}
          <div className="text-center pt-2">
            {resendTimer > 0 ? (
              <span className="text-xs font-semibold text-muted-fg">
                Resend code in{" "}
                <span className="font-mono font-bold text-primary-teal">{resendTimer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-xs font-bold text-primary-teal hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resend 6-Digit Code
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
