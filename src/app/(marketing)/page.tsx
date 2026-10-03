"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
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

      {/* ── Hero Section with FadeInUp ───────────────────────────── */}
      <FadeInUp className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luminous bg-surface-card/60 backdrop-blur-md shadow-xs">
          <Sparkles className="w-4 h-4 text-primary-teal animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-fg">
            Next.js 15 App Router &bull; Lenis &bull; Framer Motion
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Luminous Motion &amp;{" "}
          <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent">
            Contextual Custom Cursor
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-fg max-w-2xl mx-auto leading-relaxed">
          Featuring smooth Lenis scrolling, hardware-accelerated Custom Cursor with contextual pill tags (<code className="text-xs bg-muted-bg px-2 py-1 rounded text-primary-teal font-mono">View</code> &amp; <code className="text-xs bg-muted-bg px-2 py-1 rounded text-emerald-accent font-mono">Book</code>), and accessible motion primitives.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <ThemeToggle />
          <ScaleOnHover>
            <Button variant="primary" size="lg" className="gap-2">
              <Zap className="w-4 h-4" />
              Test Smooth Scroll &amp; Cursor
            </Button>
          </ScaleOnHover>
        </div>
      </FadeInUp>

      {/* ── Doctor Cards Section (Contextual Custom Cursor Demo) ───── */}
      <section className="space-y-8">
        <FadeInUp className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-accent/15 text-emerald-accent text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Interactive Custom Cursor Demo</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Doctor Cards with Contextual Pill Tags
          </h2>
          <p className="text-sm text-muted-fg max-w-xl mx-auto">
            Hover over any doctor card below to see the hardware-accelerated custom cursor morph into a contextual tag (<code className="text-xs text-primary-teal font-mono">&quot;Book&quot;</code> or <code className="text-xs text-emerald-accent font-mono">&quot;View&quot;</code>).
          </p>
        </FadeInUp>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctorCards.map((doc) => (
            <StaggerItem key={doc.id} variants={itemVariants}>
              <ScaleOnHover scale={1.03}>
                <div
                  data-cursor-text={doc.cursorTag}
                  className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-5 border-luminous hover:glow-teal transition-all duration-300 group cursor-pointer"
                >
                  {/* Doctor Avatar Header */}
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

                  {/* Doctor Info Pills */}
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

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      variant={doc.cursorTag === "Book" ? "primary" : "outline"}
                      size="md"
                      className="w-full justify-between"
                      data-cursor-text={doc.cursorTag}
                    >
                      <span>{doc.cursorTag === "Book" ? "Book Appointment" : "View Doctor Profile"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ScaleOnHover>
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
              <ScaleOnHover scale={1.03}>
                <div
                  className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${color.glowClass}`}
                >
                  <div
                    className={`h-24 -mx-6 -mt-6 ${color.bgClass} mb-6 flex items-end p-4 relative shadow-inner`}
                  >
                    <span className="text-white font-bold text-sm tracking-wider uppercase drop-shadow-md">
                      {color.name}
                    </span>
                  </div>

                  <div className="space-y-4">
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
                  </div>
                </div>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── Dark Slate-Blue Showcase ───────────────────────────── */}
      <FadeInUp>
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden luminous-border glow-teal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-teal/15 text-primary-teal text-xs font-bold uppercase tracking-wider">
                <Moon className="w-3.5 h-3.5" />
                <span>Deep Rich Slate-Blue Dark Mode</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight">
                Deep rich slate-blue background (<code className="text-xs text-primary-teal font-mono">hsl 222 47% 11%</code>)
              </h2>

              <p className="text-muted-fg leading-relaxed">
                Smooth Lenis scrolling paired with luminous cards, hardware-accelerated cursor morphing, and accessible motion primitives (<code className="text-xs bg-muted-bg px-1.5 py-0.5 rounded text-fg-app">&lt;FadeInUp&gt;</code>, <code className="text-xs bg-muted-bg px-1.5 py-0.5 rounded text-fg-app">&lt;ScaleOnHover&gt;</code>, <code className="text-xs bg-muted-bg px-1.5 py-0.5 rounded text-fg-app">&lt;StaggerChildren&gt;</code>).
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" size="md">
                  Primary Teal
                </Button>
                <Button variant="emerald" size="md">
                  Vibrant Emerald
                </Button>
                <Button variant="violet" size="md">
                  Electric Violet
                </Button>
                <Button variant="coral" size="md">
                  Warm Coral
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="glass-card luminous-border shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-accent" />
                    <span>System Status &amp; Performance</span>
                  </CardTitle>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-accent/20 text-emerald-accent">
                    60 FPS
                  </span>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-muted-bg/60 border border-surface-border">
                      <p className="text-xs text-muted-fg">Smooth Scroll</p>
                      <p className="text-lg font-bold text-primary-teal">Lenis v1.1</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted-bg/60 border border-surface-border">
                      <p className="text-xs text-muted-fg">Animations</p>
                      <p className="text-lg font-bold text-violet-accent">Framer Motion</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-fg">Accessibility Compliance</span>
                      <span className="font-semibold text-emerald-accent">100% (Reduced Motion)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted-bg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-teal via-emerald-accent to-coral-accent rounded-full w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* ── Feature Highlights Grid ──────────────────────────────── */}
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem variants={itemVariants}>
          <ScaleOnHover>
            <div className="glass-card p-6 rounded-2xl space-y-3 border-luminous hover:glow-teal">
              <div className="w-10 h-10 rounded-xl bg-primary-teal/15 text-primary-teal flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Lenis Smooth Scroll</h3>
              <p className="text-sm text-muted-fg leading-relaxed">
                RAF-synchronized buttery smooth momentum scrolling across the application.
              </p>
            </div>
          </ScaleOnHover>
        </StaggerItem>

        <StaggerItem variants={itemVariants}>
          <ScaleOnHover>
            <div className="glass-card p-6 rounded-2xl space-y-3 border-luminous hover:glow-emerald">
              <div className="w-10 h-10 rounded-xl bg-emerald-accent/15 text-emerald-accent flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Reduced Motion Compliant</h3>
              <p className="text-sm text-muted-fg leading-relaxed">
                All motion primitives check `useReducedMotion()` to accommodate user accessibility preferences.
              </p>
            </div>
          </ScaleOnHover>
        </StaggerItem>

        <StaggerItem variants={itemVariants}>
          <ScaleOnHover>
            <div className="glass-card p-6 rounded-2xl space-y-3 border-luminous hover:glow-violet">
              <div className="w-10 h-10 rounded-xl bg-violet-accent/15 text-violet-accent flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Contextual Cursor Tags</h3>
              <p className="text-sm text-muted-fg leading-relaxed">
                Automatically morphs to display custom pill labels (&quot;View&quot; / &quot;Book&quot;) on doctor cards.
              </p>
            </div>
          </ScaleOnHover>
        </StaggerItem>
      </StaggerChildren>
    </div>
  );
}
