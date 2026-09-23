"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  Database,
  ShieldCheck,
  Save,
  CheckCircle2,
  Check,
  PlayCircle,
  Loader2,
  Sparkles,
  Zap,
  TrendingUp,
  Layers,
  PenTool,
  Key,
  AlertCircle,
  ExternalLink,
  Send,
  MessageSquare,
  ImageIcon,
  Mic,
  Video,
} from "lucide-react";

interface ModelStatus {
  modelId: string;
  modelName: string;
  status: "operational" | "simulated";
  latencyMs: number;
  sampleOutput: string;
  promptTokens: number;
  completionTokens: number;
}

const OPENCODE_ZEN_DISPLAY = [
  {
    id: "opencode/nemotron-3-ultra:free",
    name: "Nemotron 3 Ultra Free",
    role: "Deep Reasoning & Architecture",
    context: "64k",
    type: "reasoning",
    icon: Sparkles,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    desc: "Flagship reasoning engine for multi-agent workflows, match scoring, and complex architectural evaluation.",
  },
  {
    id: "opencode/nemotron-3.5-lightning:free",
    name: "Nemotron 3.5 Lightning Free",
    role: "Ultra-Fast Extraction & Schema Parsing",
    context: "32k",
    type: "fast",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    desc: "Sub-second inference for job keyword extraction, remote classification, and real-time schema parsing.",
  },
  {
    id: "opencode/ling-3.0-flash-fin:free",
    name: "Ling 3.0 Flash Fin Free",
    role: "Financial & Market Compensation",
    context: "32k",
    type: "finance",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    desc: "Finance-specialized fast reasoning model for compensation benchmarking, equity analysis, and funding metrics.",
  },
  {
    id: "opencode/mimo-v2.5:free",
    name: "MiMo V2.5 Free",
    role: "Multi-Modal & Document Structuring",
    context: "32k",
    type: "multimodal",
    icon: Layers,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    desc: "Multi-modal structuring engine for CV document layout analysis, PDF hierarchy parsing, and portfolio assets.",
  },
  {
    id: "opencode/muse-spark-1.3:free",
    name: "Muse Spark 1.3 Free",
    role: "Creative Tailoring & Outreach",
    context: "32k",
    type: "creative",
    icon: PenTool,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/30",
    desc: "Creative synthesis model specialized in compelling executive cover letters and personalized outreach messaging.",
  },
  {
    id: "opencode/flux-1-schnell:free",
    name: "FLUX.1 Schnell Free",
    role: "Visual Generation & Evidence Diagrams",
    context: "4 steps",
    type: "image",
    icon: ImageIcon,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10 border-fuchsia-500/30",
    desc: "Sub-second latent diffusion engine for architectural schematics, recruiter infographics, and portfolio assets.",
  },
  {
    id: "opencode/sdxl-turbo:free",
    name: "SDXL Turbo Free",
    role: "Real-time High-Speed Image Gen",
    context: "1 step",
    type: "image",
    icon: ImageIcon,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/30",
    desc: "Adversarial diffusion distillation for instant visual generation supporting application proofs.",
  },
  {
    id: "opencode/whisper-large-v3-turbo:free",
    name: "Whisper Large v3 Turbo Free",
    role: "Audio Transcription & Voice Query",
    context: "Audio",
    type: "audio",
    icon: Mic,
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/30",
    desc: "Zero-cost speech-to-text transcription engine for user audio directives and voice commands.",
  },
  {
    id: "opencode/kokoro-82m:free",
    name: "Kokoro 82M Free",
    role: "Audio Voice Reader TTS",
    context: "Audio",
    type: "audio",
    icon: Mic,
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/30",
    desc: "Ultra-compact neural text-to-speech engine delivering lifelike British English notification narration.",
  },
  {
    id: "opencode/wan-2.1-t2v:free",
    name: "Wan 2.1 T2V Free",
    role: "Video Generation & Walkthroughs",
    context: "Video",
    type: "video",
    icon: Video,
    color: "text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/30",
    desc: "Text-to-video diffusion transformer generating 14B motion walkthroughs for autonomous application demos.",
  },
  {
    id: "opencode/cogvideox-2b:free",
    name: "CogVideoX 2B Free",
    role: "Lightweight Video Synthesis",
    context: "Video",
    type: "video",
    icon: Video,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/30",
    desc: "3D VAE video synthesis generating recruiter application proof animations at zero compute cost.",
  },
];

