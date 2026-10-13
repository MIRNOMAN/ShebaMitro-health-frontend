"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLenis } from "@/components/providers/smooth-scroll-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { isTokenValid } from "@/lib/auth/tokenSecurity";
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
  Lock,
  ShieldAlert,
  User,
  Stethoscope,
  FlaskConical,
  LogIn,
  LogOut,
  ArrowRight,
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";

  // Auth and role resolution
  const { user, isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const storedUserStr = typeof window !== "undefined" ? localStorage.getItem("shebamitro_user") : null;
  const storedUser = storedUserStr
    ? (() => {
        try {
          return JSON.parse(storedUserStr);
        } catch {
          return null;
        }
      })()
    : null;
  const currentUser = user || storedUser;

  const storedToken =
    typeof window !== "undefined"
      ? localStorage.getItem("shebamitro_access_token") || localStorage.getItem("sheba_session")
      : null;
  const currentToken = accessToken || storedToken;

  const hasValidAuth = Boolean(
    (currentToken && isTokenValid(currentToken)) ||
      (isAuthenticated && user) ||
      Boolean(currentUser && currentToken)
  );

  const rawRole = currentUser?.role ? String(currentUser.role).toLowerCase() : "";
  const isPatient = hasValidAuth && rawRole === "patient";

  // RTK Query hooks - skip query when user is not a verified patient
  const { data: remindersResponse, isLoading, isFetching } = useGetRemindersQuery(undefined, {
    pollingInterval: 20000,
    skip: !isPatient,
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

  const lenis = useLenis();

  // Scroll lock effect: stops background page and Lenis from scrolling while modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isModalOpen, lenis]);

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

  // ── Access Control Guards ────────────────────────────────────
  // 1. Loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-primary-teal/15 text-primary-teal flex items-center justify-center animate-pulse">
          <Pill className="w-7 h-7 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-muted-fg animate-pulse">
          {isBn ? "প্রবেশাধিকার যাচাই করা হচ্ছে..." : "Verifying access credentials..."}
        </p>
      </div>
    );
  }

  // 2. Unauthenticated user guard - meaningfull message and direct sign in CTA
  if (!hasValidAuth) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-muted-fg">
          <Link href="/" className="hover:text-primary-teal transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary-teal">{isBn ? "মেডিসিন শিডিউল" : "Medication Schedule"}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlowCard className="p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 bg-primary-teal/15 blur-3xl pointer-events-none rounded-full" />

            <div className="mx-auto w-16 h-16 rounded-3xl bg-primary-teal/15 border border-primary-teal/30 text-primary-teal flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-coral-accent/15 text-coral-accent border border-coral-accent/30">
                <ShieldAlert className="w-3.5 h-3.5" />
                {isBn ? "রোগী একাউন্ট আবশ্যক" : "Patient Authentication Required"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
                {isBn
                  ? "স্মার্ট মেডিসিন শিডিউল ও অ্যালার্ম শুধুমাত্র রোগীদের জন্য নির্ধারিত"
                  : "Smart Medication Schedule & Alarms is Exclusively for Patients"}
              </h2>
              <p className="text-sm text-muted-fg leading-relaxed">
                {isBn
                  ? "প্রেসক্রিপশন অনুযায়ী সঠিক সময়ে ওষুধ সেবনের ভয়েস অ্যালার্ম, পুশ নোটিফিকেশন ও ডোজ ট্র্যাকিং হলো সেবা মিত্রের একটি ব্যক্তিগত স্বাস্থ্য সেবা। ওষুধ শিডিউল দেখতে বা নতুন শিডিউল যোগ করতে অনুগ্রহ করে আপনার রোগী একাউন্টে লগইন করুন।"
                  : "Automated dose reminders, audio voice alarms, and precision intake tracking are personal healthcare tools exclusive to registered Patient accounts. Please sign in with your Patient account to view your schedules or add new medication alarms."}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 max-w-2xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-1">
                <div className="flex items-center gap-2 text-primary-teal font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>{isBn ? "স্মার্ট ভয়েস অ্যালার্ম" : "Smart Voice Alarms"}</span>
                </div>
                <p className="text-[11px] text-muted-fg">
                  {isBn ? "সঠিক সময়ে ওষুধের অডিও সতর্কতা ও এসএমএস" : "Timely audio intake alerts & WhatsApp SMS"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-1">
                <div className="flex items-center gap-2 text-emerald-accent font-bold text-xs">
                  <Pill className="w-4 h-4" />
                  <span>{isBn ? "ডোজ ট্র্যাকার" : "Dose Compliance"}</span>
                </div>
                <p className="text-[11px] text-muted-fg">
                  {isBn ? "প্রেসক্রিপশন অনুযায়ী কোর্স কমপ্লায়েন্স ট্র্যাকিং" : "Real-time intake tracking & adherence stats"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-1">
                <div className="flex items-center gap-2 text-violet-accent font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isBn ? "ব্যক্তিগত নিরাপত্তা" : "100% Private"}</span>
                </div>
                <p className="text-[11px] text-muted-fg">
                  {isBn ? "আপনার ব্যক্তিগত স্বাস্থ্য তথ্য সম্পূর্ণ নিরাপদ" : "HIPAA standard encrypted personal data"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                type="button"
                onClick={() => router.push("/login?role=patient&redirect=/patient/reminders")}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-xl bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-bold cursor-pointer flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isBn ? "রোগী হিসেবে লগইন করুন" : "Sign In as Patient"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/register?role=patient")}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto cursor-pointer"
              >
                {isBn ? "নতুন রোগী নিবন্ধন" : "Register as Patient"}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/")}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-muted-fg hover:text-fg-app cursor-pointer"
              >
                {isBn ? "মূল পাতায় ফিরে যান" : "Back to Home"}
              </Button>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    );
  }

  // 3. Non-Patient Role Guard (Doctor, Pharmacy, Lab, Admin) - meaningful restriction & navigation
  if (!isPatient) {
    const roleLabels: Record<string, { en: string; bn: string; icon: any; color: string; dashboard: string }> = {
      doctor: {
        en: "Doctor",
        bn: "ডাক্তার",
        icon: Stethoscope,
        color: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
        dashboard: "/dashboard/doctor",
      },
      pharmacy: {
        en: "Pharmacy Partner",
        bn: "ফার্মাসিস্ট",
        icon: Pill,
        color: "text-coral-accent bg-coral-accent/15 border-coral-accent/30",
        dashboard: "/dashboard/pharmacy",
      },
      lab: {
        en: "Diagnostic Lab",
        bn: "ল্যাব টেকনিশিয়ান",
        icon: FlaskConical,
        color: "text-violet-accent bg-violet-accent/15 border-violet-accent/30",
        dashboard: "/dashboard/lab",
      },
      admin: {
        en: "Administrator",
        bn: "অ্যাডমিনিস্ট্রেটর",
        icon: ShieldAlert,
        color: "text-rose-500 bg-rose-500/15 border-rose-500/30",
        dashboard: "/dashboard/admin",
      },
    };

    const currentRoleMeta = roleLabels[rawRole] || {
      en: rawRole ? rawRole.toUpperCase() : "Healthcare Professional",
      bn: rawRole ? rawRole.toUpperCase() : "স্বাস্থ্যসেবা প্রফেশনাল",
      icon: User,
      color: "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
      dashboard: `/dashboard/${rawRole || "doctor"}`,
    };

    const RoleIcon = currentRoleMeta.icon;

    const handleSwitchToPatient = () => {
      dispatch(logout());
      router.push("/login?role=patient&redirect=/patient/reminders");
    };

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-muted-fg">
          <Link href="/" className="hover:text-primary-teal transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary-teal">{isBn ? "মেডিসিন শিডিউল" : "Medication Schedule"}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlowCard className="p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 bg-coral-accent/15 blur-3xl pointer-events-none rounded-full" />

            <div className="mx-auto w-16 h-16 rounded-3xl bg-coral-accent/15 border border-coral-accent/30 text-coral-accent flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${currentRoleMeta.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                {isBn
                  ? `লগইনকৃত অ্যাকাউন্ট: ${currentRoleMeta.bn}`
                  : `Signed in as: ${currentRoleMeta.en}`}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
                {isBn
                  ? "এই সেবাটি শুধুমাত্র রোগীদের ব্যক্তিগত ব্যবহারের জন্য নির্ধারিত"
                  : "Access Restricted: Feature Exclusively for Patients"}
              </h2>

              <p className="text-sm text-muted-fg leading-relaxed">
                {isBn
                  ? `আপনি বর্তমানে একজন ${currentRoleMeta.bn} হিসেবে লগইন অবস্থায় আছেন। স্মার্ট মেডিসিন অ্যালার্ম ও ওষুধের ডোজ শিডিউল হলো রোগীদের নিজস্ব প্রেসক্রিপশন মেনে ওষুধ খাওয়ার ব্যক্তিগত ট্র্যাকিং সেবা। পেশাদার স্বাস্থ্যসেবা অ্যাকাউন্ট থেকে ব্যক্তিগত মেডিসিন শিডিউল পরিচালনা করা যায় না। অনুগ্রহ করে আপনার সংশ্লিষ্ট প্রফেশনাল ড্যাশবোর্ডে প্রবেশ করুন অথবা একটি রোগী অ্যাকাউন্ট দিয়ে লগইন করুন।`
                  : `You are currently logged in with a professional ${currentRoleMeta.en} account. Medication schedules and alarm reminders are personal health tools designed strictly for Patients. Healthcare provider accounts manage clinical care and cannot maintain personal patient medicine schedules here. Please return to your professional workspace or switch to a Patient account.`}
              </p>
            </div>

            {/* Current user summary pill */}
            <div className="p-4 rounded-2xl bg-surface-card border border-surface-border max-w-md mx-auto flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-border/50 flex items-center justify-center font-bold text-fg-app text-sm">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || "SM"}
                </div>
                <div>
                  <div className="text-sm font-bold text-fg-app">
                    {currentUser?.name || (isBn ? "প্রফেশনাল ব্যবহারকারী" : "Professional User")}
                  </div>
                  <div className="text-xs text-muted-fg truncate max-w-[200px]">
                    {currentUser?.email || ""}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-primary-teal/15 text-primary-teal border border-primary-teal/30">
                {rawRole}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                type="button"
                onClick={() => router.push(currentRoleMeta.dashboard)}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-xl bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-bold cursor-pointer flex items-center gap-2"
              >
                <RoleIcon className="w-4 h-4" />
                <span>
                  {isBn
                    ? `আপনার ${currentRoleMeta.bn} ড্যাশবোর্ডে যান`
                    : `Go to ${currentRoleMeta.en} Dashboard`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                onClick={handleSwitchToPatient}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-coral-accent" />
                <span>{isBn ? "রোগী একাউন্টে পরিবর্তন করুন" : "Switch to Patient Account"}</span>
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/")}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-muted-fg hover:text-fg-app cursor-pointer"
              >
                {isBn ? "মূল পাতায় ফিরুন" : "Back to Home"}
              </Button>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    );
  }

  // 4. Patient Role Access Granted - Full Medication Schedule View
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

      {/* ── Shadcn UI Dialog: Add Medication Schedule ─────────── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
          onPointerDownOutside={() => setIsModalOpen(false)}
        >
          {/* Fixed Header */}
          <DialogHeader className="flex-row items-center gap-3 space-y-0 pr-12">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-teal to-emerald-accent text-white flex items-center justify-center shadow-md shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>
                {isBn ? "নতুন ওষুধের সময়সূচী যোগ করুন" : "Add Medication Schedule"}
              </DialogTitle>
              <DialogDescription>
                {isBn
                  ? "ডাক্তারের প্রেসক্রিপশন অনুযায়ী স্মার্ট অ্যালার্ম সেট করুন"
                  : "Configure precision dose timing and reminders"}
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Form with Scrollable Body & Fixed Footer */}
          <form
            id="add-medication-form"
            onSubmit={handleCreateSubmit}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Scrollable Form Body with Visible Custom Scrollbar */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-modal-scrollbar px-6 sm:px-7 py-5 space-y-5"
            >
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
                      className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
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

              {/* Medicine Name & Generic Name */}
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
              </div>

              {/* Dosage Form, Meal Timing, Schedule Pattern */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-fg-app">
                    {isBn ? "ডোজ ফরম" : "Dosage Form"}
                  </label>
                  <select
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-xs sm:text-sm text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-xs sm:text-sm text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-xs sm:text-sm text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
                  >
                    <option value="1+0+1">1+0+1 (সকাল ও রাত)</option>
                    <option value="1+0+0">1+0+0 (শুধু সকাল)</option>
                    <option value="0+0+1">0+0+1 (শুধু রাত)</option>
                    <option value="1+1+1">1+1+1 (দিনে ৩ বার)</option>
                    <option value="0+1+0">0+1+0 (শুধু দুপুর)</option>
                  </select>
                </div>
              </div>

              {/* Alarm Intake Time & Duration (Days) */}
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal"
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

              {/* Instructions / Notes */}
              <div className="space-y-1.5 pb-2">
                <label className="text-xs font-bold text-fg-app">
                  {isBn ? "বিশেষ নির্দেশনা (ঐচ্ছিক)" : "Instructions / Notes"}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isBn ? "যেমন: পর্যাপ্ত পানি দিয়ে সেব্য" : "e.g. Take with warm water"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-card/60 text-sm text-fg-app focus:outline-none focus:border-primary-teal focus:ring-1 focus:ring-primary-teal"
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <DialogFooter className="px-6 py-4 sm:px-7 sm:py-4 bg-surface-card/95 border-t border-surface-border">
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
                form="add-medication-form"
                disabled={isCreating}
                variant="primary"
                size="md"
                className="cursor-pointer shadow-lg bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-bold"
              >
                {isCreating
                  ? (isBn ? "সংরক্ষণ হচ্ছে..." : "Saving...")
                  : (isBn ? "শিডিউল ও অ্যালার্ম চালু করুন" : "Save Schedule & Activate Alarm")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
