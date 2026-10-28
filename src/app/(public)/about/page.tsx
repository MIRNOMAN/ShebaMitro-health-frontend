import type { Metadata } from "next";
import { AboutHeroSection } from "@/features/about/components/AboutHeroSection";
import { AboutMissionGoalSection } from "@/features/about/components/AboutMissionGoalSection";
import { AboutStatsSection } from "@/features/about/components/AboutStatsSection";
import { AboutMissionValues } from "@/features/about/components/AboutMissionValues";
import { AboutLeadershipTeam } from "@/features/about/components/AboutLeadershipTeam";
import { AboutCtaBanner } from "@/features/about/components/AboutCtaBanner";

export const metadata: Metadata = {
  title: "About Us | ShebaMitro Healthcare",
  description:
    "Learn about ShebaMitro's mission to revolutionize Bangladeshi healthcare through telemedicine, specialist doctor consultations, diagnostic tests, and express medicine delivery.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | ShebaMitro Healthcare",
    description:
      "Learn about ShebaMitro's mission to revolutionize Bangladeshi healthcare through telemedicine, specialist doctor consultations, and express medicine delivery.",
    url: "/about",
  },
};

export default function PublicAboutUsPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-12 max-w-7xl mx-auto">
      {/* High Impact Hero Section */}
      <AboutHeroSection />

      {/* Dedicated Mission & Goal Spotlight Section */}
      <AboutMissionGoalSection />

      {/* Impact Statistics */}
      <AboutStatsSection />

      {/* Core Mission & Pillars */}
      <AboutMissionValues />

      {/* Leadership & Medical Advisory Board */}
      <AboutLeadershipTeam />

      {/* Call To Action Banner */}
      <AboutCtaBanner />
    </div>
  );
}
