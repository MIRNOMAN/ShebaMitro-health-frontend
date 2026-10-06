"use client";

import React from "react";
import { AboutHeroSection } from "@/features/about/components/AboutHeroSection";
import { AboutStatsSection } from "@/features/about/components/AboutStatsSection";
import { AboutMissionValues } from "@/features/about/components/AboutMissionValues";
import { AboutLeadershipTeam } from "@/features/about/components/AboutLeadershipTeam";
import { AboutCtaBanner } from "@/features/about/components/AboutCtaBanner";

export default function PublicAboutUsPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-12 max-w-7xl mx-auto">
      {/* High Impact Hero Section */}
      <AboutHeroSection />

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