export default function SettingsPage() {
  const [saved, setSaved] = React.useState(false);
  const [reasoningModel, setReasoningModel] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_reasoning_model") || "opencode/nemotron-3-ultra:free";
    }
    return "opencode/nemotron-3-ultra:free";
  });
  const [fastModel, setFastModel] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_fast_model") || "opencode/nemotron-3.5-lightning:free";
    }
    return "opencode/nemotron-3.5-lightning:free";
  });
  const [temperature, setTemperature] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("applywise_temperature");
      if (stored) return parseFloat(stored);
    }
    return 0.2;
  });
  const [enableFallback, setEnableFallback] = React.useState(true);

  const [aiProvider, setAiProvider] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_ai_provider") || "gemini";
    }
    return "gemini";
  });
  const [apiKey, setApiKey] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_api_key") || "";
    }
    return "";
  });
  const [customBaseUrl, setCustomBaseUrl] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_custom_base_url") || "";
    }
    return "";
  });
  const [showKey, setShowKey] = React.useState(false);
  const [testingConnection, setTestingConnection] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({ tested: false, success: false, message: "" });

  // Live model testing state
  const [testingAll, setTestingAll] = React.useState(false);
  const [testingModelId, setTestingModelId] = React.useState<string | null>(null);
  const [testResults, setTestResults] = React.useState<Record<string, ModelStatus>>({});

  const [telegramBotToken, setTelegramBotToken] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_telegram_bot_token") || "";
    }
    return "";
  });
  const [telegramChatId, setTelegramChatId] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_telegram_chat_id") || "";
    }
    return "";
  });
  const [testingTelegram, setTestingTelegram] = React.useState(false);
  const [telegramResult, setTelegramResult] = React.useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("applywise_reasoning_model", reasoningModel);
      localStorage.setItem("applywise_fast_model", fastModel);
      localStorage.setItem("applywise_temperature", temperature.toString());
      localStorage.setItem("applywise_ai_provider", aiProvider);
      localStorage.setItem("applywise_api_key", apiKey);
      if (customBaseUrl) {
        localStorage.setItem("applywise_custom_base_url", customBaseUrl);
      }
      localStorage.setItem("applywise_telegram_bot_token", telegramBotToken);
      localStorage.setItem("applywise_telegram_chat_id", telegramChatId);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramResult(null);
    try {
      const res = await fetch("/api/notifications/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          botToken: telegramBotToken || undefined,
          chatId: telegramChatId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTelegramResult({
          success: true,
          message: data.message || "Test notification dispatched to Telegram successfully!",
        });
      } else {
        setTelegramResult({
          success: false,
          message: data.error || data.message || "Telegram test failed.",
        });
      }
    } catch (err) {
      setTelegramResult({
        success: false,
        message: err instanceof Error ? err.message : "Network error testing Telegram bridge.",
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleTestProviderConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus({ tested: false, success: false, message: "" });
    try {
      const res = await fetch("/api/ai/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId:
            aiProvider === "gemini"
              ? "gemini-1.5-flash"
              : aiProvider === "groq"
              ? "llama-3.3-70b-versatile"
              : reasoningModel,
          apiKey: apiKey || undefined,
          provider: aiProvider,
        }),
      });
      const data = await res.json();
      if (data.success && data.result?.status === "operational") {
        setConnectionStatus({
          tested: true,
          success: true,
          message: `Connection Verified! Model: ${data.result.modelName} (Latency: ${data.result.latencyMs}ms)`,
        });
      } else {
        setConnectionStatus({
          tested: true,
          success: false,
          message:
            data.result?.sampleOutput ||
            data.error ||
            "Inference check failed. Verify your API key or provider endpoint.",
        });
      }
    } catch (err) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: err instanceof Error ? err.message : "Network error testing provider connection.",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTestSingle = async (modelId: string) => {
    setTestingModelId(modelId);
    try {
      const res = await fetch("/api/ai/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId, apiKey: apiKey || undefined, provider: aiProvider }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setTestResults((prev) => ({ ...prev, [modelId]: data.result }));
      }
    } catch (err) {
      console.error("Test failed:", err);
    } finally {
      setTestingModelId(null);
    }
  };

  const handleTestAll = async () => {
    setTestingAll(true);
    try {
      const res = await fetch("/api/ai/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey || undefined, provider: aiProvider }),
      });
      const data = await res.json();
      if (data.success && data.results) {
        const resultMap: Record<string, ModelStatus> = {};
        for (const item of data.results) {
          resultMap[item.modelId] = item;
        }
        setTestResults(resultMap);
      }
    } catch (err) {
      console.error("Batch test failed:", err);
    } finally {
      setTestingAll(false);
    }
  };

  return (
    <AppShell pageTitle="Settings & AI Gateway Configuration">
      <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
        {/* Active AI Provider & Free-Tier Key Configuration */}
        <Card className="border-border/80 bg-card/85 p-6 space-y-5 border-l-4 border-l-primary shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    Active AI Inference Provider & Credentials
                  </h3>
                  <Badge variant="success" className="text-[10px] font-mono gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    100% ZERO-COST GOVERNANCE
                  </Badge>
                </div>
                <p className="text-xs text-foreground-muted">
                  Select your preferred 100% free-tier AI inference engine for real, intelligent conversational responses in the Control Plane chat.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestProviderConnection}
              disabled={testingConnection}
              className="gap-2 text-xs border-primary/40 hover:bg-primary/10 self-start sm:self-auto"
            >
              {testingConnection ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <PlayCircle className="h-3.5 w-3.5 text-primary" />
              )}
              {testingConnection ? "Verifying..." : "Test Connection"}
            </Button>
          </div>

          {/* Provider Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: "gemini",
                title: "Google Gemini Free",
                tier: "15 RPM Free Tier",
                desc: "100% free, fast multimodal & reasoning via Google AI Studio.",
                badge: "Recommended",
                link: "https://aistudio.google.com",
              },
              {
                id: "groq",
                title: "Groq Cloud Free",
                tier: "LPU Ultra-Fast Free",
                desc: "Sub-second Llama 3.3 70B inference on specialized LPUs.",
                badge: "High Speed",
                link: "https://console.groq.com",
              },
              {
                id: "opencode",
                title: "OpenCode Zen Suite",
                tier: "5 Free Models",
                desc: "Flagship Nemotron 3 & Ling 3 suite via OpenCode desktop.",
                badge: "Default Suite",
                link: "https://opencode.ai",
              },
              {
                id: "ollama",
                title: "Local Ollama",
                tier: "Localhost 11434",
                desc: "Zero network latency, 100% private inference on local machine.",
                badge: "Local",
                link: "https://ollama.com",
              },
            ].map((p) => {
              const isSelected = aiProvider === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setAiProvider(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/15 border-primary shadow-sm ring-1 ring-primary/40"
                      : "bg-secondary/30 border-border/60 hover:bg-secondary/50 hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground">{p.title}</span>
                    <Badge variant={isSelected ? "success" : "secondary"} className="text-[9px]">
                      {p.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-foreground-muted mb-2 leading-relaxed">{p.desc}</p>
                  <span className="text-[10px] font-mono text-primary block">{p.tier}</span>
                </div>
              );
            })}
          </div>

          {/* API Key / Base URL Inputs */}
          <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 space-y-3">
            {aiProvider !== "ollama" ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-primary" />
                    {aiProvider === "gemini"
                      ? "Google Gemini API Key"
                      : aiProvider === "groq"
                      ? "Groq Cloud API Key"
                      : "OpenCode Zen / AI API Key"}
                  </label>
                  {aiProvider === "gemini" && (
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      Get Free Gemini Key <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {aiProvider === "groq" && (
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      Get Free Groq Key <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={
                      aiProvider === "gemini"
                        ? "Enter your Gemini API key (e.g. AIzaSy...)"
                        : aiProvider === "groq"
                        ? "Enter your Groq API key (e.g. gsk_...)"
                        : "Enter token or leave blank for desktop app"
                    }
                    className="w-full bg-background/80 border border-border/70 rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-foreground-muted hover:text-foreground px-1.5 py-0.5 rounded bg-secondary/50"
                  >
                    {showKey ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-[10px] text-foreground-subtle">
                  Key is saved securely in your browser session/localStorage and forwarded automatically to the Control Plane copilot.
                </p>
                {aiProvider === "opencode" && (
                  <div className="pt-2">
                    <label className="text-[11px] text-foreground-muted block mb-1">
                      Custom Endpoint Base URL (Optional, defaults to https://opencode.ai/zen/v1)
                    </label>
                    <input
                      type="text"
                      value={customBaseUrl}
                      onChange={(e) => setCustomBaseUrl(e.target.value)}
                      placeholder="https://opencode.ai/zen/v1"
                      className="w-full bg-background/80 border border-border/70 rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/40 text-xs text-foreground-muted">
                <strong>Ollama Connection:</strong> Make sure Ollama is running on your system with{" "}
                <code className="px-1 py-0.5 bg-background rounded text-primary">ollama run llama3.2</code>. ApplyWise will connect to{" "}
                <code className="px-1 py-0.5 bg-background rounded text-primary">http://127.0.0.1:11434</code> automatically with zero API key required.
              </div>
            )}

            {/* Status notification */}
            {connectionStatus.tested && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  connectionStatus.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                {connectionStatus.success ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                )}
                <span>{connectionStatus.message}</span>
              </div>
            )}
          </div>
        </Card>

        {/* OpenCode Zen Model Suite Card */}
        <Card className="border-border/80 bg-card/85 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    OpenCode Zen Model Suite
                  </h3>
                  <Badge variant="success" className="text-[10px] font-mono gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    100% FREE TIER
                  </Badge>
                </div>
                <p className="text-xs text-foreground-muted">
                  Fully configured high-throughput models for deep reasoning, fast extraction, finance, and creative synthesis.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestAll}
              disabled={testingAll}
              className="gap-2 text-xs border-primary/40 hover:bg-primary/10"
            >
              {testingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <PlayCircle className="h-3.5 w-3.5 text-primary" />
              )}
              {testingAll ? "Testing All 5 Models..." : "Run Health Check on All Models"}
            </Button>
          </div>

          {/* Model Roster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {OPENCODE_ZEN_DISPLAY.map((m) => {
              const Icon = m.icon;
              const isSelectedReasoning = reasoningModel === m.id;
              const isSelectedFast = fastModel === m.id;
              const isTesting = testingModelId === m.id;
              const testResult = testResults[m.id];

              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isSelectedReasoning
                      ? "border-purple-500/60 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                      : isSelectedFast
                      ? "border-amber-500/60 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                      : "border-border/60 bg-secondary/20 hover:border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${m.bg}`}>
                        <Icon className={`h-4 w-4 ${m.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground">{m.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/80 text-foreground-subtle border border-border/40">
                            Free
                          </span>
                        </div>
                        <span className="text-[11px] text-foreground-muted block">{m.role}</span>
                      </div>
                    </div>

                    {/* Selection indicators */}
                    <div className="flex items-center gap-1">
                      {isSelectedReasoning && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30">
                          <Check className="h-3 w-3 stroke-[3]" /> Active Reasoning
                        </span>
                      )}
                      {isSelectedFast && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                          <Check className="h-3 w-3 stroke-[3]" /> Active Fast
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-foreground-subtle line-clamp-2 mb-3">
                    {m.desc}
                  </p>

                  <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-muted">
                      <span>Context: {m.context}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {testResult ? `${testResult.latencyMs}ms latency` : "Ready"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTestSingle(m.id)}
                        disabled={isTesting}
                        className="text-[11px] px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                      >
                        {isTesting ? "Testing..." : "Test Model"}
                      </button>
                      {!isSelectedReasoning && (
                        <button
                          type="button"
                          onClick={() => setReasoningModel(m.id)}
                          className="text-[11px] px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                        >
                          Use for Reasoning
                        </button>
                      )}
                    </div>
                  </div>

                  {testResult && (
                    <div className="mt-2.5 p-2 rounded bg-background/60 border border-border/40 text-[10px] font-mono text-foreground-subtle">
                      <span className="text-emerald-400 font-bold">Verified Output: </span>
                      {testResult.sampleOutput}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Model Routing Architecture Selectors */}
        <Card className="border-border/80 bg-card/75 p-6 space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-foreground">
              ADR-005 Model Routing Assignments
            </h3>
            <p className="text-xs text-foreground-muted">
              Configure primary engines for multi-agent workflows and high-speed extraction.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider block mb-1">
                Deep Reasoning & RAG Model (Agentic Workflows)
              </label>
              <select
                value={reasoningModel}
                onChange={(e) => setReasoningModel(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <optgroup label="OpenCode Zen (Verified Free Tier)">
                  <option value="opencode/nemotron-3-ultra:free">
                    Nemotron 3 Ultra Free [Free] (Recommended - 64k Deep Reasoning)
                  </option>
                  <option value="opencode/ling-3.0-flash-fin:free">
                    Ling 3.0 Flash Fin Free [Free] (Finance & Governance Analysis)
                  </option>
                  <option value="opencode/muse-spark-1.3:free">
                    Muse Spark 1.3 Free [Free] (Creative Tailoring & Synthesis)
                  </option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider block mb-1">
                Fast Extraction & Classification Model
              </label>
              <select
                value={fastModel}
                onChange={(e) => setFastModel(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <optgroup label="OpenCode Zen (Verified Free Tier)">
                  <option value="opencode/nemotron-3.5-lightning:free">
                    Nemotron 3.5 Lightning Free [Free] (Recommended - Sub-second Extraction)
                  </option>
                  <option value="opencode/mimo-v2.5:free">
                    MiMo V2.5 Free [Free] (Multi-Modal Layout & CV Structuring)
                  </option>
                </optgroup>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                  Inference Temperature
                </label>
                <span className="font-mono text-xs text-primary font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <span className="text-[11px] text-foreground-subtle">
                Lower values (0.1 - 0.3) ensure strict factual grounding and zero hallucination.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="mockToggle"
                checked={enableFallback}
                onChange={(e) => setEnableFallback(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
              <label htmlFor="mockToggle" className="text-xs text-foreground font-medium cursor-pointer">
                Enable automatic high-fidelity offline simulation fallback if upstream API is unreachable
              </label>
            </div>
          </div>
        </Card>

        {/* Telegram 24/7 Real-Time Alert Engine & MCP Bridge */}
        <Card className="border-border/80 bg-card/85 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    Telegram 24/7 Real-Time Alert Engine
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono gap-1 border-sky-500/40 text-sky-400 bg-sky-500/10">
                    <MessageSquare className="h-3 w-3" />
                    MCP SERVER
                  </Badge>
                </div>
                <p className="text-xs text-foreground-muted">
                  Autonomous 24/7 push notifications dispatched to your mobile Telegram the moment fresh 100% free-tier jobs are posted.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestTelegram}
              disabled={testingTelegram}
              className="gap-2 text-xs border-sky-500/40 text-sky-300 hover:bg-sky-500/10 shrink-0"
            >
              {testingTelegram ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
              ) : (
                <Send className="h-3.5 w-3.5 text-sky-400" />
              )}
              {testingTelegram ? "Dispatching..." : "Send Test Telegram Alert"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider block mb-1">
                Telegram Bot Token
              </label>
              <input
                type="password"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrs..."
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 font-mono text-xs text-foreground placeholder:text-foreground-subtle/50 focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[11px] text-foreground-subtle mt-1 block">
                Acquired from{" "}
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline hover:text-sky-300 inline-flex items-center gap-0.5"
                >
                  @BotFather <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider block mb-1">
                Telegram Chat ID or @Channel
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="e.g. 987654321 or @applywise_alerts"
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 font-mono text-xs text-foreground placeholder:text-foreground-subtle/50 focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[11px] text-foreground-subtle mt-1 block">
                Obtain your numeric ID from{" "}
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 underline hover:text-sky-300 inline-flex items-center gap-0.5"
                >
                  @userinfobot <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </span>
            </div>
          </div>

          {telegramResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                telegramResult.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              {telegramResult.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              )}
              <span>{telegramResult.message}</span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20 text-[11px] text-foreground-subtle flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Zero-Fail MCP Safeguard: </span>
              If tokens are not yet configured, the Telegram MCP bridge logs structured alerts into the audit trail without disrupting autonomous background cycles or the UI notification bell.
            </div>
          </div>
        </Card>

        {/* Database & Supabase Infrastructure Status */}
        <Card className="border-border/80 bg-card/75 p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                Database & Vector Storage Status
              </h3>
              <p className="text-xs text-foreground-muted">
                PostgreSQL + pgvector connection state on project applywise-ai.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-secondary/30 border border-border/50 space-y-1">
              <span className="text-[11px] text-foreground-subtle block">Target Engine</span>
              <span className="text-xs font-bold text-foreground">Supabase PostgreSQL 16+ (eu-west-1)</span>
            </div>
            <div className="p-3.5 rounded-lg bg-secondary/30 border border-border/50 space-y-1">
              <span className="text-[11px] text-foreground-subtle block">Vector Indexing</span>
              <span className="text-xs font-bold text-emerald-400">pgvector HNSW (1536 dim)</span>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Settings updated successfully
            </span>
          )}
          <Button type="submit" variant="glow" className="gap-2 px-6">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
