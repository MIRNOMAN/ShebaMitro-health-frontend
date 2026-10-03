"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck, Video, Clock } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { OmniSearch } from "./omni-search";
import { HeroSlider } from "./hero-slider";

export function HeroSection() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  // Stagger clip-path reveal animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const clipRevealVariants = {
    hidden: {
      y: prefersReducedMotion ? 0 : "110%",
      opacity: prefersReducedMotion ? 0 : 1,
      clipPath: prefersReducedMotion ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center pt-6 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden max-w-7xl mx-auto">
      {/* ── Ambient Floating Gradient Orbs ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Orb 1: Teal Glow */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, 40, -30, 0],
                  y: [0, -50, 30, 0],
                  scale: [1, 1.15, 0.9, 1],
                }
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[5%] w-[38rem] h-[38rem] rounded-full bg-gradient-to-tr from-primary-teal/25 via-emerald-accent/20 to-transparent blur-[110px] opacity-70"
        />

        {/* Orb 2: Violet Glow */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, -50, 30, 0],
                  y: [0, 40, -40, 0],
                  scale: [1, 0.9, 1.12, 1],
                }
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[15%] right-[0%] w-[42rem] h-[42rem] rounded-full bg-gradient-to-br from-violet-accent/25 via-primary-teal/20 to-transparent blur-[120px] opacity-65"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* ── Left Column: Headline, Simple Copy & Omni-Search ─────────── */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Trust Pill Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-surface-border bg-surface-card/80 backdrop-blur-xl shadow-md luminous-border"
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-accent"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-primary-teal" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-fg-app">
              {t("heroBadge")}
            </span>
          </motion.div>

          {/* Kinetic Headline Text Reveal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
          >
            {/* Line 1 */}
            <div className="overflow-hidden py-1">
              <motion.h1
                variants={clipRevealVariants}
                className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08]"
              >
                {t("heroTitleLine1")}{" "}
                <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent">
                  {t("heroTitleLine2")}
                </span>
              </motion.h1>
            </div>

            {/* Line 2 */}
            <div className="overflow-hidden py-1">
              <motion.p
                variants={clipRevealVariants}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-fg-app/90"
              >
                {t("heroTitleLine3")}
              </motion.p>
            </div>
          </motion.div>

          {/* Simple Clean Copy */}
          <motion.p
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-muted-fg font-medium leading-relaxed max-w-2xl"
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* Omni Search Component */}
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="pt-2"
          >
            <OmniSearch />
          </motion.div>

          {/* Clean Trust Badges */}
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-3 text-xs font-bold text-muted-fg pt-1"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-surface-border bg-surface-card/60 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-accent" />
              <span>{t("bmdcVerifiedBadge")}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-surface-border bg-surface-card/60 backdrop-blur-md">
              <Video className="w-4 h-4 text-violet-accent" />
              <span>{t("telemedActiveBadge")}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-surface-border bg-surface-card/60 backdrop-blur-md">
              <Clock className="w-4 h-4 text-coral-accent" />
              <span>{t("expressDeliveryBadge")}</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Interactive Hero Slider (No Overlay Badges) ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex items-center justify-center"
        >
          <HeroSlider />
        </motion.div>
      </div>
    </section>
  );
}
