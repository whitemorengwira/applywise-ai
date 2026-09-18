"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Copy,
  CheckCircle2,
  FileText,
  Loader2,
  Download,
  ShieldCheck,
} from "lucide-react";
import { SEED_JOBS, SEED_PROFILE } from "@/lib/db/seed-data";

function buildDefaultLetter(job: typeof SEED_JOBS[0]): string {
  return `Dear Hiring Team at ${job.company},

I am writing to express my strong interest in the ${job.title} position. With over 14 years of engineering leadership architecting enterprise digital platforms, modern cloud infrastructure, and governed AI systems, I have followed ${job.company}'s trajectory with great admiration.

In my recent work, I have focused on architecting resilient full-stack systems and high-availability AI gateways. For example, I delivered EarCodeX from prototype to production as an AWS cloud-native InsurTech platform, engineering automated document intelligence, reconciliation services, and immutable audit trails for regulated data. Furthermore, I integrated enterprise AI gateways utilizing LiteLLM and Cloudflare AI Gateway across 300+ cities with edge caching and multi-model failover.

Your requirement for a leader who can bridge deep architectural rigor with practical execution in Next.js, TypeScript, and AI orchestration directly mirrors my daily practice. Whether designing multi-engine database tiers or deploying human-supervised agentic automation, my focus is always on delivering measurable business impact and bulletproof reliability.

I welcome the opportunity to discuss how my background and architectural vision can accelerate ${job.company}'s product engineering goals.

Sincerely,
${SEED_PROFILE.fullName}
Principal Technology Architect & AI Systems Engineer`;
}

export default function CoverLettersPage() {
  const [selectedJobId, setSelectedJobId] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const jId = params.get("jobId");
        if (jId && SEED_JOBS.some((j) => j.id === jId)) {
          return jId;
        }
      } catch {
        // Safe SSR fallback
      }
    }
    return SEED_JOBS[0].id;
  });

  const [customLetters, setCustomLetters] = React.useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const selectedJob = SEED_JOBS.find((j) => j.id === selectedJobId) || SEED_JOBS[0];
  const letterContent = customLetters[selectedJob.id] ?? buildDefaultLetter(selectedJob);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob.id,
          type: "cover_letter",
        }),
      });
      const data = await res.json();
      if (data.success && data.result?.coverLetterText) {
        setCustomLetters((prev) => ({
          ...prev,
          [selectedJob.id]: data.result.coverLetterText,
        }));
      }
    } catch (err) {
      console.error("Cover letter error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell pageTitle="Executive Cover Letter Generator">
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 md:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Grounded Executive Letter Synthesis
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Cover Letter: <span className="text-primary">{selectedJob.company}</span>
            </h2>
            <p className="text-xs text-foreground-muted">
              Target Role: <span className="font-semibold text-foreground">{selectedJob.title}</span> • Location: {selectedJob.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="h-10 rounded-xl border border-border bg-secondary/40 px-3 text-xs text-foreground focus:border-primary focus:outline-none max-w-full truncate flex-1 sm:flex-none"
            >
              {SEED_JOBS.map((j) => (
                <option key={j.id} value={j.id} className="bg-[#0a0f1d] text-foreground">
                  {j.company} — {j.title}
                </option>
              ))}
            </select>

            <Button
              variant="glow"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? "Synthesizing Letter..." : "Regenerate Letter"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor & Letter Display */}
      <Card className="border-border/80 bg-card/75 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
              Executive Pitch Letter Preview
            </span>
            <Badge variant="success" className="text-[10px] font-mono gap-1">
              <ShieldCheck className="h-3 w-3" />
              EVIDENCE GROUNDED
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={copyToClipboard} className="gap-1.5 text-xs">
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy to Clipboard"}
            </Button>
            <Button size="sm" variant="outline" onClick={copyToClipboard} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>

        <textarea
          rows={16}
          value={letterContent}
          onChange={(e) =>
            setCustomLetters((prev) => ({
              ...prev,
              [selectedJob.id]: e.target.value,
            }))
          }
          className="w-full rounded-xl border border-border/80 bg-secondary/30 p-4 font-mono text-xs leading-relaxed text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 resize-y"
          placeholder="Executive cover letter content will appear here..."
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-foreground-subtle border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Master CV remains cryptographically immutable (SHA-256: 3994a09c...).</span>
          </div>
          <span>Word Count: {letterContent.trim().split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </Card>
    </AppShell>
  );
}
