"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Radio } from "lucide-react";
import { playSoftChimeSound } from "../utils/chime";
import { useLanguage } from "@/components/providers/language-provider";

export interface BengaliVoiceAudioPlayerProps {
  medicineName: string;
  dosageText: string;
  instructions?: string;
  language?: "bn" | "en" | "hi";
  autoPlay?: boolean;
  onEnded?: () => void;
}

export function BengaliVoiceAudioPlayer({
  medicineName,
  dosageText,
  instructions = "",
  language,
  autoPlay = true,
  onEnded,
}: BengaliVoiceAudioPlayerProps) {
  const { locale } = useLanguage();
  const activeLanguage = language || (locale === "en" ? "en" : locale === "hi" ? "hi" : "bn");

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechSource, setSpeechSource] = useState<"HD-Cloud-Audio" | "Browser-Synthesizer" | "Initializing">("Initializing");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate localized voice script based on active language
  const spokenText =
    activeLanguage === "en"
      ? `It is time to take your ${medicineName}, dosage: ${dosageText}. ${
          instructions ? `Instructions: ${instructions}.` : "Please take your prescribed medication on schedule."
        }`
      : activeLanguage === "hi"
      ? `आपकी ${medicineName} (${dosageText}) दवा लेने का समय हो गया है। ${
          instructions ? `निर्देश: ${instructions}।` : "कृपया समय पर दवा लें।"
        }`
      : `আপনার ${medicineName} ${dosageText} ওষুধ খাওয়ার সময় হয়েছে। ${
          instructions ? `নির্দেশনা: ${instructions}।` : "দয়া করে নির্ধারিত মাত্রায় সেবন করুন।"
        }`;

  useEffect(() => {
    if (autoPlay) {
      handlePlayVoiceNote();
    }
    return () => {
      stopAllAudio();
    };
  }, [medicineName, activeLanguage, autoPlay]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handlePlayVoiceNote = async () => {
    stopAllAudio();
    setIsLoading(true);

    // Play soft notification chime first
    try {
      playSoftChimeSound();
    } catch (e) {
      console.warn("Chime playback error:", e);
    }

    try {
      // 1. Fetch synthesized audio stream from TTS Service via API route
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: spokenText,
          language: activeLanguage,
          medicineName,
        }),
      });

      const contentType = res.headers.get("content-type");

      if (res.ok && contentType && contentType.includes("audio")) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);

        audioRef.current = audio;
        audio.muted = isMuted;

        audio.onplay = () => {
          setIsPlaying(true);
          setIsLoading(false);
          setSpeechSource("HD-Cloud-Audio");
        };

        audio.onended = () => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        };

        audio.onerror = () => {
          fallbackSpeechSynthesis();
        };

        await audio.play();
        return;
      }

      // If non-audio response, use Web Speech API fallback
      fallbackSpeechSynthesis();
    } catch (err) {
      console.warn("Error fetching TTS audio stream, switching to browser synthesizer:", err);
      fallbackSpeechSynthesis();
    }
  };

  // Web Speech Synthesis Fallback with localized voice matching
  const fallbackSpeechSynthesis = () => {
    setIsLoading(false);
    setSpeechSource("Browser-Synthesizer");

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const langCode = activeLanguage === "en" ? "en-US" : activeLanguage === "hi" ? "hi-IN" : "bn-BD";
    utterance.lang = langCode;
    utterance.rate = activeLanguage === "bn" ? 0.9 : 1.0;
    utterance.pitch = 1.0;

    // Pick matching voice if available in browser
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find((v) => {
        const vLang = (v.lang || "").toLowerCase();
        const vName = (v.name || "").toLowerCase();
        if (activeLanguage === "bn") {
          return vLang.startsWith("bn") || vName.includes("bangla") || vName.includes("bengali");
        }
        if (activeLanguage === "hi") {
          return vLang.startsWith("hi") || vName.includes("hindi");
        }
        return vLang.startsWith("en");
      });
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
    if (nextMute && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Localized UI text labels
  const labels = {
    title:
      activeLanguage === "en"
        ? "Voice Audio Reminder (Audio Player)"
        : activeLanguage === "hi"
        ? "वॉयস ऑडियो रिमाइंडर (Audio Player)"
        : "বাংলা ভয়েস রিমাইন্ডার (Bengali Audio Player)",
    noteLabel:
      activeLanguage === "en" ? "🔊 Voice Note:" : activeLanguage === "hi" ? "🔊 वॉयस संदेश:" : "🔊 ভয়েস বার্তা:",
    replay:
      activeLanguage === "en" ? "Replay Audio" : activeLanguage === "hi" ? "फिर से सुनें" : "পুনরায় শুনুন",
    loading: activeLanguage === "en" ? "Loading..." : activeLanguage === "hi" ? "लोड हो रहा है..." : "লোড হচ্ছে...",
    playing: activeLanguage === "en" ? "Playing..." : activeLanguage === "hi" ? "चल रहा है..." : "প্লে হচ্ছে...",
    ready: activeLanguage === "en" ? "Ready" : activeLanguage === "hi" ? "तैयार" : "প্রস্তুত",
  };

  return (
    <div className="w-full rounded-2xl border border-surface-border bg-surface-card/90 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3.5 text-left">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-primary-teal font-extrabold text-xs uppercase tracking-wider">
          <Radio className="w-4 h-4 animate-pulse text-emerald-accent" />
          <span>{labels.title}</span>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-primary-teal/10 text-primary-teal border border-primary-teal/25">
          {speechSource}
        </span>
      </div>

      {/* Synthesized Spoken Text Preview Box */}
      <div className="p-3.5 rounded-xl bg-muted-bg/60 border border-surface-border text-xs text-fg-app font-medium leading-relaxed">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1.5">{labels.noteLabel}</span>
        <span className="text-fg-app/90">"{spokenText}"</span>
      </div>

      {/* Audio Waveform Visualizer & Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        {/* Animated Soundwave Visualizer Bars */}
        <div className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-surface-card border border-surface-border flex-1 max-w-[220px]">
          {[0.4, 0.9, 0.5, 1.0, 0.6, 0.8, 0.3, 0.7, 0.9, 0.5].map((heightFactor, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying && !isMuted
                  ? {
                      height: ["15%", `${heightFactor * 100}%`, "20%"],
                    }
                  : { height: "20%" }
              }
              transition={{
                duration: 0.5,
                repeat: isPlaying && !isMuted ? Infinity : 0,
                repeatType: "mirror",
                delay: i * 0.08,
              }}
              className={`w-1.5 rounded-full transition-colors ${
                isPlaying && !isMuted
                  ? "bg-gradient-to-t from-primary-teal to-emerald-accent shadow-xs"
                  : "bg-muted-fg/30"
              }`}
            />
          ))}

          <span className="ml-auto text-[11px] font-bold text-muted-fg">
            {isLoading ? labels.loading : isPlaying && !isMuted ? labels.playing : labels.ready}
          </span>
        </div>

        {/* Player Controls: Replay, Play/Pause, Mute */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Replay Button */}
          <button
            type="button"
            onClick={handlePlayVoiceNote}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-accent to-primary-teal text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all active:scale-95 cursor-pointer"
            title={labels.replay}
            aria-label="Replay audio reminder note"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{labels.replay}</span>
          </button>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                : "bg-surface-card text-muted-fg hover:text-fg-app border-surface-border hover:bg-surface-card-hover"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
