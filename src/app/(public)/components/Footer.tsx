"use client";

import * as React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Siren,
  PhoneCall,
  Mail,
  CheckCircle2,
  Send,
  ShieldCheck,
  Building2,
  Award,
  Microscope,
  Stethoscope,
  User,
  TestTube,
  Pill,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteMarquee, type MarqueeItem } from "@/components/ui/infinite-marquee";
import { useLanguage } from "@/components/providers/language-provider";

// Trust badge items for InfiniteMarquee
const trustMarqueeItems: MarqueeItem[] = [
  {
    id: "hosp-1",
    title: "Evercare Hospital Network",
    subtitle: "JCI Accredited Tertiary Care Partner",
    icon: <Building2 className="w-4 h-4" />,
    badge: "JCI Gold Seal",
  },
  {
    id: "bmdc-1",
    title: "BMDC Certified Physicians",
    subtitle: "100% Verified Doctor Licenses",
    icon: <Stethoscope className="w-4 h-4" />,
    badge: "BMDC Verified",
  },
  {
    id: "iso-1",
    title: "ISO 15189 Clinical Labs",
    subtitle: "International Diagnostics Standard",
    icon: <Microscope className="w-4 h-4" />,
    badge: "ISO 15189",
  },
  {
    id: "hosp-2",
    title: "Square Hospitals Ltd.",
    subtitle: "Super-Specialty Medical Center",
    icon: <Building2 className="w-4 h-4" />,
    badge: "Tertiary Care",
  },
  {
    id: "bmdc-2",
    title: "HIPAA Compliant Telehealth",
    subtitle: "256-Bit Encrypted Consultations",
    icon: <ShieldCheck className="w-4 h-4" />,
    badge: "HIPAA Ready",
  },
  {
    id: "iso-2",
    title: "Labaid Diagnostics Network",
    subtitle: "Automated Robotic Specimen Testing",
    icon: <TestTube className="w-4 h-4" />,
    badge: "Automated Lab",
  },
  {
    id: "hosp-3",
    title: "United Hospital Care",
    subtitle: "24/7 Cardiac & Trauma Pavilion",
    icon: <Building2 className="w-4 h-4" />,
    badge: "24/7 Emergency",
  },
  {
    id: "bmdc-3",
    title: "DGDA Approved Pharmacies",
    subtitle: "100% Genuine Barcoded Medicines",
    icon: <Pill className="w-4 h-4" />,
    badge: "DGDA Verified",
  },
];

