"use client";

import * as React from "react";
import { Mic, MicOff, Loader2, Radio, Sparkles, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onStartInteract?: () => void;
  disabled?: boolean;
  className?: string;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface WebSpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

export function VoiceRecorder({
  onTranscript,
  onStartInteract,
  disabled = false,
  className = "",
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const recognitionRef = React.useRef<WebSpeechRecognitionInstance | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  // Close menu on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Initialize Speech Recognition if supported
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const windowObj = window as unknown as Record<string, unknown>;
      const SpeechConstructor = (windowObj.SpeechRecognition ||
        windowObj.webkitSpeechRecognition) as new () => WebSpeechRecognitionInstance;

      if (SpeechConstructor) {
        const recognition = new SpeechConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript.trim()) {
            onTranscript(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (event.error !== "no-speech") {
            console.warn("[VoiceRecorder] Speech recognition error:", event.error);
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onTranscript]);

  const startDictating = async () => {
    setIsMenuOpen(false);
    try {
      setIsRecording(true);
      audioChunksRef.current = [];

      // Audio MediaStream for Whisper transcription
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

          // Send to Whisper API endpoint
          if (audioBlob.size > 1000) {
            setIsProcessing(true);
            try {
              const formData = new FormData();
              formData.append("file", audioBlob, "speech.webm");

              const res = await fetch("/api/ai/transcribe", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              if (data.success && data.text && typeof data.text === "string" && data.text.trim()) {
                onTranscript(data.text.trim());
              }
            } catch (err) {
              console.warn("[VoiceRecorder] Whisper API error, relied on speech recognition:", err);
            } finally {
              setIsProcessing(false);
            }
          }
        };

        mediaRecorder.start();
      }

      // Also start instant Web Speech recognition for immediate in-browser feedback
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // Ignore if already active
        }
      }
    } catch (err) {
      console.error("[VoiceRecorder] Could not access microphone:", err);
      setIsRecording(false);
    }
  };

  const stopDictating = () => {
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Safe ignore
      }
    }
  };

  const handleMainButtonClick = () => {
    if (isRecording) {
      stopDictating();
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const handleSelectDictate = () => {
    startDictating();
  };

  const handleSelectInteract = () => {
    setIsMenuOpen(false);
    if (isRecording) {
      stopDictating();
    }
    if (onStartInteract) {
      onStartInteract();
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Dual Voice Options Dropdown Popover */}
      {isMenuOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-2xl bg-[#141822] border border-border/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-xl">
          <div className="px-2.5 py-1.5 mb-1.5 border-b border-border/50 flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Voice Deliberation
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary">
              AI Audio
            </span>
          </div>

          <div className="space-y-1">
            {/* 1. DICTATE OPTION */}
            <button
              type="button"
              onClick={handleSelectDictate}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary/70 text-left transition-all cursor-pointer group border border-transparent hover:border-emerald-500/30"
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mic className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>Dictate</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-300">
                    Speech-to-Text
                  </span>
                </div>
                <div className="text-[11px] text-foreground-subtle leading-tight mt-0.5">
                  Dictate prompt directly into context window
                </div>
              </div>
            </button>

            {/* 2. INTERACT OPTION */}
            <button
              type="button"
              onClick={handleSelectInteract}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary/70 text-left transition-all cursor-pointer group border border-transparent hover:border-purple-500/30"
            >
              <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Radio className="h-4 w-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>Interact</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-purple-500/20 text-purple-300">
                    Two-Way Live
                  </span>
                </div>
                <div className="text-[11px] text-foreground-subtle leading-tight mt-0.5">
                  Hands-free interactive voice deliberation session
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Voice Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleMainButtonClick}
        disabled={disabled || isProcessing}
        className={`h-8 px-2.5 rounded-full border transition-all select-none cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
          isRecording
            ? "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.35)]"
            : isMenuOpen
            ? "bg-primary/20 text-primary border-primary/50"
            : "border-transparent text-foreground-muted hover:text-foreground hover:bg-[#2f2f2f]"
        } ${className}`}
        title={
          isRecording
            ? "Stop dictating (Click to finish)"
            : "Voice deliberation options (Dictate or Interact)"
        }
      >
        {isProcessing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        ) : isRecording ? (
          <MicOff className="h-3.5 w-3.5 text-rose-400" />
        ) : (
          <Mic className="h-3.5 w-3.5 text-foreground-muted group-hover:text-foreground" />
        )}
        <span className="text-xs hidden sm:inline">
          {isProcessing ? "Transcribing..." : isRecording ? "Stop Dictating" : "Voice"}
        </span>
        {!isRecording && <ChevronUp className="h-3 w-3 text-foreground-subtle opacity-70 ml-0.5" />}
      </Button>
    </div>
  );
}
