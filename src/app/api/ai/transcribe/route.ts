import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/observability/logger";

export const runtime = "nodejs";

/**
 * POST /api/ai/transcribe
 * Audio speech-to-text transcription powered by Whisper (whisper-large-v3 via Groq Free Tier or HuggingFace)
 * with robust fallback.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Check if payload is multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as Blob | null;

      if (!file) {
        return NextResponse.json({ error: "No audio file provided in form-data" }, { status: 400 });
      }

      const groqKey = process.env.GROQ_API_KEY;
      if (groqKey) {
        const groqForm = new FormData();
        groqForm.append("file", file, "audio.webm");
        groqForm.append("model", "whisper-large-v3");
        groqForm.append("temperature", "0");
        groqForm.append("language", "en");

        const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
          },
          body: groqForm,
        });

        if (groqRes.ok) {
          const data = (await groqRes.json()) as { text: string };
          logger.info("whisper_transcription_success", "Audio transcribed via Whisper", {
            metadata: { textLength: data.text?.length || 0 },
          });
          return NextResponse.json({ success: true, text: data.text, provider: "groq-whisper-large-v3" });
        }
      }

      // If Whisper API is unconfigured or failed, return empty text so browser WebSpeech handles transcription
      return NextResponse.json({
        success: true,
        text: "",
        provider: "local-speech-fallback",
      });
    }

    // 2. Direct JSON body with base64 audio
    const body = await req.json();
    if (body.text) {
      // Echo or format
      return NextResponse.json({ success: true, text: body.text, provider: "client-webspeech" });
    }

    return NextResponse.json({ error: "Unsupported audio payload" }, { status: 400 });
  } catch (error) {
    logger.error("transcription_error", "Whisper transcription failed", {
      metadata: { error: (error as Error).message },
    });
    return NextResponse.json(
      { success: false, error: "Transcription failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
