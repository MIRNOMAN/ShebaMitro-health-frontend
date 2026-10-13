"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { StaggerChildren, StaggerItem, itemVariants } from "@/components/motion/motion-primitives";
import { Users, Stethoscope, Truck, Star, Activity, Sparkles } from "lucide-react";
import { useLanguage, type TranslationKey } from "@/components/providers/language-provider";
import { useGetHomeStatsQuery, StatCounterItem, LiveActivityItem } from "@/redux/api/statsApi";

interface StatItemDisplay {
  id: string;
  labelKey?: string;
  subtextKey?: string;
  label: string;
  labelBn?: string;
  subtext: string;
  subtextBn?: string;
  value: number;
  suffix: string;
  decimals?: number;
  icon: React.ReactNode;
  gradient: string;
}

// Fallback initial data matching active database state
const defaultStatsData: StatItemDisplay[] = [
  {
    id: "consultations",
    labelKey: "statConsultations",
    subtextKey: "statConsultationsSub",
    label: "Completed Consultations",
    labelBn: "সফল চিকিৎসা সেবা",
    subtext: "Across 64 districts in Bangladesh",
    subtextBn: "বাংলাদেশের ৬৪টি জেলায় বিস্তৃত",
    value: 12,
    suffix: "+",
    decimals: 0,
    icon: <Users className="w-6 h-6" />,
    gradient: "from-primary-teal to-emerald-accent",
  },
  {
    id: "doctors",
    labelKey: "statDoctors",
    subtextKey: "statDoctorsSub",
    label: "BMDC Certified Specialists",
    labelBn: "বিএমডিসি নিবন্ধিত ডাক্তার",
    subtext: "Verified credentials & BMDC IDs",
    subtextBn: "যাচাইকৃত রেজিস্টার্ড বিশেষজ্ঞ প্যানেল",
    value: 19,
    suffix: "+",
    decimals: 0,
    icon: <Stethoscope className="w-6 h-6" />,
    gradient: "from-violet-accent to-primary-teal",
  },
  {
    id: "delivery",
    labelKey: "statDelivery",
    subtextKey: "statDeliverySub",
    label: "On-Time Express Delivery",
    labelBn: "দ্রুত ওষুধ সরবরাহ",
    subtext: "15 of 15 orders delivered express",
    subtextBn: "১৫/১৫ টি অর্ডার সফল এক্সপ্রেস ডেলিভারি",
    value: 100,
    suffix: "%",
    decimals: 1,
    icon: <Truck className="w-6 h-6" />,
    gradient: "from-emerald-accent to-primary-teal",
  },
  {
    id: "rating",
    labelKey: "statRating",
    subtextKey: "statRatingSub",
    label: "Patient Satisfaction Rating",
    labelBn: "রোগীদের সন্তুষ্টি রেটিং",
    subtext: "Based on 2,469+ verified reviews",
    subtextBn: "২,৪৬৯+ পেশেন্ট রিভিউ এর ভিত্তিতে",
    value: 4.9,
    suffix: " / 5.0",
    decimals: 1,
    icon: <Star className="w-6 h-6 fill-amber-400 text-amber-400" />,
    gradient: "from-coral-accent to-violet-accent",
  },
];

const fallbackActivity: LiveActivityItem = {
  id: "default-act",
  message: "Dr. Kazi Arif completed a live video consultation in Dhaka • 14m ago",
  messageBn: "ডাঃ Kazi Arif ঢাকা থেকে লাইভ ভিডিও কনসালটেশন সম্পন্ন করেছেন • ১৪ মি পূর্বে",
  doctorName: "Dr. Kazi Arif",
  location: "Dhaka",
  timeAgo: "14m ago",
  timeAgoBn: "১৪ মি পূর্বে",
  timestamp: new Date().toISOString(),
};

function toBnNumerals(val: string | number): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(val).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)] ?? d);
}

