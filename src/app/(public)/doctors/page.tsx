"use client";

import React, { Suspense, useState } from "react";
import { Doctor } from "@/features/doctors/types";
import { useDoctorFilters } from "@/features/doctors/hooks/useDoctorFilters";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import { DoctorFilterSidebar } from "@/features/doctors/components/DoctorFilterSidebar";
import { DoctorGridHeader } from "@/features/doctors/components/DoctorGridHeader";
import { DoctorCard } from "@/features/doctors/components/DoctorCard";
import { DoctorCardSkeleton } from "@/features/doctors/components/DoctorCardSkeleton";
import { DoctorSlotDrawer } from "@/features/doctors/components/DoctorSlotDrawer";
import {
  Stethoscope,
  ShieldCheck,
  CalendarCheck,
  UserCheck,
  Search,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function DoctorsPageContent() {
  const {
    filters,
    toggleSpecialty,
    setMaxFee,
    setMinRating,
    setGender,
    setAvailableToday,
    setSearch,
    setSortBy,
    resetFilters,
    activeCount,
  } = useDoctorFilters();

  const { data, isLoading, isError, refetch } = useDoctors(filters);

  const [selectedDoctorForDrawer, setSelectedDoctorForDrawer] = useState<Doctor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const handleOpenSlotPreview = (doctor: Doctor) => {
    setSelectedDoctorForDrawer(doctor);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDoctorForDrawer(null);
  };

  const doctors = data?.doctors || [];
  const totalCount = data?.total || 0;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-teal/10 via-background to-background py-10 lg:py-14 border-b border-card-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-radial from-primary-teal/20 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" /> 100% Verified BMDC Specialists
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fg-app tracking-tight">
              Find & Book <span className="text-primary-teal">Top Doctors</span> Near You
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Browse BMDC-registered specialist doctors in Bangladesh. Filter by specialty, fee, ratings, and instant appointment availability with real-time chamber slot previews.
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-fg-app">
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <UserCheck className="h-4 w-4 text-primary-teal" />
                <span>500+ Verified Doctors</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <CalendarCheck className="h-4 w-4 text-emerald-500" />
                <span>Instant Slot Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Zero Booking Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body Grid */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Sidebar */}
          <DoctorFilterSidebar
            filters={filters}
            toggleSpecialty={toggleSpecialty}
            setMaxFee={setMaxFee}
            setMinRating={setMinRating}
            setGender={setGender}
            setAvailableToday={setAvailableToday}
            resetFilters={resetFilters}
            activeCount={activeCount}
            isOpenMobile={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Main Grid Area */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Header controls (search, sort, active badges) */}
            <DoctorGridHeader
              filters={filters}
              total={totalCount}
              isLoading={isLoading}
              setSearch={setSearch}
              setSortBy={setSortBy}
              toggleSpecialty={toggleSpecialty}
              setMaxFee={setMaxFee}
              setMinRating={setMinRating}
              setGender={setGender}
              setAvailableToday={setAvailableToday}
              resetFilters={resetFilters}
              activeCount={activeCount}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            {/* Error State */}
            {isError && (
              <div className="p-8 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-center space-y-3">
                <p className="text-sm font-semibold text-rose-500">
                  Failed to load doctor listings.
                </p>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Doctors Card Grid / Loading / Empty State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <DoctorCardSkeleton key={i} />
                ))}
              </div>
            ) : doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onOpenSlotPreview={handleOpenSlotPreview}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 text-center space-y-4 rounded-2xl border border-dashed border-card-border bg-card/40 p-8">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-fg-app">No Doctors Match Your Filters</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Try adjusting your fee limit, specialty filters, or clearing search criteria to see more specialists.
                  </p>
                </div>
                {activeCount > 0 && (
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick Slot Preview Drawer */}
      <DoctorSlotDrawer
        doctor={selectedDoctorForDrawer}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-teal" />
        </div>
      }
    >
      <DoctorsPageContent />
    </Suspense>
  );
}
