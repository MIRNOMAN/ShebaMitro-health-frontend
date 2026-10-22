import { Metadata } from "next";
import { Suspense } from "react";
import { EmailVerificationForm } from "@/features/auth/components/EmailVerificationForm";

export const metadata: Metadata = {
  title: "Verify Email | ShebaMitro Healthcare Ecosystem",
  description: "Verify your ShebaMitro registered email address using 6-digit OTP verification.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-muted-fg">Loading verification portal...</div>}>
      <EmailVerificationForm />
    </Suspense>
  );
}
