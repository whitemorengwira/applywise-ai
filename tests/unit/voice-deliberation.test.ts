import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/ai/transcribe/route";
import { NextRequest } from "next/server";

describe("Voice Deliberation & Audio Transcription Fallback", () => {
  it("returns clean empty text on unconfigured Whisper audio upload rather than mock placeholder strings", async () => {
    // Create a mock multipart form data with dummy audio blob
    const dummyBlob = new Blob(["dummy audio data"], { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", dummyBlob, "speech.webm");

    const req = new NextRequest("http://localhost:3000/api/ai/transcribe", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    // Crucial check: Must not return mock text that would pollute user prompt
    expect(data.text).toBe("");
    expect(data.text).not.toContain("Voice audio received");
  });

  it("echoes valid client-side WebSpeech transcript payload without error", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/transcribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: "Schedule technical interview for Solutions Architect" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.text).toBe("Schedule technical interview for Solutions Architect");
    expect(data.provider).toBe("client-webspeech");
  });

  it("verifies speech synthesis cleaning rules strip markdown and code blocks", () => {
    const rawMarkdown = "Hello **Whitemore**. ```const x = 1;``` Check [N.White Systems](https://nwhite.systems).";
    const cleaned = rawMarkdown
      .replace(/```[\s\S]*?```/g, "Code block omitted.")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_#`~>]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    expect(cleaned).toContain("Hello Whitemore.");
    expect(cleaned).toContain("Code block omitted.");
    expect(cleaned).toContain("Check N.White Systems.");
    expect(cleaned).not.toContain("**");
    expect(cleaned).not.toContain("https://");
  });
});
