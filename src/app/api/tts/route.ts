import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const NESTJS_TTS_SERVICE_URL =
  process.env.NESTJS_TTS_SERVICE_URL || "http://localhost:3001/tts";

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

    // 1. Try forwarding to NestJS TTS Service
    try {
      const nestResponse = await fetch(NESTJS_TTS_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, medicineName }),
        signal: AbortSignal.timeout(3000), // 3s timeout
      });

      if (nestResponse.ok) {
        const contentType = nestResponse.headers.get("content-type");
        if (contentType && contentType.includes("audio")) {
          const audioBuffer = await nestResponse.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-cache",
            },
          });
        }

        const jsonRes = await nestResponse.json();
        return NextResponse.json(jsonRes);
      }
    } catch (nestErr) {
      console.warn("NestJS TTS Microservice unreachable, activating client WebSpeech fallback:", nestErr);
    }

    // 2. Return fallback metadata for frontend client Web Speech API synthesis
    return NextResponse.json({
      success: true,
      source: "WebSpeech-Fallback-Synthesizer",
      text,
      language: language === "bn" ? "bn-BD" : "en-US",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to process TTS request", details: err?.message },
      { status: 500 }
    );
  }
}
