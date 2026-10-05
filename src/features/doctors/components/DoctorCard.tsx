"use client";

import React from "react";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Award,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Doctor } from "../types";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor: Doctor;
  onOpenSlotPreview: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onOpenSlotPreview }: DoctorCardProps) {
  const primaryChamber = doctor.chambers[0];
  const minFee = Math.min(...doctor.chambers.map((c) => c.consultationFee));

  return (
    <div className="group relative rounded-2xl border border-card-border bg-card p-5 shadow-xs hover:border-luminous transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden">
      {/* Top Background Ambient Glow */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary-teal/5 dark:bg-primary-teal/10 blur-2xl group-hover:bg-primary-teal/15 transition-all" />

      <div className="space-y-4 relative z-10">
        {/* Top Header Row: Avatar, Info, BMDC Badge */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-card-border shadow-xs group-hover:border-primary-teal/50 transition-colors"
            />
            {doctor.availableToday && (
              <span
                title="Available Today"
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card text-white text-[10px]"
              >
                <Clock className="h-3 w-3" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            {/* BMDC Verified Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {doctor.isBmdcVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {doctor.bmdcNo} Verified
                </span>
              )}

              <span className="inline-flex items-center gap-1 rounded-full bg-primary-teal/10 px-2 py-0.5 text-[11px] font-semibold text-primary-teal border border-primary-teal/20">
                <Briefcase className="h-3.5 w-3.5" />
                {doctor.experienceYears} Yrs Exp
              </span>
            </div>

            {/* Doctor Name */}
            <h3 className="text-base font-bold text-fg-app group-hover:text-primary-teal transition-colors line-clamp-1">
              {doctor.name}
            </h3>

            {/* Specialty */}
            <p className="text-xs font-semibold text-primary-teal">
              {doctor.specialtyName}
            </p>

            {/* Qualifications */}
            <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
              {doctor.qualifications.join(" • ")}
            </p>
          </div>
        </div>

        {/* Hospital Designation */}
        <p className="text-xs text-fg-app/80 font-medium line-clamp-1 bg-muted/30 p-2 rounded-xl border border-card-border/40">
          <Award className="h-3.5 w-3.5 inline mr-1 text-primary-teal" />
          {doctor.designation} — <span className="text-muted-foreground">{doctor.hospital}</span>
        </p>

        {/* Chamber Map Tags */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Chambers & Locations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {doctor.chambers.map((chamber) => (
              <span
                key={chamber.id}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-surface-card-hover border border-card-border/80 text-fg-app"
              >
                <MapPin className="h-3 w-3 text-coral-accent shrink-0" />
                <span className="font-medium truncate max-w-[160px]">
                  {chamber.mapTag}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Rating & Reviews Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-card-border/50 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              <span className="font-bold text-fg-app ml-1">{doctor.rating}</span>
            </div>
            <span className="text-muted-foreground">
              ({doctor.reviewCount} reviews)
            </span>
          </div>

          {/* Next Slot Indicator */}
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Calendar className="h-3 w-3" />
            <span>Next: {doctor.nextSlot}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Fee & Quick Slot Preview Trigger */}
      <div className="mt-5 pt-3 border-t border-card-border flex items-center justify-between gap-3 relative z-10">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
            Consultation Fee
          </span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            ৳{minFee.toLocaleString()}
          </span>
          {primaryChamber && primaryChamber.followupFee && (
            <span className="text-[10px] text-muted-foreground block">
              Follow-up: ৳{primaryChamber.followupFee}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onOpenSlotPreview(doctor)}
          className="shadow-xs hover:shadow-md transition-all group-hover:bg-primary-teal"
        >
          <span>Quick Slot Preview</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
