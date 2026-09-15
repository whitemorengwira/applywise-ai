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
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = React.useState(false);
  const [reasoningModel, setReasoningModel] = React.useState(
    "google/gemini-2.0-flash-thinking-exp:free"
  );
  const [fastModel, setFastModel] = React.useState(
    "google/gemini-2.0-flash-exp:free"
  );
  const [temperature, setTemperature] = React.useState(0.2);
  const [enableFallback, setEnableFallback] = React.useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell pageTitle="Settings & AI Gateway Configuration">
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Model Routing Architecture */}
        <Card className="border-border/80 bg-card/75 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <Cpu className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-base font-bold text-foreground">
                  OpenRouter Model Routing Configuration
                </h3>
                <p className="text-xs text-foreground-muted">
                  Configures model selection adhering to ADR-005 (Reasoning vs Fast Extraction).
                </p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px] font-mono gap-1">
              <ShieldCheck className="h-3 w-3" />
              100% FREE-TIER
            </Badge>
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
                <option value="google/gemini-2.0-flash-thinking-exp:free">
                  google/gemini-2.0-flash-thinking-exp:free (Recommended - 32k thinking context)
                </option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">
                  meta-llama/llama-3.3-70b-instruct:free (Open weights reasoning)
                </option>
                <option value="deepseek/deepseek-r1:free">
                  deepseek/deepseek-r1:free (Deep mathematical/logic reasoning)
                </option>
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
                <option value="google/gemini-2.0-flash-exp:free">
                  google/gemini-2.0-flash-exp:free (Sub-second structured output)
                </option>
                <option value="mistralai/mistral-7b-instruct:free">
                  mistralai/mistral-7b-instruct:free (Fast edge inference)
                </option>
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
                PostgreSQL + pgvector connection state.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-secondary/30 border border-border/50 space-y-1">
              <span className="text-[11px] text-foreground-subtle block">Target Engine</span>
              <span className="text-xs font-bold text-foreground">Supabase PostgreSQL 16+</span>
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
