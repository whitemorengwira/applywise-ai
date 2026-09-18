import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Briefcase,
  Target,
  FileCheck2,
  BrainCircuit,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  Clock,
} from "lucide-react";
import { FreshnessService } from "@/lib/services/freshness.service";

export default function Home() {
  const kpiStats = [
    {
      title: "Average Match Quality",
      value: "94.2%",
      change: "+4.5% vs baseline CV",
      positive: true,
      icon: Target,
      badge: "Optimal Fit",
    },
    {
      title: "Curated Roles Discovered",
      value: "84",
      change: "12 added today",
      positive: true,
      icon: Briefcase,
      badge: "Adzuna Live",
    },
    {
      title: "Active Pipeline Applications",
      value: "16",
      change: "4 in final technical rounds",
      positive: true,
      icon: Layers,
      badge: "In Progress",
    },
    {
      title: "AI Documents Tailored",
      value: "38",
      change: "100% grounded in verified CV",
      positive: true,
      icon: FileCheck2,
      badge: "Zero Hallucination",
    },
  ];

  const curatedCandidateJobs = [
    {
      id: "job-101",
      title: "Lead Solutions Architect (AI & Cloud Platforms)",
      company: "Entelect",
      location: "Johannesburg, South Africa (Hybrid / Remote Option)",
      salary: "R 1,350,000 - R 1,850,000 ZAR",
      score: 97,
      tier: "highMatch" as const,
      matchedTags: ["Next.js 15", "LangGraph", "TypeScript", "pgvector", "SaaS Architecture"],
      criticalGap: "None",
      applied: true,
      stage: "Technical Architecture Interview",
      postedAt: "2026-09-17T09:00:00Z",
    },
    {
      id: "job-sa-201",
      title: "Principal Agentic AI Systems Architect",
      company: "Synthesia",
      location: "Johannesburg, South Africa / Remote",
      salary: "R 1,400,000 - R 2,000,000 ZAR",
      score: 95,
      tier: "highMatch" as const,
      matchedTags: ["Multi-Agent RAG", "Python / TypeScript", "System Design", "Cloud Infrastructure"],
      criticalGap: "Kubernetes (Minor)",
      applied: true,
      stage: "CV Screen Passed",
      postedAt: "2026-09-16T14:30:00Z",
    },
    {
      id: "job-102",
      title: "AI Solutions Architect",
      company: "IQbusiness",
      location: "Johannesburg, South Africa (Hybrid)",
      salary: "R 1,450,000 - R 1,950,000 ZAR",
      score: 94,
      tier: "highMatch" as const,
      matchedTags: ["AWS Bedrock", "Generative AI", "Agentic Pipelines", "Solutions Architecture"],
      criticalGap: "None",
      applied: false,
      stage: "Ready to Tailor",
      postedAt: "2026-09-16T11:00:00Z",
    },
    {
      id: "job-zw-202",
      title: "Lead Cloud & AI Solutions Architect",
      company: "Econet Wireless",
      location: "Harare, Zimbabwe / Remote",
      salary: "$120,000 - $155,000 USD",
      score: 92,
      tier: "highMatch" as const,
      matchedTags: ["AWS Cloud", "LiteLLM Routing", "Terraform", "PostgreSQL", "Zero-Trust"],
      criticalGap: "None",
      applied: false,
      stage: "Ready to Tailor",
      postedAt: "2026-09-15T12:00:00Z",
    },
  ];

  // Enforce Section 5 Staleness Filter: Automatically eliminate stale jobs older than 30 days
  const highMatchJobs = FreshnessService.filterFreshJobs(curatedCandidateJobs);

  return (
    <AppShell pageTitle="Executive Dashboard">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-[#0d172a] to-background p-6 md:p-8 shadow-[0_0_35px_rgba(14,165,233,0.1)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Autonomous Agentic Pipeline Active
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Candidate: <span className="text-primary font-mono">N. White</span> — Principal AI & Full-Stack Architect
            </h2>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Autonomous job matching operating system orchestrating multi-vector pgvector semantic search,
              cryptographic master CV protection, and agentic LLM routing via OpenCode Zen free tiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="glow" className="gap-2" asChild>
              <Link href="/jobs">
                <Search className="h-4 w-4" />
                Scan Opportunities
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/cover-letters">
                <Sparkles className="h-4 w-4 text-primary" />
                Cover Letter Studio
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="relative overflow-hidden border-border/70 bg-card/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-foreground-muted">
                  {kpi.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-secondary/80 flex items-center justify-center text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    {kpi.value}
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    {kpi.badge}
                  </Badge>
                </div>
                <p className="text-[11px] text-foreground-subtle flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-400 inline" />
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Central Split: Highest Fit Opportunities & Agentic Architecture Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Curated High-Compatibility Roles
              </h3>
              <p className="text-xs text-foreground-muted">
                Synthesized across multi-vector pgvector RAG analysis against verified engineering credentials.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/jobs" className="gap-1 text-xs text-primary hover:text-primary/90">
                View All 84 <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {highMatchJobs.map((job) => (
              <Card
                key={job.id}
                className="border-border/80 bg-card/70 hover:border-primary/50 transition-all p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm md:text-base text-foreground hover:text-primary transition-colors">
                        {job.title}
                      </h4>
                      <Badge variant={job.tier} className="text-xs font-mono">
                        {job.score}% MATCH
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground-muted flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{job.company}</span>
                      <span className="text-foreground-subtle">•</span>
                      <span className="text-foreground-subtle">{job.location}</span>
                      <span className="text-foreground-subtle">•</span>
                      <span className="font-mono text-emerald-400 font-semibold">{job.salary}</span>
                      <span className="text-foreground-subtle">•</span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-cyan-400">
                        <Clock className="h-3 w-3 inline text-cyan-400" />
                        {FreshnessService.formatPostingAge(job.postedAt)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.applied ? (
                      <Badge variant="secondary" className="text-xs">
                        {job.stage}
                      </Badge>
                    ) : (
                      <Button size="sm" variant="glow" asChild>
                        <Link href={`/cover-letters?jobId=${job.id}`}>Tailor Cover Letter</Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-foreground-subtle mr-1">Matched Skills:</span>
                  {job.matchedTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary/80 text-foreground-muted border border-border/60"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.criticalGap !== "None" && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 ml-auto">
                      Gap: {job.criticalGap}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI & Architecture Stack Showcase (1 Col) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-primary" />
              Agentic AI Architecture
            </h3>
            <p className="text-xs text-foreground-muted">
              Technical implementation highlights and engineering stack.
            </p>
          </div>

          <Card className="border-border/80 bg-card/70 p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                <Cpu className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-foreground">OpenCode Zen Free Suite</h5>
                  <p className="text-[11px] text-foreground-muted leading-relaxed">
                    Routes deep reasoning to Nemotron 3 Ultra, fast parsing to Nemotron 3.5, and creative outreach to Muse Spark.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                <Target className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-foreground">pgvector Semantic Indexing</h5>
                  <p className="text-[11px] text-foreground-muted leading-relaxed">
                    Cosine distance embeddings over career achievements prevent generic hallucinations during generation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                <FileCheck2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-foreground">Immutable Master CV (SHA-256)</h5>
                  <p className="text-[11px] text-foreground-muted leading-relaxed">
                    Permanent cryptographic lock ensures certified PDF is submitted untouched; only cover letters are adaptive.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-[11px] text-foreground-subtle">
                <span>Architecture Specification</span>
                <Link href="/docs" className="text-primary hover:underline font-mono">
                  ADR-001 → ADR-006
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
