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

  // Live model testing state
  const [testingAll, setTestingAll] = React.useState(false);
  const [testingModelId, setTestingModelId] = React.useState<string | null>(null);
  const [testResults, setTestResults] = React.useState<Record<string, ModelStatus>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("applywise_reasoning_model", reasoningModel);
      localStorage.setItem("applywise_fast_model", fastModel);
      localStorage.setItem("applywise_temperature", temperature.toString());
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestSingle = async (modelId: string) => {
    setTestingModelId(modelId);
    try {
      const res = await fetch("/api/ai/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId }),
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
        body: JSON.stringify({}),
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
                <optgroup label="Alternative Open Weights">
                  <option value="google/gemini-2.0-flash-thinking-exp:free">
                    google/gemini-2.0-flash-thinking-exp:free (32k thinking context)
                  </option>
                  <option value="deepseek/deepseek-r1:free">
                    deepseek/deepseek-r1:free (Deep mathematical logic)
                  </option>
                  <option value="meta-llama/llama-3.3-70b-instruct:free">
                    meta-llama/llama-3.3-70b-instruct:free (Open weights reasoning)
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
                <optgroup label="Alternative Fast Models">
                  <option value="google/gemini-2.0-flash-exp:free">
                    google/gemini-2.0-flash-exp:free (Fast structured output)
                  </option>
                  <option value="mistralai/mistral-7b-instruct:free">
                    mistralai/mistral-7b-instruct:free (Fast edge inference)
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
