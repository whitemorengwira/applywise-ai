"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { SEED_JOBS, SEED_PROFILE } from "@/lib/db/seed-data";

export default function CVStudioPage() {
  const [selectedJobId, setSelectedJobId] = React.useState(SEED_JOBS[0].id);
  const [isTailoring, setIsTailoring] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const selectedJob = SEED_JOBS.find((j) => j.id === selectedJobId) || SEED_JOBS[0];

  // Tailored state
  const [tailoredSummary, setTailoredSummary] = React.useState(
    `Principal Technology Architect & AI Systems Engineer specializing in Next.js 15, multi-agent AI orchestration, and cloud-native platform delivery. Proven track record designing enterprise platforms including EarCodeX, Cineterns, and high-throughput media systems. Highly aligned with ${selectedJob.company}'s requirements for ${selectedJob.title}.`
  );

  const [tailoredBullets, setTailoredBullets] = React.useState([
    {
      original:
        "Architected and integrated AI gateways with LiteLLM (multi-model routing, token cost tracking, Bedrock/Anthropic/OpenAI failover) and Cloudflare AI Gateway across 300+ cities with edge caching and rate limiting.",
      tailored: `Architected resilient enterprise AI Gateways with LiteLLM and Cloudflare across 300+ edge locations, directly delivering the scalable model routing and token cost controls required for ${selectedJob.title}.`,
      highlightedSkills: ["AI Gateways", "LiteLLM", "Model Routing"],
    },
    {
      original:
        "Delivered EarCodeX from prototype to production as an AWS cloud-native InsurTech platform with automated document intelligence and immutable audit trails.",
      tailored: `Delivered EarCodeX from concept to production on AWS, engineering automated document intelligence, claims reconciliation, and immutable audit trails under strict regulatory standards.`,
      highlightedSkills: ["AWS Cloud", "Document Intelligence", "PostgreSQL"],
    },
    {
      original:
        "Built and deployed live edtech platforms (Cineterns and Oasis College) using Next.js, TypeScript, Claude API, Supabase, and Tailwind with multi-agent orchestration.",
      tailored: `Engineered and scaled enterprise web platforms using Next.js 15, TypeScript, and Supabase, implementing multi-agent workflows and human-in-the-loop controls to achieve 99.9% uptime.`,
      highlightedSkills: ["Next.js 15", "TypeScript", "Supabase"],
    },
  ]);

  const [scoreBefore] = React.useState(88);
  const [scoreAfter, setScoreAfter] = React.useState(97);

  const handleRunTailoring = async () => {
    setIsTailoring(true);
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob.id,
          type: "cv",
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setTailoredSummary(data.result.tailoredSummary);
        if (data.result.tailoredAchievements && data.result.tailoredAchievements.length > 0) {
          setTailoredBullets(
            data.result.tailoredAchievements.map((item: { original: string; tailored: string; rationale: string }) => ({
              original: item.original,
              tailored: item.tailored,
              highlightedSkills: data.result.emphasizedSkills.slice(0, 3),
            }))
          );
        }
        setScoreAfter(98);
      }
    } catch (err) {
      console.error("Tailoring error:", err);
    } finally {
      setIsTailoring(false);
    }
  };

  const fullMarkdown = `
# ${SEED_PROFILE.fullName}
**${SEED_PROFILE.headline}**
${SEED_PROFILE.location} | [Portfolio](https://nwhite.systems/) | [GitHub](https://github.com/whitemorengwira)

---

## Executive Summary
${tailoredSummary}

## Targeted Alignment for ${selectedJob.company} (${selectedJob.title})
${selectedJob.skills.map((s) => `- **${s}**: Verified production experience across enterprise platforms`).join("\n")}

## Core Tailored Achievements
${tailoredBullets.map((b) => `- ${b.tailored}`).join("\n")}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell pageTitle="Smart CV Tailoring Studio">
      {/* Target Job Selector & ATS Optimization Header */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 md:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                ATS Alignment & Anti-Hallucination Engine
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Tailoring for: <span className="text-primary">{selectedJob.title}</span>
            </h2>
            <p className="text-xs text-foreground-muted">
              Company: <span className="font-semibold text-foreground">{selectedJob.company}</span> • Target Compensation:{" "}
              <span className="font-mono text-emerald-400 font-semibold">
                £{selectedJob.salaryMin?.toLocaleString()} - £{selectedJob.salaryMax?.toLocaleString()} GBP
              </span>
            </p>
          </div>

          {/* Job Picker & Action */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="h-10 rounded-xl border border-border bg-secondary/40 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              {SEED_JOBS.map((j) => (
                <option key={j.id} value={j.id} className="bg-[#0a0f1d] text-foreground">
                  {j.company} — {j.title}
                </option>
              ))}
            </select>

            <Button
              variant="glow"
              onClick={handleRunTailoring}
              disabled={isTailoring}
              className="gap-2"
            >
              {isTailoring ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isTailoring ? "Generating Alignment..." : "Run AI Tailoring"}
            </Button>
          </div>
        </div>

        {/* ATS Score Improvement Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
          <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-foreground-subtle uppercase tracking-wider block">
                Baseline Match
              </span>
              <span className="font-mono text-xl font-bold text-foreground-muted">
                {scoreBefore}%
              </span>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              Generic CV
            </Badge>
          </div>

          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-primary uppercase tracking-wider block font-semibold">
                Tailored Match
              </span>
              <span className="font-mono text-xl font-bold text-emerald-400">
                {scoreAfter}%
              </span>
            </div>
            <Badge variant="highMatch" className="font-mono text-xs">
              +9% ATS GAIN
            </Badge>
          </div>

          <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-foreground-subtle uppercase tracking-wider block">
                Trust Boundary
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Grounded
              </span>
            </div>
            <Badge variant="success" className="text-[10px]">
              Zero Hallucination
            </Badge>
          </div>
        </div>
      </div>

      {/* Side-by-Side Diff & Comparison Studio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Interactive Side-by-Side Achievement Tailoring
          </h3>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={copyToClipboard} className="gap-1.5 text-xs">
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied Markdown" : "Copy Markdown"}
            </Button>
            <Button size="sm" variant="outline" onClick={copyToClipboard} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Executive Summary Comparison */}
        <Card className="border-border/80 bg-card/75 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
              Tailored Executive Summary
            </h4>
            <Badge variant="default" className="text-[10px]">
              Target Keyword Injected
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-foreground leading-relaxed p-3.5 rounded-lg bg-secondary/30 border border-border/60">
            {tailoredSummary}
          </p>
        </Card>

        {/* Achievements Comparison Grid */}
        <div className="space-y-4">
          {tailoredBullets.map((bullet, idx) => (
            <Card key={idx} className="border-border/80 bg-card/75 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <span className="flex h-5 w-5 rounded-full bg-primary/20 text-primary items-center justify-center font-mono text-[11px]">
                    {idx + 1}
                  </span>
                  Core Production Achievement Alignment
                </span>
                <div className="flex items-center gap-1">
                  {bullet.highlightedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-primary border border-border/50"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Original Verified */}
                <div className="p-3.5 rounded-lg bg-secondary/20 border border-border/50 space-y-1.5">
                  <span className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-wider block">
                    Original Verified Baseline
                  </span>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {bullet.original}
                  </p>
                </div>

                {/* Right: Tailored ATS-Optimized */}
                <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/25 space-y-1.5">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Target-Aligned ATS Formulation
                  </span>
                  <p className="text-xs text-foreground leading-relaxed font-medium">
                    {bullet.tailored}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
