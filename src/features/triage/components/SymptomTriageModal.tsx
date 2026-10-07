"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { fetchSymptomTriage } from "../services/triage-api";
import type { TriageResponseData, UrgencyLevel, DoctorSpecialtyCard } from "../types/triage";

const PRESET_SYMPTOMS = [
  { label: "🫀 Chest Pain (বুক ব্যথা)", value: "buke severe betha and buke chap lagtese" },
  { label: "🤒 High Fever (উচ্চ জ্বর ও কাশি)", value: "last 3 din dhore high fever around 102F and dry cough" },
  { label: "🧠 Severe Headache (মাথাব্যথা)", value: "tivro matha betha and chokh ghora with nausea" },
  { label: "🫁 Shortness of breath (শ্বাসকষ্ট)", value: "shash kosto ebong buke chap anubhob hocche" },
  { label: "🤢 Stomach Pain (পেটে তীব্র ব্যথা)", value: "severe pete betha and bomi bhab" },
];

export function SymptomTriageModal() {
  const { locale, setLocale, t } = useLanguage();

  const [isOpen, setIsOpen] = React.useState(false);
  const [symptomsInput, setSymptomsInput] = React.useState("");
  const [isListening, setIsListening] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<TriageResponseData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSpeakingResult, setIsSpeakingResult] = React.useState(false);

  // Speech Recognition setup
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = locale === "bn" ? "bn-BD" : "en-US";

        rec.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setSymptomsInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };

        rec.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [locale]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this browser. Please type your symptoms.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = locale === "bn" ? "bn-BD" : "en-US";
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleTriageSubmit = async (customText?: string) => {
    const queryText = customText !== undefined ? customText : symptomsInput;
    if (!queryText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const langParam = locale === "bn" ? "bn" : "en";
      const data = await fetchSymptomTriage(queryText.trim(), langParam);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to process symptoms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeakingResult) {
      window.speechSynthesis.cancel();
      setIsSpeakingResult(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === "bn" ? "bn-BD" : "en-US";
    utterance.onend = () => setIsSpeakingResult(false);
    utterance.onerror = () => setIsSpeakingResult(false);

    setIsSpeakingResult(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    setSymptomsInput("");
    setResult(null);
    setError(null);
    if (isSpeakingResult && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setIsSpeakingResult(false);
    }
  };

  return (
    <>
      {/* ── Floating Action Trigger Pill Button (Bottom Right) ───────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-teal-600 via-primary-teal to-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 border border-white/20 backdrop-blur-xl"
          aria-label="Open AI Symptom Triage"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>

          <span className="font-extrabold tracking-wide">
            {locale === "bn" ? "এআই লক্ষণ নির্ণয়" : "AI Symptom Triage"}
          </span>

          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase text-white backdrop-blur-xs hidden sm:inline-block">
            NestJS AI
          </span>
        </motion.button>
      </div>

      {/* ── Symptom Triage Floating Modal ────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl rounded-3xl border border-surface-border/80 bg-surface-card shadow-2xl overflow-hidden z-10 my-auto"
              style={{ backgroundColor: "var(--card)" }}
            >
              {/* Header Banner */}
              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-teal-900/40 via-surface-card to-emerald-900/20 border-b border-surface-border/60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-teal/20 border border-primary-teal/40 text-primary-teal shadow-md glow-teal shrink-0">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-fg-app tracking-tight">
                          {locale === "bn" ? "এআই লক্ষণ নির্ণয় ও টিয়াজ" : "AI Symptom Triage & Specialist Finder"}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-primary-teal/15 text-primary-teal border border-primary-teal/30">
                          NestJS AI Service
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-fg mt-0.5">
                        {locale === "bn"
                          ? "আপনার লক্ষণ বাংলা, ইংরেজি বা বাংলিশে টাইপ করুন অথবা সরাসরি ভয়েস দিন"
                          : "Speak or type symptoms in English, Banglish, or Bangla"}
                      </p>
                    </div>
                  </div>

                  {/* Header Actions: Language Switcher + Close */}
                  <div className="flex items-center gap-2">
                    {/* Modal Global EN / বাংলা Language Toggle */}
                    <button
                      onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
                      className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-card-hover text-xs font-bold text-fg-app transition-all flex items-center gap-1.5 shadow-xs"
                      title="Toggle Language EN / বাংলা"
                    >
                      <span className="text-sm">{locale === "bn" ? "🇧🇩" : "🇺🇸"}</span>
                      <span>{locale === "bn" ? "বাংলা" : "EN"}</span>
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-xl border border-surface-border text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {!result ? (
                  <>
                    {/* Symptom Input Form */}
                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-fg-app flex items-center justify-between">
                        <span>{locale === "bn" ? "আপনার লক্ষণ বর্ণনা করুন:" : "Describe Your Symptoms:"}</span>
                        {isListening && (
                          <span className="text-rose-500 font-bold text-xs flex items-center gap-1 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            {locale === "bn" ? "শুনছি..." : "Listening..."}
                          </span>
                        )}
                      </label>

                      <div className="relative">
                        <textarea
                          rows={4}
                          value={symptomsInput}
                          onChange={(e) => setSymptomsInput(e.target.value)}
                          placeholder={
                            locale === "bn"
                              ? "যেমন: 'আমার গত ৩ দিন ধরে জ্বর ও শুকনো কাশি' অথবা 'amar buke batha r thanda lagse'..."
                              : "e.g., 'I have severe chest pressure and trouble breathing' or 'amar buke batha'..."
                          }
                          className="w-full rounded-2xl border border-surface-border bg-bg-app p-4 pr-12 text-sm text-fg-app placeholder:text-muted-fg focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/20 transition-all outline-none"
                        />

                        {/* Mic Voice Button Inside Textarea */}
                        <button
                          type="button"
                          onClick={toggleVoiceInput}
                          className={`absolute right-3 top-3 p-2.5 rounded-xl border transition-all ${
                            isListening
                              ? "bg-rose-500 text-white border-rose-400 animate-pulse glow-coral"
                              : "bg-surface-card text-muted-fg hover:text-primary-teal border-surface-border hover:border-primary-teal"
                          }`}
                          title={isListening ? "Stop Voice Input" : "Start Voice Input"}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Quick Symptom Presets */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-muted-fg uppercase tracking-wider block">
                        {locale === "bn" ? "দ্রুত বাছাইকৃত সাধারণ লক্ষণসমূহ:" : "Quick Symptom Presets:"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_SYMPTOMS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSymptomsInput(preset.value);
                              handleTriageSubmit(preset.value);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface-card hover:bg-primary-teal/10 hover:border-primary-teal/40 text-xs font-semibold text-fg-app transition-all text-left"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isLoading || !symptomsInput.trim()}
                        onClick={() => handleTriageSubmit()}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 glow-teal"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>
                              {locale === "bn"
                                ? "এআই মাইক্রোসার্ভিসে লক্ষণ বিশ্লেষণ হচ্ছে..."
                                : "Analyzing with NestJS AI Microservice..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>
                              {locale === "bn"
                                ? "এআই টিয়াজ ও ডাক্তার সন্ধান শুরু করুন"
                                : "Analyze Symptoms & Recommend Doctors"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  /* ── Triage Results Display ────────────────────────── */
                  <div className="space-y-6">
                    {/* Urgency Classification Header Badge */}
                    <UrgencyBadge urgency={result.urgency} result={result} locale={locale} />

                    {/* Speech Reader & Reset Actions */}
                    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-surface-card border border-surface-border">
                      <div className="flex items-center gap-2 text-xs font-bold text-fg-app">
                        <Brain className="w-4 h-4 text-primary-teal" />
                        <span>
                          {locale === "bn"
                            ? `মূল্যায়ন উৎস: ${result.sourceService}`
                            : `Evaluation Source: ${result.sourceService}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            speakText(
                              locale === "bn"
                                ? `${result.urgencyTitleBn}. ${result.summaryBn}`
                                : `${result.urgencyTitle}. ${result.summary}`
                            )
                          }
                          className="px-3 py-1.5 rounded-xl border border-surface-border bg-bg-app hover:bg-surface-card-hover text-xs font-bold text-fg-app transition-all flex items-center gap-1.5"
                        >
                          {isSpeakingResult ? (
                            <>
                              <VolumeX className="w-4 h-4 text-rose-500" />
                              <span>{locale === "bn" ? "ভয়েস থামান" : "Stop Voice"}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4 text-primary-teal" />
                              <span>{locale === "bn" ? "ভয়েসে শুনুন" : "Listen Audio"}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleReset}
                          className="px-3 py-1.5 rounded-xl border border-surface-border bg-bg-app hover:bg-surface-card-hover text-xs font-bold text-muted-fg hover:text-fg-app transition-all flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{locale === "bn" ? "পুনরায় চেষ্টা" : "New Search"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Summary & Clinical Advice */}
                    <div className="p-5 rounded-2xl bg-bg-app/60 border border-surface-border/60 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-muted-fg">
                        {locale === "bn" ? "লক্ষণ মূল্যায়ন সারসংক্ষেপ:" : "Clinical Summary & Guidance:"}
                      </h4>
                      <p className="text-sm font-medium text-fg-app leading-relaxed">
                        {locale === "bn" ? result.summaryBn : result.summary}
                      </p>

                      {/* Actionable Advice Bullet List */}
                      <div className="pt-2 space-y-1.5">
                        {(locale === "bn" ? result.adviceBn : result.advice).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-muted-fg font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Doctor Specialty Booking Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-fg-app flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-primary-teal" />
                          <span>
                            {locale === "bn"
                              ? "সুপারিশকৃত বিশেষজ্ঞ চিকিৎসকগণ:"
                              : "Recommended Doctor Specialties:"}
                          </span>
                        </h4>
                        <span className="text-[11px] font-bold text-primary-teal bg-primary-teal/10 px-2.5 py-0.5 rounded-full border border-primary-teal/20">
                          {result.recommendedSpecialties.length} {locale === "bn" ? "টি ক্যাটাগরি" : "Specialties"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.recommendedSpecialties.map((specialty) => (
                          <SpecialtyBookingCard
                            key={specialty.id}
                            specialty={specialty}
                            locale={locale}
                            onSelect={() => setIsOpen(false)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Medical Disclaimer */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-500 text-center">
                      ⚠️{" "}
                      {locale === "bn"
                        ? "এই এআই টিয়াজ শুধুমাত্র নির্দেশনার জন্য এবং এটি বিএমডিসি নিবন্ধিত ডাক্তারের প্রাতিষ্ঠানিক চিকিৎসার বিকল্প নয়।"
                        : "AI Triage is for guidance only and does not replace official registered physician advice."}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Urgency Badge Component based on Triage Classification
 */
function UrgencyBadge({
  urgency,
  result,
  locale,
}: {
  urgency: UrgencyLevel;
  result: TriageResponseData;
  locale: string;
}) {
  switch (urgency) {
    case "EMERGENCY":
      return (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/20 via-rose-500/10 to-transparent border border-red-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-red-500">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
              <span className="text-base font-black uppercase tracking-wider">
                {locale === "bn" ? result.urgencyTitleBn : result.urgencyTitle}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-black">
              SCORE: {result.urgencyScore}/100
            </span>
          </div>

          <p className="text-xs text-red-400 font-semibold leading-relaxed">
            {locale === "bn"
              ? "জরুরি চিকিৎসা সেবা নিশ্চিত করতে অবিলম্বে নিকটস্থ হাসপাতালের ইমার্জেন্সি বিভাগে যোগাযোগ করুন বা ৯৯৯ নম্বরে কল করুন।"
              : "Immediate medical emergency intervention required. Please call 999 or proceed directly to an emergency center."}
          </p>

          <div className="pt-1">
            <Link
              href="tel:999"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-red-700 transition-all"
            >
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span>{locale === "bn" ? "জরুরি অ্যাম্বুলেন্স (৯৯৯ কল করুন)" : "Call Emergency SOS (999)"}</span>
            </Link>
          </div>
        </div>
      );

    case "URGENT":
      return (
        <div className="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500 font-black text-base uppercase">
              <AlertTriangle className="w-5 h-5" />
              <span>{locale === "bn" ? result.urgencyTitleBn : result.urgencyTitle}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-black border border-amber-500/30">
              URGENT (12-24h)
            </span>
          </div>
          <p className="text-xs text-muted-fg font-medium">
            {locale === "bn"
              ? "লক্ষণগুলো আগামী ১২-২৪ ঘণ্টার মধ্যে বিশেষজ্ঞ ডাক্তারের সরাসরি বা ভিডিও পরামর্শ দাবি করে।"
              : "Symptoms warrant prompt specialist consultation within 12-24 hours."}
          </p>
        </div>
      );

    case "ROUTINE":
    case "SELF_CARE":
    default:
      return (
        <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-base uppercase">
              <Activity className="w-5 h-5" />
              <span>{locale === "bn" ? result.urgencyTitleBn : result.urgencyTitle}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-black border border-emerald-500/30">
              ROUTINE CARE
            </span>
          </div>
          <p className="text-xs text-muted-fg font-medium">
            {locale === "bn"
              ? "সাধারণ ডিজিটাল ভিডিও পরামর্শ বা ডাক্তারের চ্যাম্বারে অ্যাপয়েন্টমেন্টের পরামর্শ দেওয়া হচ্ছে।"
              : "Standard video consultation or routine specialist visit is recommended."}
          </p>
        </div>
      );
  }
}

/**
 * Specialty Booking Card Item
 */
function SpecialtyBookingCard({
  specialty,
  locale,
  onSelect,
}: {
  specialty: DoctorSpecialtyCard;
  locale: string;
  onSelect: () => void;
}) {
  return (
    <div className="p-4 rounded-2xl border border-surface-border bg-surface-card hover:border-primary-teal/60 hover:bg-surface-card-hover transition-all space-y-3 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-primary-teal/15 text-primary-teal border border-primary-teal/20">
            {specialty.badgeTag}
          </span>
          <span className="text-xs font-bold text-emerald-500">
            {specialty.matchingScore}% {locale === "bn" ? "ম্যাচ" : "Match"}
          </span>
        </div>

        <h5 className="font-extrabold text-sm text-fg-app group-hover:text-primary-teal transition-colors">
          {locale === "bn" ? specialty.nameBn : specialty.nameEn}
        </h5>
        <p className="text-xs text-muted-fg line-clamp-2 mt-1 font-medium">
          {locale === "bn" ? specialty.descriptionBn : specialty.descriptionEn}
        </p>
      </div>

      <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-fg">
          {specialty.availableDoctorsCount} {locale === "bn" ? "জন ডাক্তার উপলব্ধ" : "doctors available"}
        </span>

        <Link
          href={specialty.bookingUrl}
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-teal/15 hover:bg-primary-teal text-primary-teal hover:text-white font-bold text-xs transition-all"
        >
          <span>{locale === "bn" ? "ডাক্তার বুক করুন" : "Book Doctor"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
