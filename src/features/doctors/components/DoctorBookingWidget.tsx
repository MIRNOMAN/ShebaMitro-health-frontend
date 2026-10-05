"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Timer,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Doctor, Chamber, TimeSlot, DayAvailability } from "../types";
import { Button } from "@/components/ui/button";

interface DoctorBookingWidgetProps {
  doctor: Doctor;
}

export function DoctorBookingWidget({ doctor }: DoctorBookingWidgetProps) {
  const [consultationType, setConsultationType] = useState<"video" | "chamber">("chamber");
  const [selectedChamber, setSelectedChamber] = useState<Chamber | null>(
    doctor.chambers[0] || null
  );
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // 10-minute reservation timer state (in seconds)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  // Get active availability list based on consultation type
  const availabilityList: DayAvailability[] =
    consultationType === "video"
      ? doctor.videoAvailability || doctor.availability
      : doctor.availability;

  const currentDayAvailability = availabilityList[selectedDateIndex] || availabilityList[0];

  // Price calculations
  const consultationFee =
    consultationType === "video"
      ? doctor.videoConsultationFee || 1000
      : selectedChamber
      ? selectedChamber.consultationFee
      : doctor.chamberConsultationFee || 1500;

  // Handle slot selection & start 10-min countdown timer
  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setTimerSeconds(600); // 10 minutes (600 seconds)
    setIsBookingConfirmed(false);
  };

  // Live countdown timer effect
  useEffect(() => {
    if (timerSeconds === null || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSeconds]);

  // Format timer seconds into MM:SS
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleConfirmBooking = () => {
    setIsBookingConfirmed(true);
    setTimerSeconds(null);
  };

  // Group slots into Morning, Afternoon, Evening
  const morningSlots = currentDayAvailability?.slots.filter((s) => s.period === "morning") || [];
  const afternoonSlots = currentDayAvailability?.slots.filter((s) => s.period === "afternoon") || [];
  const eveningSlots = currentDayAvailability?.slots.filter((s) => s.period === "evening") || [];

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-md relative overflow-hidden">
      {/* Top Ambient Glow based on active consultation mode */}
      <div
        className={`absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
          consultationType === "video" ? "bg-cyan-500/20" : "bg-emerald-500/20"
        }`}
      />

      {/* Header Title */}
      <div className="flex items-center justify-between pb-4 border-b border-card-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-fg-app">Book Appointment</h3>
            <p className="text-xs text-muted-foreground">Select mode, date, and preferred time</p>
          </div>
        </div>
      </div>

      {/* 1. Consultation Mode Toggle: Video (Cyan) vs Chamber Visit (Emerald) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Consultation Type</span>
          <span className="text-[11px] font-normal text-muted-foreground">
            Instant booking confirmation
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* Video Consultation (Cyan) */}
          <button
            type="button"
            onClick={() => {
              setConsultationType("video");
              setSelectedSlot(null);
              setTimerSeconds(null);
            }}
            className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between space-y-2 relative overflow-hidden ${
              consultationType === "video"
                ? "bg-cyan-500/10 border-cyan-500 text-fg-app ring-2 ring-cyan-500/30 shadow-xs"
                : "border-card-border bg-card/60 hover:bg-surface-card-hover text-muted-foreground"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  consultationType === "video"
                    ? "bg-cyan-500 text-white"
                    : "bg-cyan-500/10 text-cyan-500"
                }`}
              >
                <Video className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">
                ৳{doctor.videoConsultationFee || 1000}
              </span>
            </div>

            <div>
              <span className="font-bold text-sm text-fg-app block">Video Consultation</span>
              <span className="text-[11px] text-muted-foreground block">
                HD Video Call • E-Prescription
              </span>
            </div>
          </button>

          {/* Chamber Visit (Emerald) */}
          <button
            type="button"
            onClick={() => {
              setConsultationType("chamber");
              setSelectedSlot(null);
              setTimerSeconds(null);
            }}
            className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between space-y-2 relative overflow-hidden ${
              consultationType === "chamber"
                ? "bg-emerald-500/10 border-emerald-500 text-fg-app ring-2 ring-emerald-500/30 shadow-xs"
                : "border-card-border bg-card/60 hover:bg-surface-card-hover text-muted-foreground"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  consultationType === "chamber"
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                ৳{selectedChamber?.consultationFee || doctor.chamberConsultationFee || 1500}
              </span>
            </div>

            <div>
              <span className="font-bold text-sm text-fg-app block">Chamber Visit</span>
              <span className="text-[11px] text-muted-foreground block">
                In-person hospital appointment
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Chamber Selector (If Chamber mode & multiple chambers exist) */}
      {consultationType === "chamber" && doctor.chambers.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-card-border/60">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" /> Select Hospital Chamber
          </label>

          <div className="space-y-2">
            {doctor.chambers.map((ch) => {
              const isSelected = selectedChamber?.id === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setSelectedChamber(ch);
                    setSelectedSlot(null);
                    setTimerSeconds(null);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500 font-semibold text-fg-app shadow-xs"
                      : "border-card-border bg-card/40 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-fg-app block truncate">{ch.name}</span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {ch.address}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    ৳{ch.consultationFee}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Horizontal 7-day Calendar Date Ribbon */}
      <div className="space-y-2 pt-2 border-t border-card-border/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Date (7-Day Ribbon)
          </label>
          <span className="text-xs font-semibold text-primary-teal">
            {currentDayAvailability?.dayLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {availabilityList.map((day, idx) => {
            const isSelected = selectedDateIndex === idx;
            const availableSlotsCount = day.slots.filter((s) => !s.isBooked).length;

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => {
                  setSelectedDateIndex(idx);
                  setSelectedSlot(null);
                  setTimerSeconds(null);
                }}
                className={`flex-1 min-w-[76px] py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? consultationType === "video"
                      ? "bg-cyan-500 text-white border-cyan-500 shadow-md scale-105"
                      : "bg-emerald-500 text-white border-emerald-500 shadow-md scale-105"
                    : "border-card-border bg-card/60 hover:bg-surface-card-hover text-fg-app"
                }`}
              >
                <span className="text-[11px] font-medium opacity-80 uppercase">
                  {day.dayName}
                </span>
                <span className="text-lg font-extrabold leading-tight">
                  {day.dayNum}
                </span>
                <span
                  className={`text-[10px] font-semibold mt-1 px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {availableSlotsCount} slots
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Morning / Afternoon / Evening Slot Chips */}
      <div className="space-y-4 pt-2 border-t border-card-border/60">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Select Time Slot</span>
          <span className="text-[11px] text-muted-foreground font-normal">
            Click available slot to reserve
          </span>
        </label>

        {/* Morning Slots */}
        {morningSlots.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              🌅 Morning Slots (09:00 AM - 12:00 PM)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {morningSlots.map((slot) => (
                <TimeSlotChip
                  key={slot.id}
                  slot={slot}
                  isSelected={selectedSlot?.id === slot.id}
                  consultationType={consultationType}
                  onSelect={() => handleSelectSlot(slot)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Afternoon Slots */}
        {afternoonSlots.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              ☀️ Afternoon Slots (02:00 PM - 05:00 PM)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {afternoonSlots.map((slot) => (
                <TimeSlotChip
                  key={slot.id}
                  slot={slot}
                  isSelected={selectedSlot?.id === slot.id}
                  consultationType={consultationType}
                  onSelect={() => handleSelectSlot(slot)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Evening Slots */}
        {eveningSlots.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              🌙 Evening Slots (06:00 PM - 09:00 PM)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {eveningSlots.map((slot) => (
                <TimeSlotChip
                  key={slot.id}
                  slot={slot}
                  isSelected={selectedSlot?.id === slot.id}
                  consultationType={consultationType}
                  onSelect={() => handleSelectSlot(slot)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Real-Time Slot Availability Feedback & 10-Minute Temporary Reservation Timer Banner */}
      <AnimatePresence>
        {selectedSlot && timerSeconds !== null && timerSeconds > 0 && !isBookingConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border shadow-xs space-y-3 ${
              consultationType === "video"
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-900 dark:text-cyan-200"
                : "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 animate-pulse text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold text-xs block text-fg-app">
                    Slot Temporarily Reserved!
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Holding {selectedSlot.time} for you
                  </span>
                </div>
              </div>

              {/* Countdown Pill */}
              <div className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono font-extrabold text-sm shadow-xs animate-pulse">
                ⏱ {formatTimer(timerSeconds)}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Please complete your booking details before the 10-minute timer expires to prevent slot release.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Summary Box & Proceed Action */}
      {selectedSlot && (
        <div className="pt-4 border-t border-card-border space-y-4">
          {isBookingConfirmed ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-base text-fg-app">Appointment Confirmed!</h4>
              <p className="text-xs text-muted-foreground">
                Your appointment ID is{" "}
                <span className="font-mono text-primary-teal font-bold">
                  SM-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-surface-card-hover border border-card-border p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultation Type:</span>
                  <span className="font-semibold text-fg-app capitalize">
                    {consultationType === "video" ? "Video Consultation (Cyan)" : "Chamber Visit (Emerald)"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-bold text-primary-teal">
                    {currentDayAvailability?.dayLabel} at {selectedSlot.time}
                  </span>
                </div>

                {consultationType === "chamber" && selectedChamber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chamber:</span>
                    <span className="font-medium text-fg-app truncate max-w-[180px]">
                      {selectedChamber.name}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-card-border font-bold text-sm">
                  <span>Consultation Fee:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base">
                    ৳{consultationFee}
                  </span>
                </div>
              </div>

              <Button
                variant={consultationType === "video" ? "primary" : "emerald"}
                onClick={handleConfirmBooking}
                className="w-full h-12 justify-center text-sm shadow-md"
              >
                Proceed to Book Appointment <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Sub-component for individual time slot chip
function TimeSlotChip({
  slot,
  isSelected,
  consultationType,
  onSelect,
}: {
  slot: TimeSlot;
  isSelected: boolean;
  consultationType: "video" | "chamber";
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={slot.isBooked}
      onClick={onSelect}
      className={`py-2 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
        slot.isBooked
          ? "bg-muted/40 border-card-border/40 text-muted-foreground line-through cursor-not-allowed opacity-50"
          : isSelected
          ? consultationType === "video"
            ? "bg-cyan-500 text-white border-cyan-500 shadow-md ring-2 ring-cyan-500/30"
            : "bg-emerald-500 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
          : "border-card-border hover:border-primary-teal/50 hover:bg-primary-teal/10 text-fg-app bg-card"
      }`}
    >
      <span>{slot.time}</span>
      <span className="text-[10px] font-normal opacity-80 capitalize">
        {slot.isBooked ? "Booked" : "Available"}
      </span>
    </button>
  );
}
