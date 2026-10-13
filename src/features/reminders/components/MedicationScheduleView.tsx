"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import {
  useGetRemindersQuery,
  useCreateReminderMutation,
  useAcknowledgeReminderMutation,
  useSnoozeReminderMutation,
  useDeleteReminderMutation,
  type MedicineReminderData,
  type MealTiming,
} from "@/redux/api/remindersApi";
import {
  Bell,
  Clock,
  Pill,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  HeartPulse,
  Activity,
  X,
  RotateCcw,
  Check,
} from "lucide-react";

const POPULAR_MEDICINES = [
  { name: "Seclo 20mg", generic: "Omeprazole", form: "Capsule", timing: "BEFORE_MEAL" as MealTiming },
  { name: "Cefuroxime 500mg", generic: "Cefuroxime Axetil", form: "Tablet", timing: "AFTER_MEAL" as MealTiming },
  { name: "Napa Extra 500mg", generic: "Paracetamol + Caffeine", form: "Tablet", timing: "AFTER_MEAL" as MealTiming },
  { name: "Amlodin 5mg", generic: "Amlodipine", form: "Tablet", timing: "AFTER_MEAL" as MealTiming },
  { name: "Montene 10mg", generic: "Montelukast", form: "Tablet", timing: "AFTER_MEAL" as MealTiming },
  { name: "Azithromycin 500mg", generic: "Azithromycin", form: "Tablet", timing: "BEFORE_MEAL" as MealTiming },
];

