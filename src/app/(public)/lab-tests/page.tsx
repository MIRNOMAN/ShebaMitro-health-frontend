import type { Metadata } from "next";
import LabTestsPageClient from "./LabTestsPageClient";

export const metadata: Metadata = {
  title: "Diagnostic Lab Tests & Home Health Checkup Packages | ShebaMitro",
  description:
    "Book accredited diagnostic tests, full body checkups, diabetes profiles, lipid tests, and thyroid screenings with certified phlebotomist home sample collection in Bangladesh.",
  alternates: {
    canonical: "/lab-tests",
  },
  openGraph: {
    title: "Diagnostic Lab Tests & Home Health Checkup Packages | ShebaMitro",
    description:
      "Book accredited diagnostic tests and full body checkups with certified home sample collection in Bangladesh.",
    url: "/lab-tests",
  },
};

export default function LabTestsPage() {
  return <LabTestsPageClient />;
}
