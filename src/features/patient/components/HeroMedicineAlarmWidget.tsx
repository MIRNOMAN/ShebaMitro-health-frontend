"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Pill,
  CheckCircle2,
  Bell,
  Volume2,
  RotateCcw,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { playSoftChimeSound, stopChimeSound } from "../utils/chime";
import { ConfettiBurst } from "./ConfettiBurst";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { BengaliVoiceAudioPlayer } from "./BengaliVoiceAudioPlayer";
import {
  useGetRemindersQuery,
  useAcknowledgeReminderMutation,
  useSnoozeReminderMutation,
} from "@/redux/api/remindersApi";

export interface DosageItem {
  id: string;
  medicineName: string;
  dosageText: string;
  scheduledTime: string;
  period: "Morning" | "Afternoon" | "Evening" | "Night";
  instructions: string;
  status: "UPCOMING" | "DUE_NOW" | "TAKEN" | "SNOOZED" | "MISSED";
  snoozedUntil?: string;
  preferredLanguage?: "bn" | "en";
}

export function HeroMedicineAlarmWidget() {
  const { locale, setLocale } = useLanguage();
  const activeLanguage = locale === "en" ? "en" : locale === "hi" ? "hi" : "bn";

  // Dynamic reminders from backend
  const { data: remindersRes, isLoading: isLoadingReminders } = useGetRemindersQuery();
  const [acknowledgeReminder] = useAcknowledgeReminderMutation();
  const [snoozeReminder] = useSnoozeReminderMutation();

  const [activeAlarmDosage, setActiveAlarmDosage] = useState<DosageItem | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [, setIsChiming] = useState<boolean>(false);
  const [localStatuses, setLocalStatuses] = useState<Record<string, { status: DosageItem["status"]; snoozedUntil?: string }>>({});

  // Dynamic mapping of backend reminders to DosageItems
  const dosages: DosageItem[] = useMemo(() => {
    const rawList = remindersRes?.data?.reminders || [];
    if (!rawList || rawList.length === 0) return [];

    return rawList.map((r, idx) => {
      const intakeDate = new Date(r.intakeTime);
      const isValidDate = !isNaN(intakeDate.getTime());
      const scheduledTime = isValidDate
        ? intakeDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
        : `08:${30 + idx * 20} AM`;

      const hours = isValidDate ? intakeDate.getHours() : 8 + idx * 4;
      const period: DosageItem["period"] =
        hours < 12 ? "Morning" : hours < 17 ? "Afternoon" : hours < 20 ? "Evening" : "Night";

      // Meal timing description
      const rawMeal = r.prescriptionItem?.mealTiming || "AFTER_MEAL";
      const mealMap: Record<string, string> = {
        BEFORE_MEAL: "খাওয়ার ৩০ মিনিট আগে সেবন করুন (Take 30 mins before meal)",
        AFTER_MEAL: "খাওয়ার পর পানির সাথে সেবন করুন (Take after meal with water)",
        WITH_MEAL: "খাবারের সাথে সেবন করুন (Take with meal)",
        EMPTY_STOMACH: "খালি পেটে সেবন করুন (Take on empty stomach)",
      };
      const instructions = mealMap[rawMeal] || "খাওয়ার পর পানির সাথে সেবন করুন (Take after meal with water)";

      const pattern = r.prescriptionItem?.schedulePattern || "১টি ট্যাবলেট (1 Tablet)";
      const medicineName = r.prescriptionItem?.medicineName || "Prescribed Medicine";

      // Local override if user just clicked take or snooze
      const local = localStatuses[r.id];
      let status: DosageItem["status"] = r.status === "TAKEN" ? "TAKEN" : "UPCOMING";
      if (local) {
        status = local.status;
      } else if (r.status === "PENDING" && isValidDate) {
        const now = new Date();
        if (now.getHours() === intakeDate.getHours()) {
          status = "DUE_NOW";
        }
      }

      return {
        id: r.id,
        medicineName,
        dosageText: pattern,
        scheduledTime,
        period,
        instructions,
        status,
        snoozedUntil: local?.snoozedUntil,
        preferredLanguage: "bn",
      };
    });
  }, [remindersRes, localStatuses]);

  // Dynamic adherence calculation from backend
  const adherenceScore = useMemo(() => {
    if (remindersRes?.data?.complianceRate !== undefined) {
      return `${Math.round(remindersRes.data.complianceRate)}%`;
    }
    if (dosages.length === 0) return "100%";
    const takenCount = dosages.filter((d) => d.status === "TAKEN").length;
    return `${Math.round((takenCount / dosages.length) * 100)}%`;
  }, [remindersRes, dosages]);

  // Auto trigger DUE_NOW alarm modal on load if present
  useEffect(() => {
    const dueNow = dosages.find((d) => d.status === "DUE_NOW");
    if (dueNow && !activeAlarmDosage) {
      triggerAlarm(dueNow);
    }
  }, [dosages]);

  const triggerAlarm = (dosage: DosageItem) => {
    setActiveAlarmDosage(dosage);
    setIsChiming(false);
  };

  const handleTakeNow = async (id: string) => {
    stopChimeSound();
    setIsChiming(false);
    setActiveAlarmDosage(null);

    setLocalStatuses((prev) => ({
      ...prev,
      [id]: { status: "TAKEN" },
    }));

    try {
      await acknowledgeReminder({ id, status: "TAKEN" }).unwrap();
    } catch (err) {
      console.warn("Could not sync reminder status to backend:", err);
    }

    setShowConfetti(true);
  };

  const handleSnooze = async (id: string) => {
    stopChimeSound();
    setIsChiming(false);
    setActiveAlarmDosage(null);

    const snoozeText = activeLanguage === "bn" ? "১৫ মিনিটের মধ্যে" : "In 15 minutes";
    setLocalStatuses((prev) => ({
      ...prev,
      [id]: { status: "SNOOZED", snoozedUntil: snoozeText },
    }));

    try {
      await snoozeReminder({ id, minutes: 15 }).unwrap();
    } catch (err) {
      console.warn("Could not snooze reminder on backend:", err);
    }
  };

  const labels = {
    deckTitle:
      activeLanguage === "en"
        ? "Patient Medicine Alarm Deck"
        : activeLanguage === "hi"
        ? "मरीज़ दवा अलार्म डेक"
        : "পেশেন্ট মেডিসিন অ্যালার্ম ডেক",
    deckSub:
      activeLanguage === "en"
        ? "Multi-lingual Voice Audio Notes, adherence tracker & Web Audio chime"
        : activeLanguage === "hi"
        ? "बहुभाषी वॉयस ऑडियो नोट्स, अनुपालन ट्रैकर और स्मार्ट अलार्म"
        : "বাংলা ও বহুভাষী ভয়েস নোটস, অ্যাডহ্যারেন্স ট্র্যাকার ও স্মার্ট অ্যালার্ম",
    voiceLang:
      activeLanguage === "en" ? "Voice Language:" : activeLanguage === "hi" ? "आवाज भाषा:" : "ভয়েস ভাষা:",
    testAlarm:
      activeLanguage === "en" ? "Test Alarm Voice Note" : activeLanguage === "hi" ? "अलार्म आवाज टेस्ट" : "টেস্ট অ্যালার্ম ভয়েস",
    adherenceTitle:
      activeLanguage === "en" ? "Weekly Adherence Score" : activeLanguage === "hi" ? "साप्ताहिक स्कोर" : "সাপ্তাহিক অ্যাডহ্যারেন্স স্কোর",
    todaySchedule:
      activeLanguage === "en" ? "Today's Dosage Schedule" : activeLanguage === "hi" ? "आज की दवा अनुसूची" : "আজকের ডোজ শিডিউল",
    dueBadge:
      activeLanguage === "en" ? "Medicine Alarm Due Now" : activeLanguage === "hi" ? "दवा का समय (अभी लें)" : "মেডিসিন অ্যালার্ম (এখনই সেবন করুন)",
    dosagePrefix:
      activeLanguage === "en" ? "Dosage:" : activeLanguage === "hi" ? "खुराक:" : "মাত্রাসমূহ (Dosage):",
    takeNow:
      activeLanguage === "en" ? "Take Now" : activeLanguage === "hi" ? "अभी लें" : "এখনই সেবন করুন",
    snooze:
      activeLanguage === "en" ? "Snooze 15m" : activeLanguage === "hi" ? "15 मिनट स्नूज़" : "১৫ মিনিট স্নুজ",
    takenBadge:
      activeLanguage === "en" ? "Taken" : activeLanguage === "hi" ? "ले लिया" : "সেবন সম্পন্ন",
    upcomingBadge:
      activeLanguage === "en" ? "Upcoming" : activeLanguage === "hi" ? "आगामी" : "আসন্ন ডোজ",
  };

  return (
    <div className="rounded-3xl border border-surface-border bg-surface-card p-4 sm:p-7 space-y-6 shadow-sm relative overflow-hidden">
      {/* Confetti celebration canvas when TAKEN */}
      {showConfetti && <ConfettiBurst onComplete={() => setShowConfetti(false)} />}

      {/* Top Ambient Glow */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-black text-base sm:text-lg text-fg-app tracking-tight">{labels.deckTitle}</h2>
            <p className="text-xs text-muted-fg">{labels.deckSub}</p>
          </div>
        </div>

        {/* Voice Language Preference & Test Alarm Ring Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Synchronized Global Voice Language Toggle */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-border bg-muted-bg/50 text-xs font-bold">
            <span className="text-muted-fg text-[10px] uppercase">{labels.voiceLang}</span>
            <button
              type="button"
              onClick={() => setLocale("bn")}
              className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLanguage === "bn"
                  ? "bg-primary-teal text-white shadow-xs"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              🇧🇩 বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeLanguage === "en"
                  ? "bg-primary-teal text-white shadow-xs"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              🇺🇸 EN
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const dueOrFirst = dosages.find((d) => d.status === "DUE_NOW") || dosages[0] || {
                id: "demo",
                medicineName: "Napa 500mg",
                dosageText: "1 Tablet",
                scheduledTime: "Now",
                period: "Morning",
                instructions: "Take with water",
                status: "DUE_NOW",
              };
              triggerAlarm(dueOrFirst);
            }}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
          >
            <Volume2 className="h-3.5 w-3.5 mr-1" /> {labels.testAlarm}
          </Button>
        </div>
      </div>

      {/* Weekly Adherence Progress Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-surface-border bg-muted-bg/30 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-fg-app flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-accent" /> {labels.adherenceTitle}
          </span>
          <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
            {adherenceScore} {parseInt(adherenceScore) >= 80 ? "Excellent" : "Good"}
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-2.5 w-full bg-muted-bg rounded-full overflow-hidden border border-surface-border/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-accent to-primary-teal rounded-full transition-all duration-700"
            style={{ width: adherenceScore }}
          />
        </div>

        {/* 7-Day Adherence Dot Ribbon */}
        <div className="flex justify-between items-center text-[11px] font-semibold text-muted-fg pt-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <span>{day}</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-accent shadow-xs" />
            </div>
          ))}
        </div>
      </div>

      {/* Today's Dosages List */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
          {labels.todaySchedule}
        </label>

        {isLoadingReminders ? (
          <div className="p-6 text-center text-muted-fg space-y-2">
            <Loader2 className="w-5 h-5 text-primary-teal animate-spin mx-auto" />
            <p className="text-xs font-bold">Loading today&apos;s medication schedule from database...</p>
          </div>
        ) : dosages.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-surface-border bg-muted-bg/20 text-center space-y-2">
            <Pill className="h-8 w-8 text-primary-teal/40 mx-auto" />
            <p className="text-sm font-bold text-fg-app">No active medicine alarms scheduled for today</p>
            <p className="text-xs text-muted-fg max-w-sm mx-auto">
              Your prescription medications and reminder alarms will appear here dynamically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {dosages.map((dosage) => {
              const isDue = dosage.status === "DUE_NOW";
              const isTaken = dosage.status === "TAKEN";
              const isSnoozed = dosage.status === "SNOOZED";

              return (
                <div
                  key={dosage.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDue
                      ? "bg-amber-500/5 border-amber-500/40 ring-1 ring-amber-500/30 shadow-sm"
                      : isTaken
                      ? "bg-emerald-500/5 border-emerald-500/20 text-muted-fg opacity-85"
                      : isSnoozed
                      ? "bg-violet-500/5 border-violet-500/30"
                      : "bg-surface-card border-surface-border hover:bg-surface-card-hover"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isDue
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse"
                          : isTaken
                          ? "bg-emerald-accent/15 text-emerald-600 dark:text-emerald-400 border border-emerald-accent/20"
                          : "bg-primary-teal/10 text-primary-teal border border-primary-teal/20"
                      }`}
                    >
                      <Pill className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-sm text-fg-app">{dosage.medicineName}</h4>
                        <span className="text-xs font-medium text-muted-fg">
                          ({dosage.dosageText})
                        </span>
                      </div>

                      <p className="text-xs text-muted-fg">
                        {dosage.instructions} • <span className="font-bold text-fg-app/80">{dosage.scheduledTime}</span>
                      </p>

                      {isSnoozed && dosage.snoozedUntil && (
                        <p className="text-[11px] font-bold text-violet-500 pt-0.5">
                          Snoozed: {dosage.snoozedUntil}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badges & Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {isTaken ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-accent/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-accent/20">
                        <CheckCircle2 className="h-4 w-4" /> {labels.takenBadge}
                      </span>
                    ) : isDue ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTakeNow(dosage.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-accent to-primary-teal text-white text-xs font-bold shadow-sm hover:brightness-105 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> {labels.takeNow}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSnooze(dosage.id)}
                          className="px-3 py-1.5 rounded-xl bg-muted-bg text-fg-app hover:bg-surface-card-hover border border-surface-border text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-violet-500" /> {labels.snooze}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTakeNow(dosage.id)}
                        className="text-xs font-bold text-primary-teal hover:text-white bg-primary-teal/10 hover:bg-primary-teal px-3 py-1.5 rounded-xl border border-primary-teal/20 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Taken
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alarm Triggered Modal Popup with Accessible Multilingual Audio Voice Player */}
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
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-center space-y-5 overflow-hidden ring-1 ring-white/10"
            >
              {/* Header Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/10 blur-2xl pointer-events-none" />

              {/* Pill Icon with Elegant Ring */}
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-lg ring-4 ring-amber-500/10">
                <Pill className="h-8 w-8 animate-pulse" />
              </div>

              {/* Title & Instructions */}
              <div className="space-y-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-xs font-black uppercase tracking-wider">
                    <Bell className="h-3.5 w-3.5" /> {labels.dueBadge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight pt-1">
                  {activeAlarmDosage.medicineName}
                </h3>

                <p className="text-sm font-bold text-primary-teal">
                  {labels.dosagePrefix} <span className="font-extrabold">{activeAlarmDosage.dosageText}</span>
                </p>
              </div>

              {/* Accessible Multilingual Audio Voice Player Component */}
              <BengaliVoiceAudioPlayer
                medicineName={activeAlarmDosage.medicineName}
                dosageText={activeAlarmDosage.dosageText}
                instructions={activeAlarmDosage.instructions}
                language={activeLanguage}
                autoPlay={true}
              />

              {/* Modal Buttons: Take Now & Snooze 15m */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSnooze(activeAlarmDosage.id)}
                  className="h-12 rounded-xl font-bold text-xs sm:text-sm bg-muted-bg text-fg-app hover:bg-surface-card-hover border border-surface-border transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-purple-500" />
                  <span>{labels.snooze}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTakeNow(activeAlarmDosage.id)}
                  className="h-12 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-accent to-primary-teal text-white shadow-lg shadow-emerald-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{labels.takeNow}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
