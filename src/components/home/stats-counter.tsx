"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { StaggerChildren, StaggerItem, itemVariants } from "@/components/motion/motion-primitives";
import { Users, Stethoscope, Truck, Star, Activity } from "lucide-react";
import { useLanguage, type TranslationKey } from "@/components/providers/language-provider";

interface StatItem {
  id: string;
  labelKey: TranslationKey;
  subtextKey: TranslationKey;
  value: number;
  suffix: string;
  decimals?: number;
  icon: React.ReactNode;
  gradient: string;
}

const statsData: StatItem[] = [
  {
    id: "consultations",
    labelKey: "statConsultations",
    subtextKey: "statConsultationsSub",
    value: 50000,
    suffix: "+",
    icon: <Users className="w-6 h-6" />,
    gradient: "from-primary-teal to-emerald-accent",
  },
  {
    id: "doctors",
    labelKey: "statDoctors",
    subtextKey: "statDoctorsSub",
    value: 1200,
    suffix: "+",
    icon: <Stethoscope className="w-6 h-6" />,
    gradient: "from-violet-accent to-primary-teal",
  },
  {
    id: "delivery",
    labelKey: "statDelivery",
    subtextKey: "statDeliverySub",
    value: 99.4,
    suffix: "%",
    decimals: 1,
    icon: <Truck className="w-6 h-6" />,
    gradient: "from-emerald-accent to-primary-teal",
  },
  {
    id: "rating",
    labelKey: "statRating",
    subtextKey: "statRatingSub",
    value: 4.9,
    suffix: " / 5.0",
    decimals: 1,
    icon: <Star className="w-6 h-6 fill-amber-400 text-amber-400" />,
    gradient: "from-coral-accent to-violet-accent",
  },
];

function CountUpNumber({ value, decimals = 0, suffix }: { value: number; decimals?: number; suffix: string }) {
  const [current, setCurrent] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCurrent(value);
        clearInterval(timer);
      } else {
        setCurrent(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatted = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString();

  return (
    <span ref={ref} className="font-mono font-black">
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  const { t } = useLanguage();

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Background ambient bar */}
      <div className="absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-gradient-to-r from-primary-teal/10 via-violet-accent/10 to-emerald-accent/10 blur-3xl rounded-full" />

      {/* Ticker bar for live activity */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-surface-border bg-surface-card/90 backdrop-blur-xl shadow-lg luminous-border text-xs font-bold">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-accent"></span>
          </span>
          <Activity className="w-4 h-4 text-primary-teal" />
          <span className="text-muted-fg">{t("liveActivity")}</span>
          <span className="text-fg-app font-extrabold">{t("liveActivityFeed")}</span>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StaggerItem key={stat.id} variants={itemVariants}>
            <GlowCard className="p-6 space-y-4 text-center h-full flex flex-col justify-between">
              <div className="flex justify-center">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${stat.gradient} text-white flex items-center justify-center shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-fg-app tracking-tight">
                  <CountUpNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary-teal">
                  {t(stat.labelKey)}
                </h3>
              </div>

              <p className="text-[11px] text-muted-fg font-medium pt-2 border-t border-surface-border">
                {t(stat.subtextKey)}
              </p>
            </GlowCard>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
