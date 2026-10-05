"use client";

import React, { use } from "react";
import Link from "next/link";
import { useDoctorDetail } from "@/features/doctors/hooks/useDoctorDetail";
import { DoctorEducationTimeline } from "@/features/doctors/components/DoctorEducationTimeline";
import { DoctorReviewBreakdown } from "@/features/doctors/components/DoctorReviewBreakdown";
import { DoctorBookingWidget } from "@/features/doctors/components/DoctorBookingWidget";
import {
  ShieldCheck,
  Video,
  Star,
  ChevronRight,
  MapPin,
  Building2,
  Award,
  Briefcase,
  Users,
  CheckCircle2,
  Stethoscope,
  Share2,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  const resolvedParams = use(params);
  const doctorId = resolvedParams.id;

  const { data: doctor, isLoading, isError } = useDoctorDetail(doctorId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-teal" />
          <p className="text-xs font-semibold text-muted-foreground animate-pulse">
            Loading doctor profile & slots...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 rounded-2xl border border-card-border bg-card text-center space-y-4 shadow-sm">
          <Stethoscope className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-fg-app">Doctor Profile Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The doctor profile you are looking for may have been moved or is temporarily unavailable.
          </p>
          <Link href="/doctors">
            <Button variant="primary" size="sm">
              Back to Doctors Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Breadcrumbs */}
      <div className="border-b border-card-border/50 bg-card/40 backdrop-blur-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Link href="/" className="hover:text-primary-teal transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/doctors" className="hover:text-primary-teal transition-colors">
              Doctors
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-fg-app font-semibold truncate">{doctor.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Doctor Header */}
      <section className="bg-gradient-to-b from-primary-teal/10 via-background to-background border-b border-card-border/60 py-8 lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left Info: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-start gap-5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover border-4 border-card shadow-lg ring-2 ring-primary-teal/30"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ring-2 ring-card shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> ACTIVE
                </span>
              </div>

              <div className="space-y-2 min-w-0">
                {/* Verification Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {doctor.isBmdcVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {doctor.bmdcNo} Verified
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    <Video className="h-3.5 w-3.5" />
                    Video Consult Ready
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    Top Rated Specialist
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
                  {doctor.name}
                </h1>

                {/* Specialty & Qualifications */}
                <p className="text-sm font-semibold text-primary-teal">
                  {doctor.specialtyName}
                </p>

                <p className="text-xs text-muted-foreground font-mono">
                  {doctor.qualifications.join(" • ")}
                </p>

                <p className="text-xs text-fg-app/80 font-medium">
                  <Award className="h-3.5 w-3.5 inline mr-1 text-primary-teal" />
                  {doctor.designation} — <span className="text-muted-foreground">{doctor.hospital}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
              <Button variant="outline" size="sm" className="h-9 px-3">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-3 text-rose-500 hover:text-rose-600">
                <Heart className="h-4 w-4" /> Save
              </Button>
            </div>
          </div>

          {/* Key Metric Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-card-border/60">
            <div className="p-3.5 rounded-xl bg-card border border-card-border/80 text-center space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium block">Experience</span>
              <span className="text-lg font-extrabold text-fg-app flex items-center justify-center gap-1">
                <Briefcase className="h-4 w-4 text-primary-teal" /> {doctor.experienceYears}+ Years
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-card-border/80 text-center space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium block">Patients Treated</span>
              <span className="text-lg font-extrabold text-fg-app flex items-center justify-center gap-1">
                <Users className="h-4 w-4 text-emerald-500" /> {doctor.totalPatientsTreated.toLocaleString()}+
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-card-border/80 text-center space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium block">Overall Rating</span>
              <span className="text-lg font-extrabold text-fg-app flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {doctor.rating} ({doctor.reviewCount})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-card-border/80 text-center space-y-0.5">
              <span className="text-xs text-muted-foreground font-medium block">BMDC Verification</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout: Left Details + Right Interactive Booking Widget */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols on desktop): Doctor Bio, Education Timeline, Chambers, Reviews */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-8">
            {/* About Doctor */}
            <div className="rounded-2xl border border-card-border bg-card p-6 space-y-3 shadow-xs">
              <h3 className="font-bold text-lg text-fg-app">About Doctor</h3>
              <p className="text-sm text-fg-app/90 leading-relaxed">
                {doctor.about}
              </p>
            </div>

            {/* Educational Journey Timeline */}
            <DoctorEducationTimeline
              qualifications={doctor.qualifications}
              timeline={doctor.educationTimeline}
            />

            {/* Chamber Locations List */}
            <div className="rounded-2xl border border-card-border bg-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-card-border">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-accent/10 text-coral-accent">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-fg-app">Chamber Locations & Fees</h3>
                  <p className="text-xs text-muted-foreground">In-person consultation centers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {doctor.chambers.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-4 rounded-xl border border-card-border/80 bg-surface-card-hover/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-sm text-fg-app flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-primary-teal shrink-0" />
                        {ch.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-coral-accent shrink-0" />
                        {ch.address}
                      </p>
                      <p className="text-[11px] text-primary-teal font-medium">
                        Available: {ch.availableDays.join(", ")}
                      </p>
                    </div>

                    <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-card-border">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                        New Consultation Fee
                      </span>
                      <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        ৳{ch.consultationFee}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        Follow-up: ৳{ch.followupFee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Reviews Breakdown */}
            <DoctorReviewBreakdown doctor={doctor} />
          </div>

          {/* Right Column (5 cols on desktop): Interactive Slot Booking Component */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 space-y-6">
            <DoctorBookingWidget doctor={doctor} />
          </div>
        </div>
      </main>
    </div>
  );
}
