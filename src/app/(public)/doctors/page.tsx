import type { Metadata } from "next";
import DoctorsPageClient from "./DoctorsPageClient";

export const metadata: Metadata = {
  title: "Specialist Doctors & Teleconsultation Appointments | ShebaMitro",
  description:
    "Find and book BMDC-verified specialist doctors in Bangladesh across Cardiology, Neurology, Pediatrics, Gynecology, and more. Instant chamber and video consultation slots.",
  alternates: {
    canonical: "/doctors",
  },
  openGraph: {
    title: "Specialist Doctors & Teleconsultation Appointments | ShebaMitro",
    description:
      "Find and book BMDC-verified specialist doctors in Bangladesh across Cardiology, Neurology, Pediatrics, Gynecology, and more.",
    url: "/doctors",
  },
};

export default function DoctorsPage() {
  return <DoctorsPageClient />;
}
