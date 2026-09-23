"use client";

import * as React from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Radio, Loader2, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceDeliberationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string) => Promise<string | void>;
  activeModelName?: string;
  activeGemName?: string;
}

type DeliberationStatus = "idle" | "listening" | "processing" | "speaking";

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
  onstart: () => void;
}

function cleanTextForSpeech(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, "Code block omitted.")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_#`~>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function VoiceDeliberationContent({
  onClose,
  onSendMessage,
  activeModelName,
  activeGemName,
}: Omit<VoiceDeliberationModalProps, "isOpen">) {
  const [status, setStatus] = React.useState<DeliberationStatus>("idle");
  const [userTranscript, setUserTranscript] = React.useState("");
  const [interimTranscript, setInterimTranscript] = React.useState("");
  const [lastAgentResponse, setLastAgentResponse] = React.useState("");
  const [isMuted, setIsMuted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const recognitionRef = React.useRef<WebSpeechRecognitionInstance | null>(null);
  const silenceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = React.useRef(true);
  const statusRef = React.useRef<DeliberationStatus>("idle");
  const isMutedRef = React.useRef(false);

  React.useEffect(() => {
    statusRef.current = status;
  }, [status]);

  React.useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Ref to hold handleDispatchDeliberation so callbacks never have stale closures
  const dispatchRef = React.useRef<(text: string) => Promise<void>>(async () => {});

  const startListening = React.useCallback(() => {
    if (isMutedRef.current) return;

    if (typeof window !== "undefined") {
      const windowObj = window as unknown as Record<string, unknown>;
      const SpeechConstructor = (windowObj.SpeechRecognition ||
        windowObj.webkitSpeechRecognition) as new () => WebSpeechRecognitionInstance;

      if (!SpeechConstructor) {
        setErrorMessage("Web Speech API is not supported in this browser. Please use Chrome or Edge.");
        return;
      }

      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }

        const recognition = new SpeechConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setStatus("listening");
          setErrorMessage(null);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interim = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interim += transcript;
            }
          }

          if (finalTranscript) {
            setUserTranscript((prev) => {
              const updated = (prev ? `${prev} ${finalTranscript}` : finalTranscript).trim();

              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = setTimeout(() => {
                dispatchRef.current(updated);
              }, 2200);

              return updated;
            });
          }

          setInterimTranscript(interim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (event.error !== "no-speech") {
            console.warn("[VoiceDeliberation] Speech recognition error:", event.error);
          }
        };

        recognition.onend = () => {
          if (statusRef.current === "listening" && !isMutedRef.current && isComponentMounted.current) {
            try {
              recognition.start();
            } catch {
              // Ignore
            }
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("[VoiceDeliberation] Could not start speech recognition:", err);
      }
    }
  }, []);

  // Speak AI response with British English voice
  const speakResponse = React.useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setStatus("listening");
        startListening();
        return;
      }

      window.speechSynthesis.cancel();
      const clean = cleanTextForSpeech(text);
      if (!clean) {
        setStatus("listening");
        startListening();
        return;
      }

      setStatus("speaking");
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "en-GB";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const gbVoice = voices.find((v) => v.lang.includes("en-GB") || v.lang.includes("en_GB"));
      if (gbVoice) {
        utterance.voice = gbVoice;
      }

      utterance.onend = () => {
        if (isComponentMounted.current) {
          setStatus("listening");
          startListening();
        }
      };

      utterance.onerror = () => {
        if (isComponentMounted.current) {
          setStatus("listening");
          startListening();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [startListening]
  );

  // Send collected prompt to agent
  const handleDispatchDeliberation = React.useCallback(
    async (textToDispatch: string) => {
      const trimmed = textToDispatch.trim();
      if (!trimmed || statusRef.current === "processing") return;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }

      setStatus("processing");
      setErrorMessage(null);

      try {
        const responseText = await onSendMessage(trimmed);
        setUserTranscript("");
        setInterimTranscript("");

        if (responseText && typeof responseText === "string") {
          setLastAgentResponse(responseText);
          speakResponse(responseText);
        } else {
          setStatus("listening");
          startListening();
        }
      } catch {
        setErrorMessage("Deliberation request failed. Re-opening microphone...");
        setStatus("listening");
        startListening();
      }
    },
    [onSendMessage, speakResponse, startListening]
  );

  React.useEffect(() => {
    dispatchRef.current = handleDispatchDeliberation;
  }, [handleDispatchDeliberation]);

  // Lifecycle on mount & unmount
  React.useEffect(() => {
    isComponentMounted.current = true;
    const timer = setTimeout(() => {
      startListening();
    }, 50);

    return () => {
      clearTimeout(timer);
      isComponentMounted.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [startListening]);

  // Stop speaking
  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (status === "speaking") {
      setStatus("listening");
      startListening();
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startListening();
    } else {
      setIsMuted(true);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#12161f] border border-border/80 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col p-6">
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-primary flex items-center justify-center shadow-lg">
              <Radio className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Voice Deliberation</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Two-Way
                </span>
              </div>
              <p className="text-xs text-foreground-subtle">
                {activeGemName} • {activeModelName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary text-foreground-muted hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            title="Exit voice deliberation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Soundwave Visualizer & Status Center */}
        <div className="py-8 flex flex-col items-center justify-center text-center relative z-10">
          <div className="h-20 flex items-center justify-center gap-1.5 mb-4">
            {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50].map((h, i) => {
              const isAnimated = status === "listening" || status === "speaking";
              const delay = (i * 0.1).toFixed(1);
              return (
                <span
                  key={i}
                  style={{
                    height: isAnimated ? `${Math.max(16, h)}%` : "12%",
                    animationDelay: `${delay}s`,
                  }}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    status === "speaking"
                      ? "bg-gradient-to-t from-primary to-cyan-400 animate-bounce"
                      : status === "listening"
                      ? "bg-gradient-to-t from-purple-500 to-pink-400 animate-pulse"
                      : status === "processing"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-neutral-600"
                  }`}
                />
              );
            })}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-border/80 text-xs font-mono mb-2">
            {status === "listening" && (
              <>
                <Mic className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                <span className="text-purple-300 font-semibold">Listening to your voice...</span>
              </>
            )}
            {status === "processing" && (
              <>
                <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-300 font-semibold">Agent deliberating response...</span>
              </>
            )}
            {status === "speaking" && (
              <>
                <Volume2 className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="text-primary font-semibold">Speaking response (British English)...</span>
              </>
            )}
            {status === "idle" && (
              <>
                <MicOff className="h-3.5 w-3.5 text-foreground-subtle" />
                <span className="text-foreground-subtle">Microphone paused</span>
              </>
            )}
          </div>

          <p className="text-[11px] text-foreground-subtle max-w-sm">
            Speak naturally. When you finish, the deliberation agent will analyze your context and respond aloud.
          </p>

          {errorMessage && (
            <p className="mt-2 text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Live Transcript Display Box */}
        <div className="bg-[#0b0e14] rounded-2xl border border-border/70 p-4 mb-5 max-h-48 overflow-y-auto space-y-3 relative z-10 scrollbar-thin">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-foreground-subtle flex items-center gap-1 mb-1">
              <span>You (Whitemore Ngwira)</span>
              {status === "listening" && (
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping ml-1" />
              )}
            </div>
            <div className="text-sm text-foreground leading-relaxed">
              {userTranscript || interimTranscript ? (
                <span>
                  {userTranscript} <span className="text-purple-400/80 italic">{interimTranscript}</span>
                </span>
              ) : (
                <span className="text-neutral-500 italic text-xs">
                  {status === "listening" ? "Say something like: 'Summarize my top 3 career achievements'..." : "No speech detected yet."}
                </span>
              )}
            </div>
          </div>

          {lastAgentResponse && (
            <div className="pt-2 border-t border-border/40">
              <div className="text-[10px] uppercase font-mono font-bold text-primary flex items-center gap-1 mb-1">
                <Sparkles className="h-3 w-3" />
                <span>{activeGemName} Response</span>
              </div>
              <div className="text-xs text-foreground-muted leading-relaxed max-h-24 overflow-y-auto pr-1">
                {lastAgentResponse}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60 relative z-10">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className={`rounded-xl px-3 h-9 text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                isMuted
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : "bg-secondary/60 text-foreground-muted hover:text-foreground"
              }`}
            >
              {isMuted ? <MicOff className="h-3.5 w-3.5 text-rose-400" /> : <Mic className="h-3.5 w-3.5 text-primary" />}
              <span>{isMuted ? "Unmute" : "Mute"}</span>
            </Button>

            {status === "speaking" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="rounded-xl px-3 h-9 text-xs font-mono bg-primary/20 text-primary border-primary/40 hover:bg-primary/30 flex items-center gap-1.5 cursor-pointer animate-pulse"
              >
                <VolumeX className="h-3.5 w-3.5" />
                <span>Stop Audio</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => handleDispatchDeliberation((userTranscript + " " + interimTranscript).trim())}
              disabled={status === "processing" || (!userTranscript.trim() && !interimTranscript.trim())}
              className="rounded-xl px-4 h-9 text-xs font-semibold bg-gradient-to-r from-purple-600 to-primary text-white hover:opacity-90 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              {status === "processing" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Deliberate</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="rounded-xl px-3 h-9 text-xs text-foreground-muted hover:text-foreground cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VoiceDeliberationModal({
  isOpen,
  onClose,
  onSendMessage,
  activeModelName = "Nemotron 3 Ultra",
  activeGemName = "Executive Career Strategist",
}: VoiceDeliberationModalProps) {
  if (!isOpen) return null;

  return (
    <VoiceDeliberationContent
      onClose={onClose}
      onSendMessage={onSendMessage}
      activeModelName={activeModelName}
      activeGemName={activeGemName}
    />
  );
}