function CountUpNumber({
  value,
  decimals = 0,
  suffix,
  isBn = false,
}: {
  value: number;
  decimals?: number;
  suffix: string;
  isBn?: boolean;
}) {
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

  let formatted = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString();
  if (isBn) {
    formatted = toBnNumerals(formatted);
  }

  return (
    <span ref={ref} className="font-mono font-black">
      {formatted}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  // Fetch dynamic platform stats from backend API
  const { data: statsResponse } = useGetHomeStatsQuery(undefined, {
    pollingInterval: 30000, // Refresh every 30 seconds
  });

  const apiData = statsResponse?.data;

  // Icon mapping
  const resolveIcon = (iconName: string, id: string): React.ReactNode => {
    switch (iconName || id) {
      case "Users":
      case "consultations":
        return <Users className="w-6 h-6" />;
      case "Stethoscope":
      case "doctors":
        return <Stethoscope className="w-6 h-6" />;
      case "Truck":
      case "delivery":
        return <Truck className="w-6 h-6" />;
      case "Star":
      case "rating":
        return <Star className="w-6 h-6 fill-amber-400 text-amber-400" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  // Compile active cards
  const displayStats: StatItemDisplay[] = React.useMemo(() => {
    if (apiData?.counters && apiData.counters.length > 0) {
      return apiData.counters.map((counter: StatCounterItem) => ({
        id: counter.id,
        labelKey: counter.labelKey,
        subtextKey: counter.subtextKey,
        label: counter.label,
        labelBn: counter.labelBn,
        subtext: counter.subtext,
        subtextBn: counter.subtextBn,
        value: counter.value,
        suffix: counter.suffix || "+",
        decimals: counter.decimals ?? 0,
        icon: resolveIcon(counter.icon, counter.id),
        gradient: counter.gradient || "from-primary-teal to-emerald-accent",
      }));
    }
    return defaultStatsData;
  }, [apiData]);

  // Live activities list
  const liveActivities: LiveActivityItem[] = React.useMemo(() => {
    if (apiData?.liveActivities && apiData.liveActivities.length > 0) {
      return apiData.liveActivities;
    }
    if (apiData?.liveActivity) {
      return [apiData.liveActivity];
    }
    return [fallbackActivity];
  }, [apiData]);

  // Carousel ticker index
  const [activityIndex, setActivityIndex] = React.useState(0);

  React.useEffect(() => {
    if (liveActivities.length <= 1) return;
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [liveActivities.length]);

  const currentActivity = liveActivities[activityIndex % liveActivities.length] || fallbackActivity;

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Background ambient bar */}
      <div className="absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-gradient-to-r from-primary-teal/10 via-violet-accent/10 to-emerald-accent/10 blur-3xl rounded-full" />

      {/* Dynamic Ticker bar for live activity */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-surface-border bg-surface-card/90 backdrop-blur-xl shadow-lg luminous-border text-xs font-bold transition-all hover:border-primary-teal/40">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-accent"></span>
          </span>
          <Activity className="w-4 h-4 text-primary-teal shrink-0 animate-pulse" />
          <span className="text-muted-fg shrink-0">{t("liveActivity")}</span>

          {/* Animated activity feed text */}
          <div className="relative overflow-hidden min-h-[1.25rem] flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${currentActivity.id}-${activityIndex}`}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-fg-app font-extrabold truncate max-w-[240px] sm:max-w-md md:max-w-lg inline-block"
              >
                {isBn && currentActivity.messageBn
                  ? currentActivity.messageBn
                  : currentActivity.message}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Grid of Dynamic Stats Cards */}
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat) => {
          const cardLabel = isBn
            ? stat.labelBn || (stat.labelKey ? t(stat.labelKey as TranslationKey) : "") || stat.label
            : (stat.labelKey ? t(stat.labelKey as TranslationKey) : "") || stat.label;

          const cardSubtext = isBn
            ? stat.subtextBn || stat.subtext || (stat.subtextKey ? t(stat.subtextKey as TranslationKey) : "")
            : stat.subtext || (stat.subtextKey ? t(stat.subtextKey as TranslationKey) : "");

          return (
            <StaggerItem key={stat.id} variants={itemVariants}>
              <GlowCard className="p-6 space-y-4 text-center h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
                <div className="flex justify-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${stat.gradient} text-white flex items-center justify-center shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-fg-app tracking-tight">
                    <CountUpNumber
                      value={stat.value}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                      isBn={isBn}
                    />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary-teal">
                    {cardLabel}
                  </h3>
                </div>

                <p className="text-[11px] text-muted-fg font-medium pt-2 border-t border-surface-border">
                  {cardSubtext}
                </p>
              </GlowCard>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </section>
  );
}
