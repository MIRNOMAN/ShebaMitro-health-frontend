"use client";

import React from "react";
import { ContactHeaderHero } from "@/features/contact/components/ContactHeaderHero";
import { ContactInfoCards } from "@/features/contact/components/ContactInfoCards";
import { ContactFormSection } from "@/features/contact/components/ContactFormSection";
import { ContactFaqAccordion } from "@/features/contact/components/ContactFaqAccordion";
import { ContactMapLocation } from "@/features/contact/components/ContactMapLocation";

export default function PublicContactUsPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Hero Header */}
      <ContactHeaderHero />

      {/* 24/7 Channels Info Cards */}
      <ContactInfoCards />

      {/* Interactive Inquiry Ticket Form */}
      <ContactFormSection />

      {/* Frequently Asked Questions */}
      <ContactFaqAccordion />

      {/* Regional Office Network & Map */}
      <ContactMapLocation />
    </div>
  );
}
