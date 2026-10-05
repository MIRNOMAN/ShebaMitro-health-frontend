"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Building2,
  CreditCard,
  Sparkles,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Doctor, Chamber, TimeSlot } from "../types";
import { Button } from "@/components/ui/button";

interface DoctorSlotDrawerProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorSlotDrawer({ doctor, isOpen, onClose }: DoctorSlotDrawerProps) {
  const [selectedChamber, setSelectedChamber] = useState<Chamber | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync state when doctor opens
  React.useEffect(() => {
    if (doctor && doctor.chambers.length > 0) {
      setSelectedChamber(doctor.chambers[0] || null);
      setSelectedDateIndex(0);
      setSelectedSlot(null);
      setBookingSuccess(false);
    }
  }, [doctor]);

  if (!doctor) return null;

  const activeAvailability = doctor.availability[selectedDateIndex] || doctor.availability[0];

  const handleConfirmBooking = () => {
    if (!selectedSlot || !selectedChamber) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg bg-card border-l border-card-border shadow-2xl flex flex-col h-full z-10 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-card-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fg-app">Quick Slot Preview</h3>
                  <p className="text-xs text-muted-foreground">Select date & time to book</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-fg-app transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-6 flex-1">
              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/40"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-fg-app">Slot Reserved Successfully!</h4>
                    <p className="text-sm text-muted-foreground">
                      Appointment ID: <span className="font-mono text-primary-teal font-semibold">SM-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </p>
                  </div>

                  <div className="bg-surface-card-hover border border-card-border rounded-xl p-4 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-semibold text-fg-app">{doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chamber:</span>
                      <span className="font-semibold text-fg-app truncate max-w-[200px]">
                        {selectedChamber?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date & Time:</span>
                      <span className="font-semibold text-primary-teal">
                        {activeAvailability?.dayLabel} at {selectedSlot?.time}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-card-border">
                      <span className="text-muted-foreground">Consultation Fee:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ৳{selectedChamber?.consultationFee}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    A confirmation SMS & email reminder have been sent to your mobile number.
                  </p>

                  <div className="pt-3">
                    <Button variant="primary" className="w-full" onClick={onClose}>
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Doctor Mini Profile */}
                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-surface-card-hover border border-card-border">
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.name}
                      className="w-14 h-14 rounded-xl object-cover border border-card-border shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-fg-app truncate">{doctor.name}</h4>
                        {doctor.isBmdcVerified && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            <ShieldCheck className="h-3 w-3" /> BMDC
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-primary-teal font-medium truncate">
                        {doctor.specialtyName}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {doctor.qualifications.join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Chamber Selection */}
                  {doctor.chambers.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-primary-teal" /> Select Chamber
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {doctor.chambers.map((ch) => {
                          const isSelected = selectedChamber?.id === ch.id;
                          return (
                            <div
                              key={ch.id}
                              onClick={() => {
                                setSelectedChamber(ch);
                                setSelectedSlot(null);
                              }}
                              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-primary-teal/10 border-primary-teal text-fg-app shadow-xs"
                                  : "border-card-border hover:bg-muted/40 text-fg-app"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-semibold text-xs text-fg-app flex items-center gap-1">
                                    {ch.name}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="truncate">{ch.address}</span>
                                  </div>
                                </div>
                                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
                                  ৳{ch.consultationFee}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Date Tabs */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary-teal" /> Select Date
                    </label>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {doctor.availability.map((day, idx) => {
                        const isSelected = selectedDateIndex === idx;
                        return (
                          <button
                            key={day.date}
                            type="button"
                            onClick={() => {
                              setSelectedDateIndex(idx);
                              setSelectedSlot(null);
                            }}
                            className={`py-2 px-3.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                              isSelected
                                ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                                : "border-card-border hover:bg-muted/40 text-fg-app bg-card"
                            }`}
                          >
                            {day.dayLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slot Grid */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary-teal" /> Available Time Slots
                    </label>

                    {activeAvailability?.slots && activeAvailability.slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {activeAvailability.slots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={slot.isBooked}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                                slot.isBooked
                                  ? "bg-muted/40 border-card-border/40 text-muted-foreground line-through cursor-not-allowed opacity-50"
                                  : isSelected
                                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/30"
                                  : "border-card-border hover:border-emerald-500/50 hover:bg-emerald-500/10 text-fg-app bg-card"
                              }`}
                            >
                              <span>{slot.time}</span>
                              <span className="text-[10px] font-normal opacity-80 capitalize">
                                {slot.isBooked ? "Booked" : slot.period}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-2">
                        No available slots on this date.
                      </p>
                    )}
                  </div>

                  {/* Price & Summary */}
                  {selectedSlot && selectedChamber && (
                    <div className="rounded-2xl border border-primary-teal/30 bg-primary-teal/5 dark:bg-primary-teal/10 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Consultation Fee</span>
                        <span className="font-semibold text-fg-app">
                          ৳{selectedChamber.consultationFee}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Platform Service Fee</span>
                        <span className="font-semibold text-emerald-500">FREE</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-card-border font-bold text-sm">
                        <span>Total Payable</span>
                        <span className="text-primary-teal text-base">
                          ৳{selectedChamber.consultationFee}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Actions */}
            {!bookingSuccess && (
              <div className="sticky bottom-0 bg-card border-t border-card-border p-4">
                <Button
                  variant="emerald"
                  disabled={!selectedSlot || !selectedChamber || isSubmitting}
                  onClick={handleConfirmBooking}
                  className="w-full justify-center h-12 text-sm shadow-md"
                >
                  {isSubmitting ? (
                    "Confirming..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Confirm Appointment <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
