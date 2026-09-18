"use client";

import * as React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
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
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

export function VoiceRecorder({ onTranscript, disabled = false, className = "" }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const recognitionRef = React.useRef<WebSpeechRecognitionInstance | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

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
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            onTranscript(transcript.trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn("[VoiceRecorder] Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onTranscript]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      audioChunksRef.current = [];

      // 1. Audio MediaStream for Whisper transcription
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
              if (data.success && data.text) {
                onTranscript(data.text);
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

      // 2. Also start instant Web Speech recognition for immediate feedback
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

  const stopRecording = () => {
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

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleRecording}
      disabled={disabled || isProcessing}
      className={`h-9 px-2.5 rounded-xl border transition-all select-none cursor-pointer flex items-center gap-1.5 ${
        isRecording
          ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          : "border-border/80 bg-secondary/30 text-foreground-muted hover:text-foreground hover:bg-secondary/60"
      } ${className}`}
      title={isRecording ? "Stop listening" : "Voice command (Whisper Speech-to-Text)"}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4 text-red-400" />
      ) : (
        <Mic className="h-4 w-4 text-primary" />
      )}
      <span className="text-[11px] font-mono hidden sm:inline">
        {isProcessing ? "Transcribing..." : isRecording ? "Listening..." : "Voice"}
      </span>
    </Button>
  );
}
