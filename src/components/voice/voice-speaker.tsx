"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VoiceSpeakerProps {
  text: string;
  className?: string;
}

export function VoiceSpeaker({ text, className = "" }: VoiceSpeakerProps) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const cleanTextForSpeech = (raw: string): string => {
    return raw
      .replace(/```[\s\S]*?```/g, "Code block omitted.") // skip raw code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // clean links
      .replace(/[*_#`~]/g, "") // clean markdown syntax
      .trim();
  };

  const handleToggleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "en-GB"; // British English cadence per directives
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural British voice if available
    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find((v) => v.lang.includes("en-GB") || v.lang.includes("en_GB"));
    if (gbVoice) {
      utterance.voice = gbVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-mono transition-colors text-foreground-subtle hover:text-primary ${
        isSpeaking ? "text-primary bg-primary/10 animate-pulse" : "hover:bg-secondary/60"
      } ${className}`}
      title={isSpeaking ? "Stop listening" : "Read aloud (British English voice)"}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px]">Speaking...</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" />
          <span className="text-[10px]">Listen</span>
        </>
      )}
    </button>
  );
}
