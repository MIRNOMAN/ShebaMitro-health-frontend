import type { Metadata } from "next";
import LabTestsPageClient from "../lab-tests/LabTestsPageClient";

export const metadata: Metadata = {
  title: "Diagnostic Health Screening & Lab Packages | ShebaMitro",
  description:
    "Comprehensive health screening packages and pathology lab tests with verified home sample collection across Bangladesh.",
  alternates: {
    canonical: "/diagnostics",
  },
  openGraph: {
    title: "Diagnostic Health Screening & Lab Packages | ShebaMitro",
    description:
      "Comprehensive health screening packages and pathology lab tests with verified home sample collection across Bangladesh.",
    url: "/diagnostics",
  },
};

export default function DiagnosticsPage() {
  return <LabTestsPageClient />;
}
