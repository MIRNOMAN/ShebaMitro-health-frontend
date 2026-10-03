"use client";

import * as React from "react";
import Image from "next/image";
import { GlowCard } from "@/components/ui/glow-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { StaggerChildren, StaggerItem, itemVariants } from "@/components/motion/motion-primitives";
import { useLanguage } from "@/components/providers/language-provider";
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
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BentoGrid() {
  const { t } = useLanguage();
  const [alarmEnabled, setAlarmEnabled] = React.useState(true);

  return (
    <section className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-surface-border bg-surface-card text-xs font-extrabold uppercase tracking-wider text-primary-teal shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary-teal animate-pulse" />
          <span>{t("bentoHeaderBadge")}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          {t("bentoHeaderTitle")}{" "}
          <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent">
            {t("bentoHeaderTitleHighlight")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-fg leading-relaxed">
          {t("bentoHeaderSubtitle")}
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
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                      alarmEnabled
                        ? "bg-emerald-accent/20 text-emerald-accent border border-emerald-accent/40"
                        : "bg-muted-bg text-muted-fg border border-surface-border"
                    }`}
                  >
                    {alarmEnabled ? "ACTIVE" : "PAUSED"}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-coral-accent">
                  {t("alarmBadge")}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  {t("alarmTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {t("alarmDesc")}
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
                    <h4 className="text-xs font-extrabold text-fg-app">Cefuroxime 500mg</h4>
                    <p className="text-[11px] text-muted-fg">After Breakfast • 1 Tablet</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-coral-accent flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 09:00 AM
                  </span>
                  <span className="text-[10px] text-emerald-accent font-bold">Upcoming in 15m</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2 text-muted-fg">
                  <Volume2 className="w-4 h-4 text-violet-accent" />
                  <span>Audio Alert Active</span>
                </div>
                <button className="px-3 py-1 rounded-xl bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-bold text-[11px] hover:brightness-110 transition-all">
                  Take Dose Now
                </button>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Button variant="outline" size="md" className="w-full justify-between group">
                  <span>{t("alarmBtn")}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                  24/7 Live Call
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-primary-teal">
                  {t("telemedBadge")}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  {t("telemedTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {t("telemedDesc")}
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
                    <span>Dr. Farah Ahmed (BMDC #A-84920)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-accent text-white font-black text-[10px]">
                    ONLINE NOW
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Button variant="primary" size="md" className="w-full justify-between">
                  <span>{t("telemedBtn")}</span>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                </Button>
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
                  2-Hour Express
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-violet-accent">
                  {t("pharmacyCardBadge")}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  {t("pharmacyTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {t("pharmacyDesc")}
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
                  <span>Temperature Controlled (2°C - 8°C)</span>
                  <span className="text-emerald-accent">ETA: 24 Mins</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Button variant="outline" size="md" className="w-full justify-between">
                  <span>{t("pharmacyBtn")}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
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
                  ISO 15189
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-accent">
                  {t("labCardBadge")}
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  {t("labTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-fg mt-2 leading-relaxed">
                  {t("labDesc")}
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
                  <span>Certified Phlebotomist Visit</span>
                  <span className="text-emerald-accent">Free Home Collection</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton distance={20} strength={0.3} className="w-full">
                <Button variant="outline" size="md" className="w-full justify-between">
                  <span>{t("labBtn")}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </MagneticButton>
            </div>
          </GlowCard>
        </StaggerItem>
      </StaggerChildren>
    </section>
  );
}
