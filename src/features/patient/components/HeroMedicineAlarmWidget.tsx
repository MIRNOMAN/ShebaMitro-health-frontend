"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Pill,
  CheckCircle2,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { playSoftChimeSound, stopChimeSound } from "../utils/chime";
import { ConfettiBurst } from "./ConfettiBurst";
import { Button } from "@/components/ui/button";

export interface DosageItem {
  id: string;
  medicineName: string;
  dosageText: string;
  scheduledTime: string;
  period: "Morning" | "Afternoon" | "Evening" | "Night";
  instructions: string;
  status: "UPCOMING" | "DUE_NOW" | "TAKEN" | "SNOOZED" | "MISSED";
  snoozedUntil?: string;
}

const INITIAL_DOSAGES: DosageItem[] = [
  {
    id: "dose-1",
    medicineName: "Napa Extra 500mg",
    dosageText: "1 Tablet",
    scheduledTime: "08:30 AM",
    period: "Morning",
    instructions: "Take after meal with water",
    status: "TAKEN",
  },
  {
    id: "dose-2",
    medicineName: "Seclo 20mg",
    dosageText: "1 Capsule",
    scheduledTime: "01:30 PM",
    period: "Afternoon",
    instructions: "Take 30 mins before meal",
    status: "DUE_NOW",
  },
  {
    id: "dose-3",
    medicineName: "Montene 10mg",
    dosageText: "1 Tablet",
    scheduledTime: "09:00 PM",
    period: "Night",
    instructions: "Take before bedtime",
    status: "UPCOMING",
  },
];

