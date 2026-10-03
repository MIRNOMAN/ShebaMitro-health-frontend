"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { GlowCard } from "@/components/ui/glow-card";
import {
  FadeInUp,
  ScaleOnHover,
  StaggerChildren,
  StaggerItem,
  itemVariants,
} from "@/components/motion/motion-primitives";
import {
  Sparkles,
  Palette,
  Moon,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  HeartPulse,
  Activity,
  Layers,
  Calendar,
  Star,
  Stethoscope,
  Clock,
  MapPin,
  ChevronRight,
  Magnet,
} from "lucide-react";

export default function ThemeShowcasePage() {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const themeColors = [
    {
      name: "Primary Teal",
      hsl: "hsl(189 94% 43%)",
      oklch: "oklch(0.64 0.17 215)",
      bgClass: "bg-primary-teal",
      glowClass: "glow-teal",
      textColor: "text-primary-teal",
      borderColor: "border-primary-teal/40",
      description: "Core brand color for headers, main calls-to-action, and focus rings.",
    },
    {
      name: "Vibrant Emerald",
      hsl: "hsl(152 76% 40%)",
      oklch: "oklch(0.63 0.18 160)",
      bgClass: "bg-emerald-accent",
      glowClass: "glow-emerald",
      textColor: "text-emerald-accent",
      borderColor: "border-emerald-accent/40",
      description: "Vitality green for success states, healthy metrics, and active badges.",
    },
    {
      name: "Electric Violet",
      hsl: "hsl(262 83% 58%)",
      oklch: "oklch(0.58 0.26 290)",
      bgClass: "bg-violet-accent",
      glowClass: "glow-violet",
      textColor: "text-violet-accent",
      borderColor: "border-violet-accent/40",
      description: "Rich violet accent for feature highlights, premium elements, and tags.",
    },
    {
      name: "Warm Coral",
      hsl: "hsl(14 90% 55%)",
      oklch: "oklch(0.64 0.22 35)",
      bgClass: "bg-coral-accent",
      glowClass: "glow-coral",
      textColor: "text-coral-accent",
      borderColor: "border-coral-accent/40",
      description: "Warm coral for alerts, dynamic counters, and interactive highlights.",
    },
  ];

  const doctorCards = [
    {
      id: "doc-1",
      name: "Dr. Sarah Jenkins",
      specialty: "Cardiologist",
      rating: "4.9",
      reviews: 128,
      experience: "12+ Yrs Experience",
      location: "Central Health Hub",
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
      location: "Neuro Care Pavilion",
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

  return (
    <div className="relative isolate px-4 py-12 sm:px-6 sm:py-20 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* ── Background Ambient Glow ───────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-teal to-violet-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* ── Hero Section with MagneticButton ────────────────────── */}
      <FadeInUp className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luminous bg-surface-card/60 backdrop-blur-md shadow-xs">
          <Sparkles className="w-4 h-4 text-primary-teal animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-fg">
            Next.js 15 &bull; Navigation Header &bull; Mega-Menu &bull; Emergency SOS
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Luminous Public Navigation &amp;{" "}
          <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent">
            Healthcare Ecosystem
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-fg max-w-2xl mx-auto leading-relaxed">
          Featuring sticky glassmorphic navigation, interactive Mega-Menu, GPS-enabled Emergency SOS dispatch, multi-role portal login selector, and responsive mobile sheet.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <ThemeToggle />
          
          <MagneticButton distance={35} strength={0.35}>
            <Button variant="primary" size="lg" className="gap-2 shadow-lg">
              <Magnet className="w-4 h-4 text-white" />
              <span>Magnetic Action (35px Radius)</span>
            </Button>
          </MagneticButton>
        </div>
      </FadeInUp>

      {/* ── Doctor Cards Section with GlowCard ──────────────────── */}
      <section className="space-y-8">
        <FadeInUp className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-accent/15 text-emerald-accent text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Interactive Glow Cards &amp; Contextual Cursor</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Doctor Cards with Dynamic Mouse Glow
          </h2>
          <p className="text-sm text-muted-fg max-w-2xl mx-auto">
            Move your cursor across these <code className="text-xs text-primary-teal font-mono">&lt;GlowCard&gt;</code> elements to reveal mouse-position tracking radial glow.
          </p>
        </FadeInUp>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctorCards.map((doc) => (
            <StaggerItem key={doc.id} variants={itemVariants}>
              <GlowCard data-cursor-text={doc.cursorTag} className="p-6 space-y-5 cursor-pointer">
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
                    <p className="text-xs font-medium text-emerald-accent">
                      {doc.specialty}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-fg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-fg-app">{doc.rating}</span>
                      <span>({doc.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-surface-border text-xs text-muted-fg">
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

                <div className="pt-2 flex justify-center">
                  <MagneticButton distance={30} strength={0.4} className="w-full">
                    <Button
                      variant={doc.cursorTag === "Book" ? "primary" : "outline"}
                      size="md"
                      className="w-full justify-between"
                      data-cursor-text={doc.cursorTag}
                    >
                      <span>{doc.cursorTag === "Book" ? "Book Appointment" : "View Doctor Profile"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </MagneticButton>
                </div>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── Theme Palette Showcase Section ──────────────────────── */}
      <section className="space-y-8">
        <FadeInUp className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
            <Palette className="w-6 h-6 text-primary-teal" />
            <span>Brand Palette Specifications</span>
          </h2>
          <p className="text-sm text-muted-fg">
            Click any color code below to copy its HSL value directly to your clipboard.
          </p>
        </FadeInUp>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themeColors.map((color) => (
            <StaggerItem key={color.name} variants={itemVariants}>
              <GlowCard className="p-6 space-y-4">
                <div
                  className={`h-24 -mx-6 -mt-6 ${color.bgClass} mb-6 flex items-end p-4 relative shadow-inner`}
                >
                  <span className="text-white font-bold text-sm tracking-wider uppercase drop-shadow-md">
                    {color.name}
                  </span>
                </div>

                <p className="text-xs text-muted-fg leading-relaxed">
                  {color.description}
                </p>

                <button
                  onClick={() => copyToClipboard(color.hsl)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border ${color.borderColor} bg-surface-card/80 text-xs font-mono transition-all hover:bg-muted-bg group`}
                >
                  <span className="text-muted-fg font-semibold">HSL:</span>
                  <span className={`font-bold ${color.textColor}`}>{color.hsl}</span>
                  {copiedColor === color.hsl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-accent" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-fg group-hover:text-fg-app" />
                  )}
                </button>

                <button
                  onClick={() => copyToClipboard(color.oklch)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-xs font-mono transition-all hover:bg-muted-bg group"
                >
                  <span className="text-muted-fg font-semibold">OKLCH:</span>
                  <span className="text-fg-app font-medium">{color.oklch}</span>
                  {copiedColor === color.oklch ? (
                    <Check className="w-3.5 h-3.5 text-emerald-accent" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-fg group-hover:text-fg-app" />
                  )}
                </button>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── Feature Highlights Grid with GlowCard ────────────────── */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem variants={itemVariants}>
          <GlowCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-teal/15 text-primary-teal flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Public Navigation Header</h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              Sticky glassmorphic layout featuring brand logo, interactive mega-menu, SOS dispatch, and role switcher.
            </p>
          </GlowCard>
        </StaggerItem>

        <StaggerItem variants={itemVariants}>
          <GlowCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-accent/15 text-emerald-accent flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">GPS SOS Dispatch</h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              Real-time browser geolocation telemetry with one-touch emergency ambulance dispatch and 999 hotline integration.
            </p>
          </GlowCard>
        </StaggerItem>

        <StaggerItem variants={itemVariants}>
          <GlowCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-accent/15 text-violet-accent flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Role Access Selector</h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              Interactive badge switcher for Patient, Doctor, Lab, and Pharmacy portals.
            </p>
          </GlowCard>
        </StaggerItem>
      </StaggerChildren>
    </div>
  );
}
