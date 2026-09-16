"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Cpu,
  Clock,
  Coins,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  taskType: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  success: boolean;
  createdAt: string;
}

interface AuditState {
  logs: AuditLogEntry[];
  summary: {
    totalOperations: number;
    totalTokens: number;
    avgLatencyMs: number;
    estimatedCostUSD: number;
  };
}

export default function AnalyticsPage() {
  const [auditData] = React.useState<AuditState>({
    logs: [
      {
        id: "log-1",
        taskType: "match_scoring",
        model: "google/gemini-2.0-flash-thinking-exp:free",
        promptTokens: 420,
        completionTokens: 280,
        latencyMs: 1420,
        success: true,
        createdAt: "Just now",
      },
      {
        id: "log-2",
        taskType: "cv_tailoring",
        model: "google/gemini-2.0-flash-thinking-exp:free",
        promptTokens: 890,
        completionTokens: 610,
        latencyMs: 2310,
        success: true,
        createdAt: "5m ago",
      },
      {
        id: "log-3",
        taskType: "agentic_rag",
        model: "google/gemini-2.0-flash-thinking-exp:free",
        promptTokens: 350,
        completionTokens: 290,
        latencyMs: 1180,
        success: true,
        createdAt: "15m ago",
      },
      {
        id: "log-4",
        taskType: "cover_letter_generation",
        model: "google/gemini-2.0-flash-thinking-exp:free",
        promptTokens: 620,
        completionTokens: 480,
        latencyMs: 1890,
        success: true,
        createdAt: "30m ago",
      },
    ],
    summary: {
      totalOperations: 48,
      totalTokens: 34290,
      avgLatencyMs: 1450,
      estimatedCostUSD: 0.0,
    },
  });

  const funnelStages = [
    { label: "Discovered Roles", count: 84, rate: "100%" },
    { label: "High Fit (>85%)", count: 52, rate: "61.9%" },
    { label: "Tailored Applications", count: 28, rate: "33.3%" },
    { label: "Submitted Applications", count: 16, rate: "19.0%" },
    { label: "Interview Invitations", count: 7, rate: "43.7% interview rate" },
  ];

  const skillDemand = [
    { skill: "Next.js 15 / React Server Components", demand: 96, growth: "+28%" },
    { skill: "TypeScript (Strict / Full-Stack)", demand: 94, growth: "+22%" },
    { skill: "AI Model Routing & Gateways (LiteLLM)", demand: 92, growth: "+84%" },
    { skill: "PostgreSQL & pgvector RAG", demand: 90, growth: "+65%" },
    { skill: "LangChain & LangGraph Multi-Agent", demand: 86, growth: "+92%" },
    { skill: "Infrastructure as Code (Terraform)", demand: 84, growth: "+14%" },
  ];

  return (
    <AppShell pageTitle="Executive Analytics & AI Observability">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/70 bg-card/70 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-foreground-subtle flex items-center justify-between">
            AI Total Inference Cost
            <Coins className="h-4 w-4 text-emerald-400" />
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400">$0.00 USD</div>
          <p className="text-[11px] text-foreground-subtle">
            100% Free-Tier (OpenCode Zen Suite • FREE_ONLY_MODE=true)
          </p>
        </Card>

        <Card className="border-border/70 bg-card/70 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-foreground-subtle flex items-center justify-between">
            Tokens Processed
            <Cpu className="h-4 w-4 text-primary" />
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">
            {auditData.summary.totalTokens.toLocaleString()}
          </div>
          <p className="text-[11px] text-foreground-subtle">
            Across {auditData.summary.totalOperations} total AI operations
          </p>
        </Card>

        <Card className="border-border/70 bg-card/70 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-foreground-subtle flex items-center justify-between">
            Average Gateway Latency
            <Clock className="h-4 w-4 text-amber-400" />
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">
            {auditData.summary.avgLatencyMs} ms
          </div>
          <p className="text-[11px] text-foreground-subtle">
            Edge cached & optimized prompt sizes
          </p>
        </Card>

        <Card className="border-border/70 bg-card/70 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-foreground-subtle flex items-center justify-between">
            Application-to-Interview Rate
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400">43.7%</div>
          <p className="text-[11px] text-foreground-subtle">
            3.6x industry average (12%)
          </p>
        </Card>
      </div>

      {/* Funnel & Skills Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <Card className="border-border/80 bg-card/75 p-6 space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Application Pipeline Conversion Funnel
          </h3>

          <div className="space-y-3">
            {funnelStages.map((st, i) => (
              <div key={st.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{st.label}</span>
                  <span className="font-mono text-primary font-bold">
                    {st.count} roles ({st.rate})
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${100 - i * 18}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Demand Heatmap */}
        <Card className="border-border/80 bg-card/75 p-6 space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            High-Value Skill Demand Heatmap
          </h3>

          <div className="space-y-2.5">
            {skillDemand.map((sd) => (
              <div
                key={sd.skill}
                className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/50 text-xs"
              >
                <span className="font-medium text-foreground">{sd.skill}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="highMatch" className="text-[10px] font-mono">
                    {sd.growth} YoY
                  </Badge>
                  <span className="font-mono text-emerald-400 font-bold">{sd.demand}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Operation Audit Log Table */}
      <Card className="border-border/80 bg-card/75 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Live AI Gateway Execution Logs
          </h3>
          <Badge variant="success" className="text-[10px] font-mono gap-1">
            <ShieldCheck className="h-3 w-3" />
            AUDIT TRAIL ACTIVE
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-foreground-subtle uppercase text-[10px]">
                <th className="pb-2">Task Type</th>
                <th className="pb-2">Model</th>
                <th className="pb-2">Tokens</th>
                <th className="pb-2">Latency</th>
                <th className="pb-2">Cost</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {auditData.logs.map((log: AuditLogEntry) => (
                <tr key={log.id} className="hover:bg-secondary/20">
                  <td className="py-2.5 font-sans font-medium text-foreground capitalize">
                    {log.taskType.replace(/_/g, " ")}
                  </td>
                  <td className="py-2.5 text-primary text-[10px] truncate max-w-[200px]">
                    {log.model}
                  </td>
                  <td className="py-2.5 text-foreground-muted">
                    {log.promptTokens + log.completionTokens}
                  </td>
                  <td className="py-2.5 text-foreground-muted">{log.latencyMs}ms</td>
                  <td className="py-2.5 text-emerald-400">$0.00</td>
                  <td className="py-2.5">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px]">
                      SUCCESS
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-foreground-subtle">{log.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