export function HeroMedicineAlarmWidget() {
  const [dosages, setDosages] = useState<DosageItem[]>(INITIAL_DOSAGES);
  const [activeAlarmDosage, setActiveAlarmDosage] = useState<DosageItem | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isChiming, setIsChiming] = useState<boolean>(false);

  // Auto trigger DUE_NOW alarm modal on load
  useEffect(() => {
    const dueNow = dosages.find((d) => d.status === "DUE_NOW");
    if (dueNow) {
      triggerAlarm(dueNow);
    }
  }, []);

  const triggerAlarm = (dosage: DosageItem) => {
    setActiveAlarmDosage(dosage);
    setIsChiming(true);
    playSoftChimeSound();
  };

  const handleTakeNow = (id: string) => {
    stopChimeSound();
    setIsChiming(false);
    setActiveAlarmDosage(null);

    // Update status to TAKEN
    setDosages((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "TAKEN" } : d))
    );

    // Trigger Confetti Burst
    setShowConfetti(true);
  };

  const handleSnooze = (id: string) => {
    stopChimeSound();
    setIsChiming(false);
    setActiveAlarmDosage(null);

    // Update status to SNOOZED
    setDosages((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "SNOOZED",
              snoozedUntil: "In 15 minutes (01:45 PM)",
            }
          : d
      )
    );
  };

  // Calculate adherence rate
  const totalCount = dosages.length;
  const takenCount = dosages.filter((d) => d.status === "TAKEN").length;
  const adherencePercent = Math.round((takenCount / totalCount) * 100);

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 space-y-6 shadow-md relative overflow-hidden">
      {/* Confetti celebration canvas when TAKEN */}
      {showConfetti && <ConfettiBurst onComplete={() => setShowConfetti(false)} />}

      {/* Top Ambient Glow */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-card-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-fg-app">Hero Medicine Alarm Widget</h2>
            <p className="text-xs text-muted-foreground">
              Today's dosage schedule, Web Audio API chime, and weekly adherence progress
            </p>
          </div>
        </div>

        {/* Manual Test Sound Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const dueOrFirst = dosages.find((d) => d.status === "DUE_NOW") || dosages[1]!;
            triggerAlarm(dueOrFirst);
          }}
          className="text-xs font-semibold text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
        >
          <Volume2 className="h-3.5 w-3.5 mr-1" /> Test Alarm Ring
        </Button>
      </div>

      {/* Weekly Adherence Progress Bar */}
      <div className="p-4 rounded-xl border border-card-border bg-surface-card-hover/50 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-fg-app flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-500" /> Weekly Adherence Score
          </span>
          <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
            92% Excellent
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-primary-teal rounded-full transition-all duration-700"
            style={{ width: "92%" }}
          />
        </div>

        {/* 7-Day Adherence Dot Ribbon */}
        <div className="flex justify-between items-center text-[11px] font-semibold text-muted-foreground pt-1">
          {[
            { day: "Mon", rate: "100%" },
            { day: "Tue", rate: "100%" },
            { day: "Wed", rate: "100%" },
            { day: "Thu", rate: "100%" },
            { day: "Fri", rate: "80%" },
            { day: "Sat", rate: "100%" },
            { day: "Sun", rate: "100%" },
          ].map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1">
              <span>{d.day}</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" />
            </div>
          ))}
        </div>
      </div>

      {/* Today's Dosages List */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Today's Dosage Schedule
        </label>

        <div className="grid grid-cols-1 gap-3">
          {dosages.map((dosage) => {
            const isDue = dosage.status === "DUE_NOW";
            const isTaken = dosage.status === "TAKEN";
            const isSnoozed = dosage.status === "SNOOZED";

            return (
              <div
                key={dosage.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDue
                    ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-md"
                    : isTaken
                    ? "bg-emerald-500/5 border-emerald-500/30 text-muted-foreground"
                    : isSnoozed
                    ? "bg-purple-500/10 border-purple-500/40"
                    : "bg-surface-card-hover/40 border-card-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isDue
                        ? "bg-amber-500 text-slate-950 animate-bounce"
                        : isTaken
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-primary-teal/10 text-primary-teal"
                    }`}
                  >
                    <Pill className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-fg-app">{dosage.medicineName}</h4>
                      <span className="text-xs font-medium text-muted-foreground">
                        ({dosage.dosageText})
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {dosage.instructions} • <span className="font-semibold">{dosage.scheduledTime}</span>
                    </p>

                    {isSnoozed && dosage.snoozedUntil && (
                      <p className="text-[11px] font-bold text-purple-500 pt-0.5">
                        Snoozed: {dosage.snoozedUntil}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badges & Quick Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {isTaken ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                      <CheckCircle2 className="h-4 w-4" /> Taken
                    </span>
                  ) : isDue ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => handleTakeNow(dosage.id)}
                        className="text-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Take Now
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSnooze(dosage.id)}
                        className="text-xs text-purple-500 border-purple-500/30"
                      >
                        Snooze 15m
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground bg-card px-2.5 py-1 rounded-lg border border-card-border">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alarm Triggered Modal Popup with Looping Visual Pulse */}
      <AnimatePresence>
        {activeAlarmDosage && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                stopChimeSound();
                setIsChiming(false);
                setActiveAlarmDosage(null);
              }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-md bg-card border-2 border-amber-500 rounded-3xl p-6 shadow-2xl z-10 text-center space-y-6 overflow-hidden"
            >
              {/* Looping Radial Pulse Animation Rings */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-emerald-500/20 animate-pulse" />

                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-xl ring-4 ring-amber-500/40">
                  <Pill className="h-8 w-8 animate-bounce" />
                </div>
              </div>

              {/* Title & Instructions */}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
                  <Bell className="h-3.5 w-3.5" /> MEDICINE ALARM DUE NOW
                </span>

                <h3 className="text-2xl font-extrabold text-fg-app">
                  {activeAlarmDosage.medicineName}
                </h3>

                <p className="text-sm font-semibold text-primary-teal">
                  Dosage: {activeAlarmDosage.dosageText}
                </p>

                <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-card-border">
                  {activeAlarmDosage.instructions}
                </p>
              </div>

              {/* Web Audio Chime Playing Status */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-500">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span>Web Audio Soft Chime Ringing...</span>
              </div>

              {/* Modal Buttons: Take Now & Snooze 15m */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSnooze(activeAlarmDosage.id)}
                  className="h-12 text-xs font-bold text-purple-500 border-purple-500/40 hover:bg-purple-500/10"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Snooze 15m
                </Button>

                <Button
                  variant="emerald"
                  size="lg"
                  onClick={() => handleTakeNow(activeAlarmDosage.id)}
                  className="h-12 text-xs font-bold shadow-lg"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Take Now
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
