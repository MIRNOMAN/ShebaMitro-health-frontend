"use client";

import * as React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { SpecialtyCarousel } from "@/components/home/specialty-carousel";
import { BentoGrid } from "@/components/home/bento-grid";
import { StatsCounter } from "@/components/home/stats-counter";
import { GlowCard } from "@/components/ui/glow-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { FadeInUp, StaggerChildren, StaggerItem, itemVariants } from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, Calendar, ChevronRight, ShieldCheck, HeartPulse } from "lucide-react";

const featuredDoctors = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiologist",
    rating: "4.9",
    reviews: 128,
    experience: "12+ Yrs Experience",
    location: "Central Health Hub, Dhaka",
    avatarBg: "from-primary-teal to-emerald-accent",
    status: "Available Today",
    cursorTag: "Book",
  },
  {
    id: "doc-2",
    name: "Dr. Aris Thorne",
    specialty: "Neurologist",
    rating: "5.0",
    reviews: 210,
    experience: "15+ Yrs Experience",
    location: "Neuro Care Pavilion, Dhaka",
    avatarBg: "from-violet-accent to-primary-teal",
    status: "Next Slot 2:30 PM",
    cursorTag: "View",
  },
  {
    id: "doc-3",
    name: "Dr. Elena Rostova",
    specialty: "Pediatric Specialist",
    rating: "4.8",
    reviews: 95,
    experience: "9+ Yrs Experience",
    location: "Children's Wellness Center",
    avatarBg: "from-coral-accent to-violet-accent",
    status: "Available Tomorrow",
    cursorTag: "Book",
  },
];

export default function HomePage() {
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

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDoctors.map((doc) => (
            <StaggerItem key={doc.id} variants={itemVariants}>
              <GlowCard data-cursor-text={doc.cursorTag} className="p-6 space-y-5 cursor-pointer h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${doc.avatarBg} flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-300`}
                    >
                      {doc.name.split(" ")[1]?.[0] || "D"}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold group-hover:text-primary-teal transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-accent">
                        {doc.specialty}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-fg">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-fg-app">{doc.rating}</span>
                        <span>({doc.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-surface-border text-xs text-muted-fg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary-teal" />
                      <span>{doc.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-violet-accent" />
                      <span>{doc.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-accent" />
                      <span className="font-semibold text-emerald-accent">{doc.status}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <MagneticButton distance={30} strength={0.35} className="w-full">
                    <Button
                      variant={doc.cursorTag === "Book" ? "primary" : "outline"}
                      size="md"
                      className="w-full justify-between"
                      data-cursor-text={doc.cursorTag}
                    >
                      <span>{doc.cursorTag === "Book" ? "Book Appointment" : "View Profile"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </MagneticButton>
                </div>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>
    </div>
  );
}
