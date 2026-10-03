"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  Palette,
  Moon,
  Sun,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  HeartPulse,
  Activity,
  Layers,
  Eye,
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

  return (
    <div className="relative isolate px-4 py-12 sm:px-6 sm:py-20 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* ── Background Glow Blobs ───────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-teal to-violet-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luminous bg-surface-card/60 backdrop-blur-md shadow-xs">
          <Sparkles className="w-4 h-4 text-primary-teal animate-spin-slow" />
          <span className="text-xs font-semibold tracking-wide uppercase text-muted-fg">
            Next.js 15 App Router Theme System
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Luminous Design System with{" "}
          <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent">
            OKLCH &amp; HSL
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-fg max-w-2xl mx-auto leading-relaxed">
          Featuring explicit Light &amp; Dark definitions, deep slate-blue dark background (<code className="text-xs bg-muted-bg px-2 py-1 rounded text-primary-teal font-mono">hsl 222 47% 11%</code>), luminous card borders, subtle glows, and smooth theme switching.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <ThemeToggle />
          <Button variant="primary" size="lg" className="gap-2">
            <Zap className="w-4 h-4" />
            Explore Palette
          </Button>
        </div>
      </section>

      {/* ── Theme Color Palette Cards ───────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
            <Palette className="w-6 h-6 text-primary-teal" />
            <span>Brand Palette Specifications</span>
          </h2>
          <p className="text-sm text-muted-fg">
            Click any color code below to copy its HSL value directly to your clipboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themeColors.map((color) => (
            <div
              key={color.name}
              className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${color.glowClass}`}
            >
              {/* Top Color Banner */}
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

                {/* HSL Code Button */}
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

                {/* OKLCH Code Button */}
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
          ))}
        </div>
      </section>

      {/* ── Dark Mode & Luminous Border Showcase ───────────────── */}
      <section className="space-y-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden luminous-border glow-teal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-teal/15 text-primary-teal text-xs font-bold uppercase tracking-wider">
                <Moon className="w-3.5 h-3.5" />
                <span>Deep Rich Slate-Blue Dark Mode</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight">
                Designed to avoid flat black fatigue
              </h2>

              <p className="text-muted-fg leading-relaxed">
                Rather than pure flat black (<code className="text-xs bg-muted-bg px-1.5 py-0.5 rounded text-fg-app">#000000</code>), our dark mode leverages a sophisticated deep slate-blue background (<code className="text-xs bg-muted-bg px-1.5 py-0.5 rounded text-primary-teal font-mono">hsl(222, 47%, 11%)</code>). Paired with luminous borders and neon glow filters, it delivers superior contrast and modern luxury.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="primary" size="md">
                  Primary Teal Button
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

            {/* Interactive Preview Widget */}
            <div className="space-y-4">
              <Card className="glass-card luminous-border shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-accent" />
                    <span>System Status &amp; Telemetry</span>
                  </CardTitle>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-accent/20 text-emerald-accent">
                    Live
                  </span>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-muted-bg/60 border border-surface-border">
                      <p className="text-xs text-muted-fg">Theme Preset</p>
                      <p className="text-lg font-bold text-primary-teal">OKLCH Slate</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted-bg/60 border border-surface-border">
                      <p className="text-xs text-muted-fg">Background</p>
                      <p className="text-lg font-bold text-violet-accent">HSL 222 47% 11%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-fg">Luminous Glow Density</span>
                      <span className="font-semibold text-coral-accent">98.4%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted-bg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-teal via-emerald-accent to-coral-accent rounded-full w-[98%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights Grid ──────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-3 border-luminous hover:glow-teal">
          <div className="w-10 h-10 rounded-xl bg-primary-teal/15 text-primary-teal flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">Smooth Icon Rotation</h3>
          <p className="text-sm text-muted-fg leading-relaxed">
            The ThemeToggle button features custom 500ms CSS transforms for smooth rotation when switching between light and dark modes.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border-luminous hover:glow-emerald">
          <div className="w-10 h-10 rounded-xl bg-emerald-accent/15 text-emerald-accent flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">TypeScript Strict Mode</h3>
          <p className="text-sm text-muted-fg leading-relaxed">
            Fully configured with strict compiler flags, index safety checks, and type-safe component props.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border-luminous hover:glow-violet">
          <div className="w-10 h-10 rounded-xl bg-violet-accent/15 text-violet-accent flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">Tailwind CSS v4 Inline Theme</h3>
          <p className="text-sm text-muted-fg leading-relaxed">
            Built using `@theme inline` declarations for native CSS variables and atomic utility support.
          </p>
        </div>
      </section>
    </div>
  );
}
