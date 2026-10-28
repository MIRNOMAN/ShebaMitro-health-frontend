import type { Metadata } from "next";
import { ContactHeaderHero } from "@/features/contact/components/ContactHeaderHero";
import { ContactInfoCards } from "@/features/contact/components/ContactInfoCards";
import { ContactFormSection } from "@/features/contact/components/ContactFormSection";
import { ContactFaqAccordion } from "@/features/contact/components/ContactFaqAccordion";
import { ContactMapLocation } from "@/features/contact/components/ContactMapLocation";

export const metadata: Metadata = {
  title: "Contact Us & 24/7 Emergency Support | ShebaMitro",
  description:
    "Get in touch with ShebaMitro for 24/7 medical support, ambulance dispatch, doctor appointment inquiries, and platform assistance across Bangladesh.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us & 24/7 Emergency Support | ShebaMitro",
    description:
      "Get in touch with ShebaMitro for 24/7 medical support, ambulance dispatch, doctor appointment inquiries, and platform assistance.",
    url: "/contact",
  },
};

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
