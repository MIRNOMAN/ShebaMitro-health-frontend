import { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | ShebaMitro Healthcare Ecosystem",
  description: "Reset your ShebaMitro account password securely using 6-digit OTP verification.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 rounded-3xl border border-surface-border bg-surface-card animate-pulse flex items-center justify-center">
          <span className="text-xs text-muted-fg font-bold">Loading Password Reset Portal...</span>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
