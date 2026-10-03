"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Video, Clock } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { useLanguage, type TranslationKey } from "@/components/providers/language-provider";

export interface HeroSlideItem {
  id: string;
  image: string;
  alt: string;
  badgeKey: TranslationKey;
  badgeIcon: React.ReactNode;
  titleKey: TranslationKey;
  subKey: TranslationKey;
}

const slides: HeroSlideItem[] = [
  {
    id: "slide-1",
    image: "/images/hero-doctor.jpg",
    alt: "ShebaMitro Verified Specialist Doctor",
    badgeKey: "slide1Badge",
    badgeIcon: <ShieldCheck className="w-4 h-4 text-emerald-accent" />,
    titleKey: "slide1Title",
    subKey: "slide1Sub",
  },
  {
    id: "slide-2",
    image: "/images/family-health.jpg",
    alt: "ShebaMitro Family Healthcare Consultation",
    badgeKey: "slide2Badge",
    badgeIcon: <Sparkles className="w-4 h-4 text-primary-teal" />,
    titleKey: "slide2Title",
    subKey: "slide2Sub",
  },
  {
    id: "slide-3",
    image: "/images/telemedicine.jpg",
    alt: "ShebaMitro 24/7 Video Telemedicine",
    badgeKey: "slide3Badge",
    badgeIcon: <Video className="w-4 h-4 text-violet-accent" />,
    titleKey: "slide3Title",
    subKey: "slide3Sub",
  },
  {
    id: "slide-4",
    image: "/images/express-pharmacy.jpg",
    alt: "ShebaMitro Express Pharmacy Delivery",
    badgeKey: "slide4Badge",
    badgeIcon: <Clock className="w-4 h-4 text-coral-accent" />,
    titleKey: "slide4Title",
    subKey: "slide4Sub",
  },
];

export function HeroSlider() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Auto-slide every 5 seconds
  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] ?? slides[0]!;

  return (
    <div
      className="relative w-full max-w-lg mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <GlowCard className="relative p-2.5 rounded-3xl shadow-2xl overflow-hidden luminous-border bg-surface-card">
        {/* Main Image Slider Frame */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={currentSlide.image}
                alt={currentSlide.alt}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle dark gradient overlay at the bottom for clean text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Simple, Clean Bottom Caption (No Clunky Floating Overlays) */}
          <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10 space-y-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + "-caption"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="space-y-1"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-white">
                  {currentSlide.badgeIcon}
                  <span>{t(currentSlide.badgeKey)}</span>
                </div>
                <h3 className="text-xl font-black tracking-tight drop-shadow-sm">
                  {t(currentSlide.titleKey)}
                </h3>
                <p className="text-xs font-medium text-white/80">
                  {t(currentSlide.subKey)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Previous / Next Arrow Buttons */}
          <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none z-20">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all pointer-events-auto border border-white/20 hover:scale-110 shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all pointer-events-auto border border-white/20 hover:scale-110 shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Indicator Dots Bar */}
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-7 bg-primary-teal"
                  : "w-2 bg-surface-border hover:bg-muted-fg/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </GlowCard>
    </div>
  );
}
