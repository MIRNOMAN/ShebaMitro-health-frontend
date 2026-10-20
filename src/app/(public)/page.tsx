"use client";

import * as React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { SpecialtyCarousel } from "@/components/home/specialty-carousel";
import { BentoGrid } from "@/components/home/bento-grid";
import { StatsCounter } from "@/components/home/stats-counter";
import { GlowCard } from "@/components/ui/glow-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import Link from "next/link";
import { FadeInUp, StaggerChildren, StaggerItem, itemVariants } from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Calendar, ChevronRight, ShieldCheck, HeartPulse, Sparkles, ArrowRight } from "lucide-react";
import { useGetFeaturedDoctorsQuery } from "@/redux/api/doctorApi";
import { DoctorSlotDrawer } from "@/features/doctors/components/DoctorSlotDrawer";
import { Doctor } from "@/features/doctors/types";

export default function HomePage() {
  const { data: featuredData, isLoading: isDoctorsLoading } = useGetFeaturedDoctorsQuery({ limit: 3 });
  const doctors: Doctor[] = featuredData?.data?.items || [];

  const [selectedDoctorForDrawer, setSelectedDoctorForDrawer] = React.useState<Doctor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

  const handleOpenSlotDrawer = (e: React.MouseEvent, doc: Doctor) => {
    e.stopPropagation();
    setSelectedDoctorForDrawer(doc);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDoctorForDrawer(null);
  };

  const avatarGradients = [
    "from-primary-teal to-emerald-accent",
    "from-violet-accent to-primary-teal",
    "from-coral-accent to-violet-accent",
  ];

  return (
    <div className="relative isolate min-h-screen space-y-20 pb-20">
      {/* 1) Hero section with kinetic headline text reveal & ambient floating gradient orbs */}
      {/* 2) Interactive omni-search input with instant autocomplete popup (inside Hero) */}
      <HeroSection />

      {/* 5) Live platform stats counter */}
      <StatsCounter />

      {/* 3) Horizontal scrolling medical specialty carousel powered by Framer Motion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SpecialtyCarousel />
      </section>

      {/* 4) Interactive Bento Grid (Smart Medicine Alarms, Video Consults, 2-Hour Pharmacy Delivery, Home Lab) */}
      <BentoGrid />

      {/* Featured Verified Specialists Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <FadeInUp className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-accent/15 text-emerald-accent text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>BMDC Verified Physicians</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Consult Top Medical Specialists
          </h2>
          <p className="text-sm text-muted-fg">
            Book in-person appointments or start instant telemedicine calls with certified healthcare experts.
          </p>
        </FadeInUp>

        {isDoctorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-6 rounded-2xl bg-card border border-surface-border animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-border/40" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-surface-border/50 rounded-sm w-3/4" />
                    <div className="h-3 bg-surface-border/30 rounded-sm w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-surface-border/30">
                  <div className="h-3 bg-surface-border/30 rounded-sm w-2/3" />
                  <div className="h-3 bg-surface-border/30 rounded-sm w-4/5" />
                </div>
                <div className="h-10 bg-surface-border/40 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doc, idx) => {
              const gradient = avatarGradients[idx % avatarGradients.length];
              const docName = doc.name || "Dr. Specialist";
              const initial = docName.replace(/^Dr\.\s*|Prof\.\s*Dr\.\s*/i, "")[0] || "D";
              const location = doc.hospital || doc.chambers?.[0]?.name || "Dhaka, Bangladesh";
              const statusText = doc.availableToday
                ? "Available Today"
                : doc.nextSlot || "Next Slot Tomorrow";

              return (
                <StaggerItem key={doc.id} variants={itemVariants}>
                  <Link href={`/doctors/${doc.id}`} className="block h-full">
                    <GlowCard
                      data-cursor-text="Profile"
                      className="p-6 space-y-5 cursor-pointer h-full flex flex-col justify-between hover:border-primary-teal/40 transition-colors"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          {doc.avatarUrl ? (
                            <img
                              src={doc.avatarUrl}
                              alt={docName}
                              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-teal/20 shadow-md group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div
                              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-300`}
                            >
                              {initial}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-extrabold group-hover:text-primary-teal transition-colors truncate">
                              {docName}
                            </h3>
                            <p className="text-xs font-semibold text-emerald-accent truncate">
                              {doc.specialtyName || doc.designation}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-fg">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              <span className="font-bold text-fg-app">{doc.rating?.toFixed(1) || "4.9"}</span>
                              <span>({doc.reviewCount || 100}+ reviews)</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-surface-border text-xs text-muted-fg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary-teal shrink-0" />
                            <span>{doc.experienceYears ? `${doc.experienceYears}+ Yrs Experience` : "10+ Yrs Experience"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-violet-accent shrink-0" />
                            <span className="truncate">{location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-emerald-accent shrink-0" />
                            <span className="font-semibold text-emerald-accent">{statusText}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="md"
                          className="flex-1 justify-between text-xs font-bold"
                          onClick={(e) => handleOpenSlotDrawer(e, doc)}
                        >
                          <span>Book Appointment</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          className="px-3 text-xs"
                          title="View Profile"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </GlowCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        )}

        <div className="text-center pt-2">
          <Link href="/doctors">
            <Button variant="outline" size="lg" className="rounded-2xl border-primary-teal/30 hover:border-primary-teal px-6">
              <span>View All 20+ Verified Specialists</span>
              <ArrowRight className="w-4 h-4 ml-2 text-primary-teal" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Appointment Booking Drawer Modal */}
      <DoctorSlotDrawer
        doctor={selectedDoctorForDrawer}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
