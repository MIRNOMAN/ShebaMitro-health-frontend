"use client";

import React, { useState } from "react";
import {
  HeartPulse,
  Brain,
  Baby,
  Activity,
  Sparkles,
  HeartHandshake,
  Smile,
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  Star,
  RotateCcw,
  Check,
  Zap,
  User,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { SPECIALTY_OPTIONS } from "../data/doctors";
import { DoctorFilterState } from "../types";
import { Button } from "@/components/ui/button";

interface DoctorFilterSidebarProps {
  filters: DoctorFilterState;
  toggleSpecialty: (id: string) => void;
  setMaxFee: (fee: number) => void;
  setMinRating: (rating: number) => void;
  setGender: (gender: DoctorFilterState["gender"]) => void;
  setAvailableToday: (available: boolean) => void;
  resetFilters: () => void;
  activeCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  HeartPulse,
  Brain,
  Baby,
  Activity,
  Sparkles,
  HeartHandshake,
  Smile,
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
};

export function DoctorFilterSidebar({
  filters,
  toggleSpecialty,
  setMaxFee,
  setMinRating,
  setGender,
  setAvailableToday,
  resetFilters,
  activeCount,
  isOpenMobile = false,
  onCloseMobile,
}: DoctorFilterSidebarProps) {
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  const displayedSpecialties = showAllSpecialties
    ? SPECIALTY_OPTIONS
    : SPECIALTY_OPTIONS.slice(0, 6);

  const SidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-card-border/60">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-teal/10 text-primary-teal">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-fg-app">Filter Doctors</h3>
            <p className="text-xs text-muted-foreground">Narrow down by specs & slots</p>
          </div>
        </div>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 px-2 text-xs text-primary-teal hover:text-primary-teal/80 hover:bg-primary-teal/10 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset ({activeCount})
          </Button>
        )}
      </div>

      {/* 1. "Available Today" Switch */}
      <div className="rounded-xl border border-primary-teal/20 bg-primary-teal/5 dark:bg-primary-teal/10 p-3.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
            <Zap className="h-4 w-4 fill-emerald-500/30" />
          </div>
          <div>
            <span className="text-sm font-semibold text-fg-app flex items-center gap-1.5">
              Available Today
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
            <p className="text-xs text-muted-foreground">Instant slot confirmation</p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={filters.availableToday}
          onClick={() => setAvailableToday(!filters.availableToday)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal ${
            filters.availableToday ? "bg-primary-teal" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              filters.availableToday ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* 2. Specialty Multi-checkboxes with color icons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Medical Specialty
          </h4>
          {filters.specialties.length > 0 && (
            <span className="text-[11px] font-semibold text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded-full">
              {filters.specialties.length} selected
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {displayedSpecialties.map((specialty) => {
            const Icon = ICON_MAP[specialty.iconName] || HeartPulse;
            const isChecked = filters.specialties.includes(specialty.id);

            return (
              <label
                key={specialty.id}
                onClick={() => toggleSpecialty(specialty.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                  isChecked
                    ? "bg-surface-card-hover border-primary-teal shadow-xs"
                    : "bg-transparent border-transparent hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 ${specialty.bgClass} ${specialty.colorClass} ${specialty.borderClass} ${
                      isChecked ? "scale-105 shadow-xs" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`text-sm font-medium truncate ${
                      isChecked ? "text-primary-teal font-semibold" : "text-fg-app"
                    }`}
                  >
                    {specialty.name}
                  </span>
                </div>

                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-primary-teal border-primary-teal text-white"
                      : "border-muted-foreground/40 bg-card"
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>

        {SPECIALTY_OPTIONS.length > 6 && (
          <button
            onClick={() => setShowAllSpecialties(!showAllSpecialties)}
            className="flex items-center gap-1 text-xs font-semibold text-primary-teal hover:underline pt-1 pl-1"
          >
            {showAllSpecialties ? (
              <>
                Show Less <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Show {SPECIALTY_OPTIONS.length - 6} More Specialties{" "}
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* 3. Fee Slider with Real-time Budget Badge */}
      <div className="space-y-3 pt-2 border-t border-card-border/60">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Max Consultation Fee
          </h4>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {filters.maxFee >= 3000 ? "Any Fee" : `Max ৳${filters.maxFee.toLocaleString()}`}
          </span>
        </div>

        <div className="space-y-2 px-1">
          <input
            type="range"
            min={500}
            max={3000}
            step={100}
            value={filters.maxFee}
            onChange={(e) => setMaxFee(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary-teal"
          />

          <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
            <span>৳500</span>
            <span>৳1,500</span>
            <span>৳3,000+</span>
          </div>
        </div>
      </div>

      {/* 4. Minimum Rating Stars (4.0+) */}
      <div className="space-y-3 pt-2 border-t border-card-border/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Minimum Rating
        </h4>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Any Rating", val: 0 },
            { label: "4.0+ Stars", val: 4.0 },
            { label: "4.5+ Stars", val: 4.5 },
            { label: "4.8+ Top Rated", val: 4.8 },
          ].map((item) => {
            const isSelected = filters.minRating === item.val;
            return (
              <button
                key={item.val}
                type="button"
                onClick={() => setMinRating(item.val)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-xs"
                    : "border-card-border/70 hover:border-amber-500/40 text-fg-app bg-card/40"
                }`}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    isSelected
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted-foreground/30 text-muted-foreground"
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Gender Filter */}
      <div className="space-y-3 pt-2 border-t border-card-border/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Doctor Gender
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "all", label: "All", icon: User },
            { id: "male", label: "Male", icon: User },
            { id: "female", label: "Female", icon: User },
          ].map((g) => {
            const isSelected = filters.gender === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id as DoctorFilterState["gender"])}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                  isSelected
                    ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                    : "border-card-border/70 hover:bg-muted/40 text-fg-app bg-card/40"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-card-border bg-card/80 p-5 shadow-sm backdrop-blur-md transition-all">
          {SidebarContent}
        </div>
      </aside>

      {/* Mobile Slide-over Filter Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-card p-5 shadow-2xl overflow-y-auto z-10 border-r border-card-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-card-border">
                <span className="font-bold text-lg text-fg-app">Filter Doctors</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-fg-app"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {SidebarContent}
            </div>

            <div className="pt-5 mt-5 border-t border-card-border">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={onCloseMobile}
              >
                Apply Filters ({activeCount} Active)
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
