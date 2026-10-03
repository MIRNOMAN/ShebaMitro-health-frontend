"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Sparkles,
  UserCheck,
  Eye,
  Activity,
  Smile,
  ShieldPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScaleOnHover } from "@/components/motion/motion-primitives";
import { useLanguage } from "@/components/providers/language-provider";

export interface SpecialtyItem {
  id: string;
  titleEn: string;
  titleBn: string;
  doctorCount: string;
  icon: React.ReactNode;
  gradient: string;
  badgeColor: string;
}

const specialties: SpecialtyItem[] = [
  {
    id: "cardiology",
    titleEn: "Cardiology",
    titleBn: "হৃদরোগ (কার্ডিওলজি)",
    doctorCount: "140+ Doctors",
    icon: <HeartPulse className="w-6 h-6" />,
    gradient: "from-primary-teal to-emerald-accent",
    badgeColor: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
  },
  {
    id: "neurology",
    titleEn: "Neurology",
    titleBn: "স্নায়ুরোগ (নিউরোালজি)",
    doctorCount: "95+ Doctors",
    icon: <Brain className="w-6 h-6" />,
    gradient: "from-violet-accent to-primary-teal",
    badgeColor: "text-violet-accent bg-violet-accent/15 border-violet-accent/30",
  },
  {
    id: "pediatrics",
    titleEn: "Pediatrics",
    titleBn: "শিশু স্বাস্থ্য (পিডিয়াট্রিক্স)",
    doctorCount: "110+ Doctors",
    icon: <Baby className="w-6 h-6" />,
    gradient: "from-coral-accent to-violet-accent",
    badgeColor: "text-coral-accent bg-coral-accent/15 border-coral-accent/30",
  },
  {
    id: "orthopedics",
    titleEn: "Orthopedics",
    titleBn: "অস্থিরোগ (অর্থোপেডিক্স)",
    doctorCount: "85+ Doctors",
    icon: <Bone className="w-6 h-6" />,
    gradient: "from-emerald-accent to-primary-teal",
    badgeColor: "text-emerald-accent bg-emerald-accent/15 border-emerald-accent/30",
  },
  {
    id: "dermatology",
    titleEn: "Dermatology",
    titleBn: "চর্ম ও যৌনরোগ",
    doctorCount: "75+ Doctors",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-primary-teal to-violet-accent",
    badgeColor: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
  },
  {
    id: "gynecology",
    titleEn: "Gynecology",
    titleBn: "স্ত্রী ও প্রসূতি রোগ",
    doctorCount: "120+ Doctors",
    icon: <UserCheck className="w-6 h-6" />,
    gradient: "from-coral-accent to-emerald-accent",
    badgeColor: "text-coral-accent bg-coral-accent/15 border-coral-accent/30",
  },
  {
    id: "ophthalmology",
    titleEn: "Ophthalmology",
    titleBn: "চক্ষুরোগ বিশেষজ্ঞ",
    doctorCount: "80+ Doctors",
    icon: <Eye className="w-6 h-6" />,
    gradient: "from-violet-accent to-emerald-accent",
    badgeColor: "text-violet-accent bg-violet-accent/15 border-violet-accent/30",
  },
  {
    id: "oncology",
    titleEn: "Oncology",
    titleBn: "ক্যান্সার বা অনকোলজি",
    doctorCount: "60+ Doctors",
    icon: <ShieldPlus className="w-6 h-6" />,
    gradient: "from-primary-teal to-coral-accent",
    badgeColor: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
  },
  {
    id: "psychiatry",
    titleEn: "Psychiatry",
    titleBn: "মানসিক স্বাস্থ্য ও সাইকিয়াট্রি",
    doctorCount: "65+ Doctors",
    icon: <Smile className="w-6 h-6" />,
    gradient: "from-emerald-accent to-violet-accent",
    badgeColor: "text-emerald-accent bg-emerald-accent/15 border-emerald-accent/30",
  },
  {
    id: "ent",
    titleEn: "ENT Care",
    titleBn: "ناک, কান ও গলা (ইএনটি)",
    doctorCount: "70+ Doctors",
    icon: <Activity className="w-6 h-6" />,
    gradient: "from-coral-accent to-primary-teal",
    badgeColor: "text-coral-accent bg-coral-accent/15 border-coral-accent/30",
  },
];

export function SpecialtyCarousel() {
  const { t, locale } = useLanguage();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Carousel Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal">
            {t("specialtyCategory")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t("specialtyTitle")}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="p-2.5 rounded-2xl border border-surface-border bg-surface-card hover:border-primary-teal hover:bg-muted-bg text-fg-app transition-all shadow-xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-2.5 rounded-2xl border border-surface-border bg-surface-card hover:border-primary-teal hover:bg-muted-bg text-fg-app transition-all shadow-xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-5 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth"
      >
        {specialties.map((item) => (
          <ScaleOnHover key={item.id} scale={1.04} className="flex-shrink-0">
            <a
              href="/doctors/specialists"
              className="group block w-64 rounded-3xl border border-surface-border bg-surface-card p-6 shadow-md hover:border-luminous transition-all duration-300 relative overflow-hidden luminous-border cursor-pointer"
              style={{ backgroundColor: "var(--card)" }}
            >
              <div className="space-y-4">
                {/* Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-lg font-black group-hover:text-primary-teal transition-colors leading-snug">
                    {locale === "bn" ? item.titleBn : item.titleEn}
                  </h3>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${item.badgeColor}`}
                  >
                    {item.doctorCount}
                  </span>
                </div>
              </div>
            </a>
          </ScaleOnHover>
        ))}
      </div>
    </div>
  );
}
