"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { StaggerChildren, StaggerItem, itemVariants } from "@/components/motion/motion-primitives";
import { useLanguage } from "@/components/providers/language-provider";
import { useGetBentoDataQuery } from "@/redux/api/statsApi";
import {
  Bell,
  Clock,
  Video,
  Truck,
  TestTube,
  Zap,
  Pill,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BentoGrid() {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  // Fetch 100% dynamic bento data from backend API
  const { data: bentoResponse } = useGetBentoDataQuery(undefined, {
    pollingInterval: 30000, // Refresh every 30s
  });

  const bento = bentoResponse?.data;

  // Local interactive states
  const [alarmEnabled, setAlarmEnabled] = React.useState(true);
  const [doseTaken, setDoseTaken] = React.useState(false);

  const handleTakeDose = () => {
    setDoseTaken(true);
    setTimeout(() => {
      setDoseTaken(false);
    }, 4000);
  };

  // Header dynamic texts
  const headerBadge = isBn
    ? bento?.header.badgeBn || t("bentoHeaderBadge")
    : bento?.header.badge || t("bentoHeaderBadge");
  const headerTitle = isBn
    ? bento?.header.titleBn || t("bentoHeaderTitle")
    : bento?.header.title || t("bentoHeaderTitle");
  const headerTitleHighlight = isBn
    ? bento?.header.titleHighlightBn || t("bentoHeaderTitleHighlight")
    : bento?.header.titleHighlight || t("bentoHeaderTitleHighlight");
  const headerSubtitle = isBn
    ? bento?.header.subtitleBn || t("bentoHeaderSubtitle")
    : bento?.header.subtitle || t("bentoHeaderSubtitle");

  // Card 1: Alarm dynamic values
  const alarmBadge = isBn ? bento?.alarm.badgeBn || t("alarmBadge") : bento?.alarm.badge || t("alarmBadge");
  const alarmTitle = isBn ? bento?.alarm.titleBn || t("alarmTitle") : bento?.alarm.title || t("alarmTitle");
  const alarmDesc = isBn ? bento?.alarm.descriptionBn || t("alarmDesc") : bento?.alarm.description || t("alarmDesc");
  const medicineName = isBn
    ? bento?.alarm.medicineNameBn || bento?.alarm.medicineName || "Seclo 20mg"
    : bento?.alarm.medicineName || "Seclo 20mg";
  const medicineInstruction = isBn
    ? bento?.alarm.instructionBn || "খাবারের পূর্বে • ১টি ক্যাপসুল"
    : bento?.alarm.instruction || "Before Meals • 1 Capsule";
  const scheduledTime = isBn
    ? bento?.alarm.scheduledTimeBn || bento?.alarm.scheduledTime || "০২:৩৮ PM"
    : bento?.alarm.scheduledTime || "02:38 PM";
  const upcomingStatus = isBn
    ? bento?.alarm.upcomingStatusBn || "১৫ মিনিটের মধ্যে"
    : bento?.alarm.upcomingStatus || "Upcoming in 15m";
  const audioAlertText = isBn
    ? bento?.alarm.audioAlertTextBn || "অডিও অ্যালার্ট চালু আছে"
    : bento?.alarm.audioAlertText || "Audio Alert Active";
  const alarmActionBtnText = isBn
    ? bento?.alarm.actionBtnTextBn || t("alarmBtn")
    : bento?.alarm.actionBtnText || t("alarmBtn");
  const alarmActionUrl = bento?.alarm.actionUrl || "/patient/reminders";

  // Card 2: Telemedicine dynamic values
  const telemedBadge = isBn ? bento?.telemed.badgeBn || t("telemedBadge") : bento?.telemed.badge || t("telemedBadge");
  const telemedTitle = isBn ? bento?.telemed.titleBn || t("telemedTitle") : bento?.telemed.title || t("telemedTitle");
  const telemedDesc = isBn ? bento?.telemed.descriptionBn || t("telemedDesc") : bento?.telemed.description || t("telemedDesc");
  const doctorName = isBn
    ? bento?.telemed.doctorNameBn || bento?.telemed.doctorName || "ডাঃ ফারহানা চৌধুরী"
    : bento?.telemed.doctorName || "Dr. Farhana Chowdhury";
  const bmdcRegNo = bento?.telemed.bmdcRegNo || "BMDC #A-51928";
  const doctorStatusBadge = isBn
    ? bento?.telemed.statusBadgeBn || "এখনই অনলাইন"
    : bento?.telemed.statusBadge || "ONLINE NOW";
  const telemedCallBadge = isBn
    ? bento?.telemed.callBadgeBn || "২৪/৭ লাইভ কল"
    : bento?.telemed.callBadge || "24/7 Live Call";
  const telemedActionBtnText = isBn
    ? bento?.telemed.actionBtnTextBn || t("telemedBtn")
    : bento?.telemed.actionBtnText || t("telemedBtn");
  const telemedActionUrl = bento?.telemed.actionUrl || "/doctors";

  // Card 3: Pharmacy dynamic values
  const pharmacyBadge = isBn
    ? bento?.pharmacy.badgeBn || t("pharmacyCardBadge")
    : bento?.pharmacy.badge || t("pharmacyCardBadge");
  const pharmacyTitle = isBn
    ? bento?.pharmacy.titleBn || t("pharmacyTitle")
    : bento?.pharmacy.title || t("pharmacyTitle");
  const pharmacyDesc = isBn
    ? bento?.pharmacy.descriptionBn || t("pharmacyDesc")
    : bento?.pharmacy.description || t("pharmacyDesc");
  const pharmacyTagBadge = isBn
    ? bento?.pharmacy.tagBadgeBn || "২ ঘণ্টা এক্সপ্রেস"
    : bento?.pharmacy.tagBadge || "2-Hour Express";
  const storageCondition = isBn
    ? bento?.pharmacy.storageConditionBn || "তাপমাত্রা নিয়ন্ত্রিত (২°-৮° সে.)"
    : bento?.pharmacy.storageCondition || "Temperature Controlled (2°C - 8°C)";
  const etaText = isBn
    ? bento?.pharmacy.etaBn || "গড় সময়: ২৪ মিনিট"
    : bento?.pharmacy.eta || "ETA: 24 Mins";
  const pharmacyActionBtnText = isBn
    ? bento?.pharmacy.actionBtnTextBn || t("pharmacyBtn")
    : bento?.pharmacy.actionBtnText || t("pharmacyBtn");
  const pharmacyActionUrl = bento?.pharmacy.actionUrl || "/pharmacy";

  // Card 4: Lab dynamic values
  const labBadge = isBn ? bento?.lab.badgeBn || t("labCardBadge") : bento?.lab.badge || t("labCardBadge");
  const labTitle = isBn ? bento?.lab.titleBn || t("labTitle") : bento?.lab.title || t("labTitle");
  const labDesc = isBn ? bento?.lab.descriptionBn || t("labDesc") : bento?.lab.description || t("labDesc");
  const labTagBadge = isBn ? bento?.lab.tagBadgeBn || "ISO 15189" : bento?.lab.tagBadge || "ISO 15189";
  const serviceText = isBn
    ? bento?.lab.serviceTextBn || "দক্ষ টেকনিশিয়ান দ্বারা হোম স্যাম্পল সংগ্রহ"
    : bento?.lab.serviceText || "Certified Phlebotomist Visit";
  const offerText = isBn
    ? bento?.lab.offerTextBn || "ফ্রি হোম কালেকশন সুবিধা"
    : bento?.lab.offerText || "Free Home Collection";
  const labActionBtnText = isBn
    ? bento?.lab.actionBtnTextBn || t("labBtn")
    : bento?.lab.actionBtnText || t("labBtn");
  const labActionUrl = bento?.lab.actionUrl || "/lab-tests";

  return (
    <section className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-surface-border bg-surface-card text-xs font-extrabold uppercase tracking-wider text-primary-teal shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary-teal animate-pulse" />
          <span>{headerBadge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-fg-app">
          {headerTitle}{" "}
          <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent">
            {headerTitleHighlight}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-fg leading-relaxed">
          {headerSubtitle}
        </p>
      </div>

      {/* Bento Layout Grid */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* ── CARD 1: Smart Medicine Alarms (Spans 6 cols on lg) ─────────── */}
        <StaggerItem variants={itemVariants} className="lg:col-span-6">
          <GlowCard className="p-7 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-coral-accent to-violet-accent text-white flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 animate-bounce" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-fg">Smart Alarm:</span>
                  <button
                    onClick={() => setAlarmEnabled(!alarmEnabled)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      alarmEnabled
                        ? "bg-emerald-accent/20 text-emerald-accent border border-emerald-accent/40"
                        : "bg-muted-bg text-muted-fg border border-surface-border"
                    }`}
                  >
                    {alarmEnabled ? (isBn ? "সক্রিয়" : "ACTIVE") : (isBn ? "স্থগিত" : "PAUSED")}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-coral-accent">
                  {alarmBadge}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1 text-fg-app">
                  {alarmTitle}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {alarmDesc}
                </p>
              </div>
            </div>

            {/* Interactive Alarm Card Preview */}
            <div className="p-4 rounded-2xl border border-surface-border bg-surface-card/90 space-y-3 luminous-border">
              <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary-teal/15 text-primary-teal">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-fg-app">{medicineName}</h4>
                    <p className="text-[11px] text-muted-fg">{medicineInstruction}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-coral-accent flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" /> {scheduledTime}
                  </span>
                  <span className="text-[10px] text-emerald-accent font-bold">{upcomingStatus}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2 text-muted-fg">
                  {alarmEnabled ? (
                    <Volume2 className="w-4 h-4 text-violet-accent animate-pulse" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-muted-fg" />
                  )}
                  <span>{alarmEnabled ? audioAlertText : (isBn ? "অডিও অ্যালার্ট বন্ধ" : "Audio Alert Muted")}</span>
                </div>
                <button
                  onClick={handleTakeDose}
                  className={`px-3 py-1 rounded-xl text-white font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                    doseTaken
                      ? "bg-emerald-600 scale-105"
                      : "bg-gradient-to-r from-primary-teal to-emerald-accent hover:brightness-110 shadow-sm"
                  }`}
                >
                  {doseTaken ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isBn ? "গ্রহণ সম্পন্ন!" : "Dose Taken!"}</span>
                    </>
                  ) : (
                    <span>{isBn ? "ওষুধ গ্রহণ করুন" : "Take Dose Now"}</span>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Link href={alarmActionUrl} className="block w-full">
                  <Button variant="outline" size="md" className="w-full justify-between group cursor-pointer">
                    <span>{alarmActionBtnText}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </GlowCard>
        </StaggerItem>

        {/* ── CARD 2: 24/7 HD Video Consultations (Spans 6 cols on lg) ───── */}
        <StaggerItem variants={itemVariants} className="lg:col-span-6">
          <GlowCard className="p-7 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-teal to-emerald-accent text-white flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-accent/20 text-emerald-accent text-xs font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-accent animate-ping" />
                  {telemedCallBadge}
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-primary-teal">
                  {telemedBadge}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1 text-fg-app">
                  {telemedTitle}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {telemedDesc}
                </p>
              </div>
            </div>

            {/* Telemedicine Realistic Image Banner */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-surface-border group">
              <Image
                src="/images/telemedicine.jpg"
                alt="ShebaMitro 24/7 Telemedicine Doctor Video Call"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-card/90 via-surface-card/20 to-transparent flex items-end p-3.5">
                <div className="flex items-center justify-between w-full text-xs">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-accent" />
                    <span>{doctorName} ({bmdcRegNo})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-accent text-white font-black text-[10px]">
                    {doctorStatusBadge}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Link href={telemedActionUrl} className="block w-full">
                  <Button variant="primary" size="md" className="w-full justify-between cursor-pointer">
                    <span>{telemedActionBtnText}</span>
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </GlowCard>
        </StaggerItem>

        {/* ── CARD 3: 2-Hour Express Pharmacy Delivery (Spans 6 cols on lg) ─ */}
        <StaggerItem variants={itemVariants} className="lg:col-span-6">
          <GlowCard className="p-7 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-accent to-primary-teal text-white flex items-center justify-center shadow-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-violet-accent/20 text-violet-accent text-xs font-extrabold">
                  {pharmacyTagBadge}
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-violet-accent">
                  {pharmacyBadge}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1 text-fg-app">
                  {pharmacyTitle}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {pharmacyDesc}
                </p>
              </div>
            </div>

            {/* Express Pharmacy Realistic Image Banner */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-surface-border group">
              <Image
                src="/images/express-pharmacy.jpg"
                alt="ShebaMitro Cold-Chain Express Medicine Box"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-card/90 via-transparent to-transparent flex items-end p-3.5">
                <div className="flex items-center justify-between w-full text-xs font-bold text-white">
                  <span>{storageCondition}</span>
                  <span className="text-emerald-accent">{etaText}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Link href={pharmacyActionUrl} className="block w-full">
                  <Button variant="outline" size="md" className="w-full justify-between cursor-pointer">
                    <span>{pharmacyActionBtnText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </GlowCard>
        </StaggerItem>

        {/* ── CARD 4: Home Lab Sample Collection (Spans 6 cols on lg) ───── */}
        <StaggerItem variants={itemVariants} className="lg:col-span-6">
          <GlowCard className="p-7 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-accent to-primary-teal text-white flex items-center justify-center shadow-lg">
                  <TestTube className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-accent/20 text-emerald-accent text-xs font-extrabold">
                  {labTagBadge}
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-accent">
                  {labBadge}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1 text-fg-app">
                  {labTitle}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {labDesc}
                </p>
              </div>
            </div>

            {/* Home Lab Collection Realistic Image Banner */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-surface-border group">
              <Image
                src="/images/home-lab.jpg"
                alt="ShebaMitro ISO Certified Lab Diagnostics"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-card/90 via-transparent to-transparent flex items-end p-3.5">
                <div className="flex items-center justify-between w-full text-xs font-bold text-white">
                  <span>{serviceText}</span>
                  <span className="text-emerald-accent">{offerText}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Link href={labActionUrl} className="block w-full">
                  <Button variant="outline" size="md" className="w-full justify-between cursor-pointer">
                    <span>{labActionBtnText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </GlowCard>
        </StaggerItem>
      </StaggerChildren>
    </section>
  );
}