export function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = React.useState("");
  const [subscriptionState, setSubscriptionState] = React.useState<
    "idle" | "loading" | "success"
  >("idle");

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubscriptionState("loading");
    setTimeout(() => {
      setSubscriptionState("success");
      setEmail("");
    }, 1200);
  };

  return (
    <footer className="relative bg-surface-card/60 border-t border-surface-border text-fg-app overflow-hidden">
      {/* ── 1. Infinite Marquee Section (Above Footer Main) ────── */}
      <div className="border-b border-surface-border/60 bg-bg-app/40 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-muted-fg">
            <Award className="w-4 h-4 text-primary-teal" />
            <span>{t("footerPartnerHeader")}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-accent hidden sm:inline-block">
            {t("footerVerifiedNetwork")}
          </span>
        </div>

        <InfiniteMarquee items={trustMarqueeItems} speed={40} direction="left" />
      </div>

      {/* ── 2. Multi-Column Footer Grid ────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info & Accreditation */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-teal via-emerald-accent to-violet-accent flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent font-black text-2xl tracking-tight">
                ShebaMitro
              </span>
            </Link>

            <p className="text-xs text-muted-fg leading-relaxed font-medium">
              {t("footerCompanyDesc")}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase text-muted-fg">
              <span className="px-2.5 py-1 rounded-lg border border-surface-border bg-muted-bg/60 flex items-center gap-1">
                <Lock className="w-3 h-3 text-primary-teal" /> HIPAA Ready
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-surface-border bg-muted-bg/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-accent" /> ISO 27001
              </span>
              <span className="px-2.5 py-1 rounded-lg border border-surface-border bg-muted-bg/60 flex items-center gap-1">
                <Award className="w-3 h-3 text-violet-accent" /> BMDC Verified
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links for 4 Healthcare Roles */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-fg border-b border-surface-border/60 pb-2">
              {t("footerPortalsHeader")}
            </h3>

            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link
                  href="/login?role=patient"
                  className="flex items-center gap-2 text-muted-fg hover:text-primary-teal transition-colors group"
                >
                  <User className="w-4 h-4 text-primary-teal group-hover:scale-110 transition-transform" />
                  <span>{t("patientRole")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=doctor"
                  className="flex items-center gap-2 text-muted-fg hover:text-emerald-accent transition-colors group"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-accent group-hover:scale-110 transition-transform" />
                  <span>{t("doctorRole")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=lab"
                  className="flex items-center gap-2 text-muted-fg hover:text-violet-accent transition-colors group"
                >
                  <TestTube className="w-4 h-4 text-violet-accent group-hover:scale-110 transition-transform" />
                  <span>{t("labRole")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login?role=pharmacy"
                  className="flex items-center gap-2 text-muted-fg hover:text-coral-accent transition-colors group"
                >
                  <Pill className="w-4 h-4 text-coral-accent group-hover:scale-110 transition-transform" />
                  <span>{t("pharmacyRole")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency & Urgent Care Hotlines */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-fg border-b border-surface-border/60 pb-2">
              {t("footerEmergencyHeader")}
            </h3>

            <div className="space-y-3">
              <a
                href="tel:999"
                className="p-3 rounded-2xl border border-red-500/30 bg-red-600/10 text-red-500 flex items-center justify-between hover:bg-red-600/20 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Siren className="w-5 h-5 text-red-500 animate-pulse" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      {t("footerNationalHotlineLabel")}
                    </p>
                    <p className="text-sm font-black">{t("footerNationalHotlineSub")}</p>
                  </div>
                </div>
                <PhoneCall className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              </a>

              <div className="p-3 rounded-2xl border border-surface-border bg-surface-card/80 space-y-1 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary-teal">
                  {t("footerTelemedHotlineLabel")}
                </p>
                <p className="font-extrabold text-fg-app">+880 (9612) 800-900</p>
                <p className="text-[10px] text-muted-fg">{t("footerTelemedHotlineSub")}</p>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Subscription with Optimistic Confirmation */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-fg border-b border-surface-border/60 pb-2">
              {t("footerSubscribeHeader")}
            </h3>

            <p className="text-xs text-muted-fg leading-relaxed font-medium">
              {t("footerSubscribeDesc")}
            </p>

            {subscriptionState === "success" ? (
              <div className="p-3.5 rounded-2xl bg-emerald-accent/15 border border-emerald-accent/40 text-emerald-accent text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-accent flex-shrink-0" />
                <span>{t("subscribeSuccessMessage")}</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-fg" />
                  <input
                    type="email"
                    required
                    placeholder={t("enterEmailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 text-xs rounded-xl border border-surface-border bg-bg-app text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={subscriptionState === "loading"}
                  variant="primary"
                  size="md"
                  className="w-full justify-center gap-2 text-xs font-extrabold shadow-sm"
                >
                  {subscriptionState === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("subscribingButton")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t("subscribeButton")}</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-6 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-fg gap-4 font-medium">
          <p>&copy; {new Date().getFullYear()} ShebaMitro Health Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 font-semibold">
            <Link href="/privacy" className="hover:text-primary-teal transition-colors">{t("privacyPolicy")}</Link>
            <Link href="/terms" className="hover:text-primary-teal transition-colors">{t("termsOfService")}</Link>
            <Link href="/security" className="hover:text-primary-teal transition-colors">{t("securityHipaa")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
