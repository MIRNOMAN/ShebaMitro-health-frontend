"use client";

import * as React from "react";
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
import { useGetSpecialtiesQuery, SpecialtyItemData } from "@/redux/api/doctorApi";

export interface SpecialtyItem {
  id: string;
  titleEn: string;
  titleBn: string;
  doctorCount: string;
  doctorCountBn?: string;
  icon: React.ReactNode;
  gradient: string;
  badgeColor: string;
}

// Fallback initial specialties matching live database records
const defaultSpecialties: SpecialtyItem[] = [
  {
    id: "cardiology",
    titleEn: "Cardiology",
    titleBn: "হৃদরোগ (কার্ডিওলজি)",
    doctorCount: "3 Doctors",
    doctorCountBn: "৩ জন ডাক্তার",
    icon: <HeartPulse className="w-6 h-6" />,
    gradient: "from-primary-teal to-emerald-accent",
    badgeColor: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
  },
  {
    id: "neurology",
    titleEn: "Neurology",
    titleBn: "স্নায়ুরোগ (নিউরোালজি)",
    doctorCount: "2 Doctors",
    doctorCountBn: "২ জন ডাক্তার",
    icon: <Brain className="w-6 h-6" />,
    gradient: "from-violet-accent to-primary-teal",
    badgeColor: "text-violet-accent bg-violet-accent/15 border-violet-accent/30",
  },
  {
    id: "pediatrics",
    titleEn: "Pediatrics",
    titleBn: "শিশু স্বাস্থ্য (পিডিয়াট্রিক্স)",
    doctorCount: "3 Doctors",
    doctorCountBn: "৩ জন ডাক্তার",
    icon: <Baby className="w-6 h-6" />,
    gradient: "from-coral-accent to-violet-accent",
    badgeColor: "text-coral-accent bg-coral-accent/15 border-coral-accent/30",
  },
  {
    id: "orthopedics",
    titleEn: "Orthopedics",
    titleBn: "অস্থিরোগ (অর্থোপেডিক্স)",
    doctorCount: "2 Doctors",
    doctorCountBn: "২ জন ডাক্তার",
    icon: <Bone className="w-6 h-6" />,
    gradient: "from-emerald-accent to-primary-teal",
    badgeColor: "text-emerald-accent bg-emerald-accent/15 border-emerald-accent/30",
  },
  {
    id: "dermatology",
    titleEn: "Dermatology",
    titleBn: "চর্ম ও যৌনরোগ",
    doctorCount: "2 Doctors",
    doctorCountBn: "২ জন ডাক্তার",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-primary-teal to-violet-accent",
    badgeColor: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
  },
  {
    id: "gynecology",
    titleEn: "Gynecology",
    titleBn: "স্ত্রী ও প্রসূতি রোগ",
    doctorCount: "2 Doctors",
    doctorCountBn: "২ জন ডাক্তার",
    icon: <UserCheck className="w-6 h-6" />,
    gradient: "from-coral-accent to-emerald-accent",
    badgeColor: "text-coral-accent bg-coral-accent/15 border-coral-accent/30",
  },
  {
    id: "ophthalmology",
    titleEn: "Ophthalmology",
    titleBn: "চক্ষুরোগ বিশেষজ্ঞ",
    doctorCount: "2 Doctors",
    doctorCountBn: "২ জন ডাক্তার",
    icon: <Eye className="w-6 h-6" />,
    gradient: "from-violet-accent to-emerald-accent",
    badgeColor: "text-violet-accent bg-violet-accent/15 border-violet-accent/30",
  },
  {
    id: "oncology",
    titleEn: "Oncology",
    titleBn: "ক্যান্সার বা অনকোলজি",
    doctorCount: "1 Doctor",
    doctorCountBn: "১ জন ডাক্তার",
    icon: <ShieldPlus className="w-6 h-6" />,
    gradient: "from-primary-teal to-coral-accent",
    badgeColor: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
  },
  {
    id: "psychiatry",
    titleEn: "Psychiatry",
    titleBn: "মানসিক স্বাস্থ্য ও সাইকিয়াট্রি",
    doctorCount: "1 Doctor",
    doctorCountBn: "১ জন ডাক্তার",
    icon: <Smile className="w-6 h-6" />,
    gradient: "from-emerald-accent to-violet-accent",
    badgeColor: "text-emerald-accent bg-emerald-accent/15 border-emerald-accent/30",
  },
  {
    id: "ent",
    titleEn: "ENT Care",
    titleBn: "ناک, কান ও গলা (ইএনটি)",
    doctorCount: "1 Doctor",
    doctorCountBn: "১ জন ডাক্তার",
    icon: <Activity className="w-6 h-6" />,
    gradient: "from-coral-accent to-primary-teal",
    badgeColor: "text-coral-accent bg-coral-accent/15 border-coral-accent/30",
  },
];

