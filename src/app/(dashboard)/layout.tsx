import type { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | ShebaMitro",
    template: "%s | ShebaMitro Dashboard",
  },
  description: "Private healthcare management dashboard for patients, doctors, labs, and pharmacies.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: "./",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
