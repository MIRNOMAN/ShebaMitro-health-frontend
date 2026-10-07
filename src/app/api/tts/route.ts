import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const NESTJS_TTS_SERVICE_URL =
  process.env.NESTJS_TTS_SERVICE_URL || "http://localhost:5010/api/v1/tts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, language = "bn", medicineName } = body || {};

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text prompt is required for TTS synthesis." },
        { status: 400 }
      );
    }

    const langCode = language === "en" ? "en" : language === "hi" ? "hi" : "bn";

    // 1. Try forwarding to NestJS TTS Service if available
    try {
      const nestResponse = await fetch(NESTJS_TTS_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: langCode, medicineName }),
        signal: AbortSignal.timeout(2000), // 2s timeout
      });

      if (nestResponse.ok) {
        const contentType = nestResponse.headers.get("content-type");
        if (contentType && contentType.includes("audio")) {
          const audioBuffer = await nestResponse.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      }
    } catch {
      // Continue to Google TTS fallback
    }

    // 2. High-quality Native Voice Synthesis Stream via Google TTS Endpoint (supports Bengali bn, English en, Hindi hi)
    try {
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodeURIComponent(
        text
      )}`;

      const googleRes = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
        signal: AbortSignal.timeout(4000),
      });

      if (googleRes.ok) {
        const audioBuffer = await googleRes.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch (googleErr) {
      console.warn("Google TTS fallback failed, instructing client to use WebSpeech API:", googleErr);
    }

    // 3. Client Web Speech API fallback metadata
    return NextResponse.json({
      success: true,
      source: "WebSpeech-Fallback-Synthesizer",
      text,
      language: langCode === "bn" ? "bn-BD" : langCode === "hi" ? "hi-IN" : "en-US",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to process TTS request", details: err?.message },
      { status: 500 }
    );
  }
}
