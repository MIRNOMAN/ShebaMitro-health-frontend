import { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | ShebaMitro Healthcare Ecosystem",
  description: "Reset your ShebaMitro account password securely using 6-digit OTP verification.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