export function MedicationScheduleView() {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  // RTK Query hooks
  const { data: remindersResponse, isLoading, isFetching } = useGetRemindersQuery(undefined, {
    pollingInterval: 20000,
  });

  const [createReminder, { isLoading: isCreating }] = useCreateReminderMutation();
  const [acknowledgeReminder, { isLoading: isAcknowledging }] = useAcknowledgeReminderMutation();
  const [snoozeReminder, { isLoading: isSnoozing }] = useSnoozeReminderMutation();
  const [deleteReminder, { isLoading: isDeleting }] = useDeleteReminderMutation();

  const remindersData = remindersResponse?.data;
  const reminders = remindersData?.reminders || [];
  const complianceRate = remindersData?.complianceRate ?? 100;
  const summary = remindersData?.summary || { total: 0, taken: 0, pending: 0, skipped: 0 };

  // Filter state
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | "PENDING" | "TAKEN">("ALL");

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  // Form states
  const [medicineName, setMedicineName] = React.useState("");
  const [genericName, setGenericName] = React.useState("");
  const [dosageForm, setDosageForm] = React.useState("Tablet");
  const [schedulePattern, setSchedulePattern] = React.useState("1+0+1");
  const [mealTiming, setMealTiming] = React.useState<MealTiming>("AFTER_MEAL");
  const [intakeTime, setIntakeTime] = React.useState("09:00");
  const [durationDays, setDurationDays] = React.useState(7);
  const [notes, setNotes] = React.useState("");

  // Live clock
  const [currentTime, setCurrentTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(isBn ? "bn-BD" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isBn]);

  // Flash feedback toast
  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Quick preset selector
  const handleSelectPreset = (item: (typeof POPULAR_MEDICINES)[0]) => {
    setMedicineName(item.name);
    setGenericName(item.generic);
    setDosageForm(item.form);
    setMealTiming(item.timing);
  };

  // Form submit handler
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    try {
      // Build ISO intake date from selected time
      const today = new Date();
      const [hours, minutes] = intakeTime.split(":").map(Number);
      today.setHours(hours || 9, minutes || 0, 0, 0);

      await createReminder({
        medicineName: medicineName.trim(),
        genericName: genericName.trim() || undefined,
        dosageForm,
        schedulePattern,
        mealTiming,
        durationDays: Number(durationDays) || 7,
        intakeTime: today.toISOString(),
        notes: notes.trim() || undefined,
      }).unwrap();

      showToast(isBn ? "নতুন ওষুধের সময়সূচী সফলভাবে যুক্ত করা হয়েছে!" : "Medication schedule added successfully!");
      setIsModalOpen(false);
      // Reset form
      setMedicineName("");
      setGenericName("");
      setNotes("");
    } catch (err: any) {
      showToast(err?.data?.message || (isBn ? "সময়সূচী যোগ করতে ব্যর্থ হয়েছে" : "Failed to add medication schedule"));
    }
  };

  // Action handlers
  const handleTakeDose = async (id: string, name: string) => {
    try {
      await acknowledgeReminder({ id, status: "TAKEN" }).unwrap();
      showToast(isBn ? `${name} গ্রহণের রেকর্ড সম্পন্ন হয়েছে!` : `${name} marked as taken!`);
    } catch (err: any) {
      showToast(isBn ? "স্ট্যাটাস আপডেট ব্যর্থ হয়েছে" : "Failed to update status");
    }
  };

  const handleSnooze = async (id: string, name: string) => {
    try {
      await snoozeReminder({ id, minutes: 15 }).unwrap();
      showToast(isBn ? `${name} এর অ্যালার্ম ১৫ মিনিট পিছিয়ে দেওয়া হয়েছে!` : `${name} alarm snoozed by 15 mins!`);
    } catch (err: any) {
      showToast(isBn ? "অ্যালার্ম পেছানো ব্যর্থ হয়েছে" : "Failed to snooze alarm");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteReminder(id).unwrap();
      showToast(isBn ? `${name} সময়সূচী মুছে ফেলা হয়েছে!` : `${name} schedule removed!`);
    } catch (err: any) {
      showToast(isBn ? "মুছে ফেলা ব্যর্থ হয়েছে" : "Failed to delete schedule");
    }
  };

  // Filtered schedules
  const filteredReminders = React.useMemo(() => {
    if (activeFilter === "ALL") return reminders;
    return reminders.filter((r) => r.status === activeFilter);
  }, [reminders, activeFilter]);

  // Next upcoming pending dose
  const nextUpcoming = React.useMemo(() => {
    return reminders.find((r) => r.status === "PENDING");
  }, [reminders]);

  const toBnDigits = (val: string | number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(val).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)] ?? d);
  };

  const formatTimeStr = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return d.toLocaleTimeString(isBn ? "bn-BD" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoDate;
    }
  };

  const getMealTimingLabel = (timing: MealTiming) => {
    switch (timing) {
      case "BEFORE_MEAL":
        return isBn ? "খাবারের পূর্বে" : "Before Meal";
      case "AFTER_MEAL":
        return isBn ? "খাবারের পরে" : "After Meal";
      case "WITH_MEAL":
        return isBn ? "খাবারের সাথে" : "With Meal";
      case "EMPTY_STOMACH":
        return isBn ? "খালি পেটে" : "Empty Stomach";
      default:
        return timing;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-surface-card/95 border border-primary-teal/40 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold text-fg-app luminous-border"
          >
            <Sparkles className="w-5 h-5 text-emerald-accent animate-pulse shrink-0" />
            <span>{feedbackMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Breadcrumb & Live Clock Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-fg">
            <Link href="/" className="hover:text-primary-teal transition-colors">
              {isBn ? "হোম" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary-teal">{isBn ? "স্মার্ট মেডিসিন রিমাইন্ডার" : "Medication Schedule"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-fg-app flex items-center gap-3">
            <span>{isBn ? "স্মার্ট মেডিসিন অ্যালার্ম ও শিডিউল" : "Smart Medicine Alarms & Dose Schedule"}</span>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-accent"></span>
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-fg max-w-2xl">
            {isBn
              ? "অটোমেটেড এআই পুশ নোটিফিকেশন, হোয়াটসঅ্যাপ অ্যালার্ট এবং সময়মতো সঠিক ওষুধ সেবনের নির্ভুল ট্র্যাকার।"
              : "Automated AI notifications, audio voice alarms, and precision dosage tracking to keep your health on track."}
          </p>
        </div>

        {/* Live Clock & Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-4 py-2 rounded-2xl bg-surface-card border border-surface-border flex items-center gap-2.5 shadow-xs">
            <Clock className="w-4 h-4 text-coral-accent animate-pulse" />
            <span className="text-xs font-mono font-black text-fg-app">{currentTime || "09:00:00 AM"}</span>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="md"
            className="flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-primary-teal/20"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? "নতুন শিডিউল যোগ করুন" : "Add Medication Schedule"}</span>
          </Button>
        </div>
      </div>

      {/* 4 Dynamic Live Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlowCard className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">{isBn ? "মোট সক্রিয় ওষুধ" : "Total Active Prescriptions"}</span>
            <div className="w-10 h-10 rounded-xl bg-primary-teal/15 text-primary-teal flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-fg-app font-mono">
            {isBn ? toBnDigits(summary.total) : summary.total}
          </div>
          <p className="text-[11px] text-muted-fg font-medium">
            {isBn ? "চলতি প্রেসক্রিপশনের সক্রিয় তালিকা" : "Active schedules in tracker"}
          </p>
        </GlowCard>

        <GlowCard className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">{isBn ? "আজকের গ্রহণকৃত ডোজ" : "Doses Taken on Time"}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-accent/15 text-emerald-accent flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-accent font-mono">
            {isBn ? toBnDigits(summary.taken) : summary.taken}
          </div>
          <p className="text-[11px] text-muted-fg font-medium">
            {isBn ? "সফলভাবে গৃহীত হয়েছে" : "Acknowledged successfully"}
          </p>
        </GlowCard>

        <GlowCard className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">{isBn ? "আসন্ন ডোজ" : "Upcoming Doses"}</span>
            <div className="w-10 h-10 rounded-xl bg-coral-accent/15 text-coral-accent flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-coral-accent font-mono">
            {isBn ? toBnDigits(summary.pending) : summary.pending}
          </div>
          <p className="text-[11px] text-muted-fg font-medium">
            {isBn ? "অপেক্ষমান অ্যালার্ম" : "Pending alarm triggers"}
          </p>
        </GlowCard>

        <GlowCard className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-fg">{isBn ? "ওষুধ সেবনের ধারাবাহিকতা" : "Adherence Score"}</span>
            <div className="w-10 h-10 rounded-xl bg-violet-accent/15 text-violet-accent flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-violet-accent font-mono">
            {isBn ? toBnDigits(complianceRate) : complianceRate}%
          </div>
          <div className="w-full bg-surface-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-teal to-emerald-accent h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, complianceRate))}%` }}
            />
          </div>
        </GlowCard>
      </div>

      {/* Next Upcoming Dose Alert Card (If pending exists) */}
      {nextUpcoming && (
        <div className="relative overflow-hidden rounded-3xl border border-primary-teal/40 bg-gradient-to-r from-primary-teal/10 via-surface-card to-emerald-accent/10 p-6 sm:p-8 luminous-border shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-coral-accent to-violet-accent text-white flex items-center justify-center shadow-lg shrink-0">
                <Bell className="w-7 h-7 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-coral-accent/20 text-coral-accent text-xs font-black uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isBn ? "আসন্ন পরবর্তী ডোজ" : "Next Upcoming Dose"}</span>
                </div>
                <h3 className="text-2xl font-black text-fg-app tracking-tight">
                  {nextUpcoming.prescriptionItem?.medicineName}
                </h3>
                <p className="text-xs text-muted-fg flex items-center gap-2">
                  <span>{getMealTimingLabel(nextUpcoming.prescriptionItem?.mealTiming)}</span>
                  <span>•</span>
                  <span>{nextUpcoming.prescriptionItem?.dosageForm || "Tablet"}</span>
                  <span>•</span>
                  <span className="font-bold text-fg-app">{formatTimeStr(nextUpcoming.intakeTime)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={() => handleSnooze(nextUpcoming.id, nextUpcoming.prescriptionItem?.medicineName)}
                disabled={isSnoozing}
                variant="outline"
                size="md"
                className="flex-1 md:flex-none flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-violet-accent" />
                <span>{isBn ? "১৫ মিনিট পেছান" : "Snooze 15m"}</span>
              </Button>
              <Button
                onClick={() => handleTakeDose(nextUpcoming.id, nextUpcoming.prescriptionItem?.medicineName)}
                disabled={isAcknowledging}
                variant="primary"
                size="md"
                className="flex-1 md:flex-none flex items-center gap-2 cursor-pointer bg-gradient-to-r from-primary-teal to-emerald-accent shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>{isBn ? "এখনই গ্রহণ করুন" : "Take Dose Now"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedules Section Header & Filter Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-primary-teal" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-fg-app">
              {isBn ? "সকল ওষুধের শিডিউল তালিকা" : "All Medication Schedules"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-border text-xs font-mono font-bold text-muted-fg">
              {filteredReminders.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex rounded-xl bg-surface-card p-1 border border-surface-border text-xs font-bold">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === "ALL"
                  ? "bg-primary-teal text-white shadow-xs font-black"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              {isBn ? "সকল শিডিউল" : "All Schedules"}
            </button>
            <button
              onClick={() => setActiveFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === "PENDING"
                  ? "bg-coral-accent text-white shadow-xs font-black"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              {isBn ? `অপেক্ষমান (${summary.pending})` : `Pending (${summary.pending})`}
            </button>
            <button
              onClick={() => setActiveFilter("TAKEN")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === "TAKEN"
                  ? "bg-emerald-accent text-white shadow-xs font-black"
                  : "text-muted-fg hover:text-fg-app"
              }`}
            >
              {isBn ? `সম্পন্ন (${summary.taken})` : `Taken (${summary.taken})`}
            </button>
          </div>
        </div>

        {/* Schedules Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-3xl bg-surface-card animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-surface-border bg-surface-card/40 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-primary-teal/10 text-primary-teal flex items-center justify-center">
              <Pill className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-fg-app">
              {isBn ? "কোনো ওষুধের শিডিউল পাওয়া যায়নি" : "No Medication Schedules Found"}
            </h3>
            <p className="text-xs text-muted-fg max-w-md mx-auto">
              {isBn
                ? "নতুন কোনো ওষুধ যোগ করতে উপরের 'নতুন শিডিউল যোগ করুন' বাটনে ক্লিক করুন।"
                : "Add your doctor-prescribed medicine alarms to receive smart notifications."}
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              size="sm"
              className="mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>{isBn ? "নতুন শিডিউল তৈরি করুন" : "Create Schedule Now"}</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReminders.map((reminder) => {
              const isTaken = reminder.status === "TAKEN";
              const isPending = reminder.status === "PENDING";
              const med = reminder.prescriptionItem;

              return (
                <GlowCard key={reminder.id} className="p-6 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Top status bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isTaken
                              ? "bg-emerald-accent/15 text-emerald-accent"
                              : "bg-primary-teal/15 text-primary-teal"
                          }`}
                        >
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-muted-fg">
                            {med?.dosageForm || "Tablet"}
                          </span>
                          <h4 className="text-base font-extrabold text-fg-app leading-tight">
                            {med?.medicineName}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                          isTaken
                            ? "bg-emerald-accent/20 text-emerald-accent border border-emerald-accent/40"
                            : "bg-coral-accent/20 text-coral-accent border border-coral-accent/40"
                        }`}
                      >
                        {isTaken ? (isBn ? "গ্রহণ সম্পন্ন" : "TAKEN") : (isBn ? "অপেক্ষমান" : "PENDING")}
                      </span>
                    </div>

                    {/* Generic & Instruction details */}
                    <div className="p-3 rounded-xl bg-surface-card border border-surface-border space-y-2 text-xs">
                      {med?.genericName && (
                        <div className="text-[11px] text-muted-fg font-medium">
                          {isBn ? "জেনেরিক:" : "Generic:"}{" "}
                          <span className="font-bold text-fg-app">{med.genericName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-fg">{isBn ? "সেবন নিয়ম:" : "Instruction:"}</span>
                        <span className="font-bold text-primary-teal">{getMealTimingLabel(med?.mealTiming)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-fg">{isBn ? "প্যাটার্ন:" : "Pattern:"}</span>
                        <span className="font-bold text-fg-app">{med?.schedulePattern || "1+0+1"}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-surface-border">
                        <span className="text-muted-fg flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-coral-accent" />
                          {isBn ? "নির্ধারিত সময়:" : "Scheduled Time:"}
                        </span>
                        <span className="font-mono font-black text-fg-app">{formatTimeStr(reminder.intakeTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-2 border-t border-surface-border">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleTakeDose(reminder.id, med?.medicineName)}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isBn ? "গ্রহণ করুন" : "Take Dose"}</span>
                        </button>
                        <button
                          onClick={() => handleSnooze(reminder.id, med?.medicineName)}
                          className="p-2 rounded-xl border border-surface-border text-muted-fg hover:text-fg-app hover:bg-surface-card transition-all cursor-pointer"
                          title={isBn ? "১৫ মিনিট পেছান" : "Snooze 15m"}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center gap-2 text-xs font-bold text-emerald-accent py-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isBn ? "ডোজ গ্রহণ সম্পন্ন হয়েছে" : "Completed on schedule"}</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(reminder.id, med?.medicineName)}
                      className="p-2 rounded-xl border border-surface-border text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title={isBn ? "মুছে ফেলুন" : "Delete Schedule"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Interactive Modal: Add Medication Schedule ─────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-2xl luminous-border space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-surface-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-teal to-emerald-accent text-white flex items-center justify-center shadow-md">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-fg-app">
                      {isBn ? "নতুন ওষুধের সময়সূচী যোগ করুন" : "Add Medication Schedule"}
                    </h3>
                    <p className="text-xs text-muted-fg">
                      {isBn ? "ডাক্তারের প্রেসক্রিপশন অনুযায়ী স্মার্ট অ্যালার্ম সেট করুন" : "Configure precision dose timing and reminders"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-muted-fg hover:text-fg-app hover:bg-surface-border/50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Preset Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-fg">
                  {isBn ? "জনপ্রিয় ওষুধ নির্বাচন (কুইক সিলেক্ট):" : "Quick Presets:"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_MEDICINES.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelectPreset(item)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        medicineName === item.name
                          ? "bg-primary-teal text-white border-primary-teal font-bold shadow-xs"
                          : "bg-surface-card border-surface-border text-muted-fg hover:text-fg-app hover:border-primary-teal/40"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-fg-app">
                      {isBn ? "ওষুধের নাম *" : "Medicine Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      placeholder="e.g. Cefuroxime 500mg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-fg-app">
                      {isBn ? "জেনেরিক নাম (ঐচ্ছিক)" : "Generic Name"}
                    </label>
                    <input
                      type="text"
                      value={genericName}
                      onChange={(e) => setGenericName(e.target.value)}
                      placeholder="e.g. Cefuroxime Axetil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-fg-app">
                      {isBn ? "ডোজ ফরম" : "Dosage Form"}
                    </label>
                    <select
                      value={dosageForm}
                      onChange={(e) => setDosageForm(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
                    >
                      <option value="Tablet">Tablet (ট্যাবলেট)</option>
                      <option value="Capsule">Capsule (ক্যাপসুল)</option>
                      <option value="Syrup">Syrup (সিরাপ)</option>
                      <option value="Eye Drops">Drops (ড্রপ)</option>
                      <option value="Inhaler">Inhaler (ইনহেলার)</option>
                      <option value="Injection">Injection (ইনজেকশন)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-fg-app">
                      {isBn ? "খাবারের সময়" : "Meal Timing"}
                    </label>
                    <select
                      value={mealTiming}
                      onChange={(e) => setMealTiming(e.target.value as MealTiming)}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
                    >
                      <option value="AFTER_MEAL">After Meal (খাবারের পরে)</option>
                      <option value="BEFORE_MEAL">Before Meal (খাবারের পূর্বে)</option>
                      <option value="WITH_MEAL">With Meal (খাবারের সাথে)</option>
                      <option value="EMPTY_STOMACH">Empty Stomach (খালি পেটে)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-fg-app">
                      {isBn ? "শিডিউল প্যাটার্ন" : "Schedule Pattern"}
                    </label>
                    <select
                      value={schedulePattern}
                      onChange={(e) => setSchedulePattern(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
                    >
                      <option value="1+0+1">1+0+1 (সকাল ও রাত)</option>
                      <option value="1+0+0">1+0+0 (শুধু সকাল)</option>
                      <option value="0+0+1">0+0+1 (শুধু রাত)</option>
                      <option value="1+1+1">1+1+1 (দিনে ৩ বার)</option>
                      <option value="0+1+0">0+1+0 (শুধু দুপুর)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-fg-app flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-coral-accent" />
                      <span>{isBn ? "অ্যালার্মের সময়" : "Alarm Intake Time"}</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={intakeTime}
                      onChange={(e) => setIntakeTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-fg-app flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary-teal" />
                      <span>{isBn ? "কোর্স মেয়াদ (দিন)" : "Duration (Days)"}</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal"
                    />
                  </div>
                </div>

                {/* Notifications Channels Enabled */}
                <div className="p-3.5 rounded-2xl bg-surface-card border border-surface-border space-y-2">
                  <span className="text-xs font-bold text-muted-fg">
                    {isBn ? "সক্রিয় নোটিফিকেশন চ্যানেলসমূহ:" : "Active Alert Channels:"}
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-accent font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Web Push Alert
                    </span>
                    <span className="flex items-center gap-1 text-emerald-accent font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Audio Voice Engine
                    </span>
                    <span className="flex items-center gap-1 text-emerald-accent font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> WhatsApp SMS
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-fg-app">
                    {isBn ? "বিশেষ নির্দেশনা (ঐচ্ছিক)" : "Instructions / Notes"}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isBn ? "যেমন: পর্যাপ্ত পানি দিয়ে সেব্য" : "e.g. Take with warm water"}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-surface-border">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    size="md"
                    className="cursor-pointer"
                  >
                    {isBn ? "বাতিল" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    variant="primary"
                    size="md"
                    className="cursor-pointer shadow-lg bg-gradient-to-r from-primary-teal to-emerald-accent"
                  >
                    {isCreating
                      ? (isBn ? "সংরক্ষণ হচ্ছে..." : "Saving...")
                      : (isBn ? "শিডিউল ও অ্যালার্ম চালু করুন" : "Save Schedule & Activate Alarm")}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
