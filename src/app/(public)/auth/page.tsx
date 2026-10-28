import type { Metadata } from "next";
import AuthPageClient from "./AuthPageClient";

export const metadata: Metadata = {
  title: "Healthcare Single Sign-On Portal | ShebaMitro",
  description: "Secure healthcare portal login for patients, doctors, diagnostic labs, and pharmacies.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/auth",
  },
};

export default function AuthPage() {
  return <AuthPageClient />;
}
