/**
 * Synthesizes a soft, pleasant 2-tone medical reminder chime using the Web Audio API.
 * No external MP3/WAV files required.
 */
let audioCtx: AudioContext | null = null;
let currentOsc1: OscillatorNode | null = null;
let currentOsc2: OscillatorNode | null = null;
let chimeInterval: NodeJS.Timeout | null = null;

export const playSoftChimeSound = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const playSingleTone = () => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Tone 1: C5 (523.25 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Tone 2: E5 (659.25 Hz) slightly delayed
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, now + 0.2);
      gain2.gain.setValueAtTime(0, now + 0.2);
      gain2.gain.linearRampToValueAtTime(0.2, now + 0.25);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.8);
    };

    playSingleTone();

    // Loop chime every 2.5 seconds until stopped
    stopChimeSound();
    chimeInterval = setInterval(() => {
      playSingleTone();
    }, 2500);
  } catch (err) {
    console.error("Web Audio API Error:", err);
  }
};

export const stopChimeSound = () => {
  if (chimeInterval) {
    clearInterval(chimeInterval);
    chimeInterval = null;
  }
};