const resolveIcon = (iconName: string, id: string): React.ReactNode => {
  switch (iconName || id) {
    case "HeartPulse":
    case "cardiology":
      return <HeartPulse className="w-6 h-6" />;
    case "Brain":
    case "neurology":
      return <Brain className="w-6 h-6" />;
    case "Baby":
    case "pediatrics":
      return <Baby className="w-6 h-6" />;
    case "Bone":
    case "orthopedics":
      return <Bone className="w-6 h-6" />;
    case "Sparkles":
    case "dermatology":
      return <Sparkles className="w-6 h-6" />;
    case "UserCheck":
    case "gynecology":
      return <UserCheck className="w-6 h-6" />;
    case "Eye":
    case "ophthalmology":
      return <Eye className="w-6 h-6" />;
    case "ShieldPlus":
    case "oncology":
      return <ShieldPlus className="w-6 h-6" />;
    case "Smile":
    case "psychiatry":
      return <Smile className="w-6 h-6" />;
    case "Activity":
    case "ent":
      return <Activity className="w-6 h-6" />;
    default:
      return <HeartPulse className="w-6 h-6" />;
  }
};

export function SpecialtyCarousel() {
  const { t, locale } = useLanguage();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Fetch dynamic specialties with doctor counts from backend API
  const { data: specialtiesResponse } = useGetSpecialtiesQuery();

  const displaySpecialties: SpecialtyItem[] = React.useMemo(() => {
    if (specialtiesResponse?.data && specialtiesResponse.data.length > 0) {
      return specialtiesResponse.data.map((item: SpecialtyItemData) => ({
        id: item.id,
        titleEn: item.titleEn,
        titleBn: item.titleBn,
        doctorCount: item.doctorCount,
        doctorCountBn: item.doctorCountBn,
        icon: resolveIcon(item.icon, item.id),
        gradient: item.gradient || "from-primary-teal to-emerald-accent",
        badgeColor:
          item.badgeColor ||
          "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
      }));
    }
    return defaultSpecialties;
  }, [specialtiesResponse]);

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
            className="p-2.5 rounded-2xl border border-surface-border bg-surface-card hover:border-primary-teal hover:bg-muted-bg text-fg-app transition-all shadow-xs cursor-pointer active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-2.5 rounded-2xl border border-surface-border bg-surface-card hover:border-primary-teal hover:bg-muted-bg text-fg-app transition-all shadow-xs cursor-pointer active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Track (Bottom Scrollbar Completely Hidden) */}
      <div
        ref={scrollRef}
        className="flex items-center gap-5 overflow-x-auto pb-4 pt-2 scroll-smooth no-scrollbar [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {displaySpecialties.map((item) => {
          const displayTitle = locale === "bn" ? item.titleBn : item.titleEn;
          const displayCount =
            locale === "bn" ? item.doctorCountBn || item.doctorCount : item.doctorCount;

          return (
            <ScaleOnHover key={item.id} scale={1.04} className="flex-shrink-0">
              <a
                href={`/doctors?specialty=${encodeURIComponent(item.titleEn)}`}
                className="group block w-64 rounded-3xl border border-surface-border bg-surface-card p-6 shadow-md hover:border-luminous transition-all duration-300 relative overflow-hidden luminous-border cursor-pointer select-none"
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
                      {displayTitle}
                    </h3>
                    <span
                      className={`inline-block mt-2 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${item.badgeColor}`}
                    >
                      {displayCount}
                    </span>
                  </div>
                </div>
              </a>
            </ScaleOnHover>
          );
        })}
      </div>
    </div>
  );
}
