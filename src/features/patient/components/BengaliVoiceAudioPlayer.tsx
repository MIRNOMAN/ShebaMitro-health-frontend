"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Play, Pause, Sparkles, Radio } from "lucide-react";
import { playSoftChimeSound } from "../utils/chime";

export interface BengaliVoiceAudioPlayerProps {
  medicineName: string;
  dosageText: string;
  instructions?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export function BengaliVoiceAudioPlayer({
  medicineName,
  dosageText,
  instructions = "",
  autoPlay = true,
  onEnded,
}: BengaliVoiceAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechSource, setSpeechSource] = useState<"NestJS-TTS" | "Browser-Synthesizer" | "Initializing">("Initializing");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synthesize default Bengali text note if not provided
  const bengaliText = `আপনার ${medicineName} ${dosageText} ওষুধ খাওয়ার সময় হয়েছে। ${
    instructions ? `নির্দেশনা: ${instructions}।` : "দয়া করে নির্ধারিত মাত্রায় সেবন করুন।"
  }`;

  useEffect(() => {
    if (autoPlay) {
      handlePlayVoiceNote();
    }
    return () => {
      stopAllAudio();
    };
  }, [medicineName, autoPlay]);

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
      // 1. Fetch synthesized audio stream from NestJS TTS Service via API route
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: bengaliText,
          language: "bn",
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
          setSpeechSource("NestJS-TTS");
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

      // If JSON response or fallback indicated
      fallbackSpeechSynthesis();
    } catch (err) {
      console.warn("Error fetching NestJS TTS audio stream, switching to browser synthesizer:", err);
      fallbackSpeechSynthesis();
    }
  };

  // Web Speech Synthesis Fallback
  const fallbackSpeechSynthesis = () => {
    setIsLoading(false);
    setSpeechSource("Browser-Synthesizer");

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(bengaliText);
    utterance.lang = "bn-BD"; // Bengali (Bangladesh)
    utterance.rate = 0.9; // Slightly slower for clear medical instructions
    utterance.pitch = 1.0;

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

  return (
    <div className="w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-surface-card to-teal-950/30 p-4 shadow-lg space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>বাংলা ভয়েস রিমাইন্ডার (Bengali Audio Player)</span>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {speechSource}
        </span>
      </div>

      {/* Synthesized Spoken Text Preview Box */}
      <div className="p-3 rounded-xl bg-bg-app/80 border border-surface-border text-xs text-fg-app font-medium leading-relaxed">
        <span className="text-emerald-500 font-bold mr-1.5">🔊 ভয়েস বার্তা:</span>
        <span>"{bengaliText}"</span>
      </div>

      {/* Audio Waveform Visualizer & Action Bar */}
      <div className="flex items-center justify-between gap-4 pt-1">
        {/* Animated Soundwave Visualizer Bars */}
        <div className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
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
                  ? "bg-gradient-to-t from-teal-500 to-emerald-400 shadow-xs"
                  : "bg-emerald-500/30"
              }`}
            />
          ))}

          <span className="ml-2 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
            {isLoading
              ? "স্ট্রিম লোড হচ্ছে..."
              : isPlaying && !isMuted
              ? "প্লে হচ্ছে..."
              : "প্রস্তুত"}
          </span>
        </div>

        {/* Player Controls: Replay, Play/Pause, Mute */}
        <div className="flex items-center gap-2">
          {/* Replay Button */}
          <button
            type="button"
            onClick={handlePlayVoiceNote}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:bg-emerald-400 transition-all flex items-center gap-1.5 active:scale-95"
            title="Replay Voice Note (পুনরায় শুনুন)"
            aria-label="Replay Bengali audio note"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>পুনরায় শুনুন</span>
          </button>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-colors ${
              isMuted
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                : "bg-surface-card text-muted-fg hover:text-fg-app border-surface-border"
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
