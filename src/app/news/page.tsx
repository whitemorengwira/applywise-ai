"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Sparkles,
  Search,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface NewsStory {
  id: string;
  title: string;
  category: "ENTERPRISE_AI" | "CLOUD_INFRA" | "SOUTH_AFRICA_TECH" | "ZIMBABWE_FINTECH" | "GOVERNANCE";
  categoryLabel: string;
  source: string;
  publishedAt: string;
  summary: string;
  cvImpact: string;
  relevantSkills: string[];
  suggestedActionRole: { company: string; role: string; jobId: string };
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const newsStories: NewsStory[] = [
    {
      id: "news-1",
      title: "South African Enterprises Surge Investment in Agentic AI & Next.js Platforms (ZAR Market)",
      category: "SOUTH_AFRICA_TECH",
      categoryLabel: "South Africa Tech (ZAR)",
      source: "African Tech & Systems Review",
      publishedAt: "2026-09-18T14:00:00Z",
      summary:
        "Tier 1 South African corporations across banking, logistics, and consulting in Johannesburg and Cape Town are expanding engineering budgets, offering R 1,450,000 - R 2,200,000 ZAR for Principal Solutions Architects with proven multi-agent orchestration experience.",
      cvImpact:
        "Directly validates Whitemore Ngwira's 14+ years systems leadership, Next.js 15, and pgvector RAG delivery. Entelect and IQbusiness are actively interviewing for these positions.",
      relevantSkills: ["Next.js 15", "pgvector", "LangGraph", "Solutions Architecture", "ZAR Market"],
      suggestedActionRole: { company: "Entelect", role: "Lead Solutions Architect", jobId: "job-101" },
    },
    {
      id: "news-2",
      title: "AWS Cloud-Native InsurTech & Document Intelligence Adoption Doubles in Emerging Markets",
      category: "CLOUD_INFRA",
      categoryLabel: "Cloud & InsurTech",
      source: "Cloud Native Architecture Briefing",
      publishedAt: "2026-09-17T18:30:00Z",
      summary:
        "Financial institutions and insurers are replacing legacy monolithic platforms with automated document intelligence and immutable audit trails to comply with stringent regulatory oversight.",
      cvImpact:
        "Whitemore's flagship EarCodeX InsurTech platform on AWS provides verified production proof of automated OCR, reconciliation services, and audit immutability.",
      relevantSkills: ["AWS Cloud", "InsurTech", "Document Intelligence", "PostgreSQL", "Audit Trail"],
      suggestedActionRole: { company: "Amazon Web Services", role: "Senior Cloud Solutions Architect", jobId: "job-103" },
    },
    {
      id: "news-3",
      title: "Zimbabwe Telecommunications & Mobile Money Modernization Expands USD Hiring",
      category: "ZIMBABWE_FINTECH",
      categoryLabel: "Zimbabwe & Africa (USD)",
      source: "Pan-African Telecom & FinTech Dispatch",
      publishedAt: "2026-09-17T11:00:00Z",
      summary:
        "Leading pan-African mobile operators and FinTech enterprises in Harare are hiring remote and hybrid Solutions Architects at $120,000 - $160,000 USD to build resilient cloud gateways and edge caching.",
      cvImpact:
        "Econet Wireless is actively recruiting for Lead Cloud & AI Solutions Architects to engineer multi-tier cloud infrastructure with LiteLLM and Cloudflare AI Gateway.",
      relevantSkills: ["LiteLLM", "Cloudflare AI Gateway", "Terraform", "PostgreSQL", "USD Contracts"],
      suggestedActionRole: { company: "Econet Wireless", role: "Lead Cloud & AI Solutions Architect", jobId: "job-zw-202" },
    },
    {
      id: "news-4",
      title: "Global Shift to Zero-Cost Free-Tier Multi-Model Gateways Over Monolithic APIs",
      category: "ENTERPRISE_AI",
      categoryLabel: "Enterprise AI & Models",
      source: "Autonomous Systems Journal",
      publishedAt: "2026-09-16T16:45:00Z",
      summary:
        "Enterprises are adopting governed multi-model gateways with circuit breakers and edge caching, moving away from single-vendor lock-in to achieve zero-dollar compute budgets without sacrificing inference quality.",
      cvImpact:
        "ApplyWise AI's OpenCode Zen 5-model router and Cloudflare AI Gateway integration demonstrate this exact operational architecture.",
      relevantSkills: ["OpenCode Zen", "Model Routing", "Circuit Breakers", "Zero-Cost Free-Tier"],
      suggestedActionRole: { company: "Synthesia", role: "Principal Agentic AI Systems Architect", jobId: "job-sa-201" },
    },
    {
      id: "news-5",
      title: "Enterprise AI Immutability: Cryptographic Audit Trails Mandated for Executive Hiring Systems",
      category: "GOVERNANCE",
      categoryLabel: "Security & Governance",
      source: "Cybersecurity & Compliance Standard",
      publishedAt: "2026-09-15T09:15:00Z",
      summary:
        "Zero-trust governance frameworks now require cryptographic SHA-256 proof generation and strict grounding validation (< 0.75 rejection) to eliminate AI hallucinations in regulated sectors.",
      cvImpact:
        "Whitemore's certified Master CV SHA-256 lock (3994a09c...) and cryptographic proof capture provide an unmatched benchmark for regulated systems.",
      relevantSkills: ["Zero-Trust", "SHA-256 Locking", "POPIA", "Tamper-Proof Audit"],
      suggestedActionRole: { company: "Takealot Group", role: "Lead Platform & Infrastructure Architect", jobId: "job-104" },
    },
  ];

  const categories = [
    { id: "ALL", label: "All Intelligence Threads" },
    { id: "SOUTH_AFRICA_TECH", label: "🇿🇦 South Africa (ZAR)" },
    { id: "ZIMBABWE_FINTECH", label: "🇿🇼 Zimbabwe (USD)" },
    { id: "ENTERPRISE_AI", label: "🤖 Enterprise AI & Agents" },
    { id: "CLOUD_INFRA", label: "☁️ Cloud & InsurTech" },
    { id: "GOVERNANCE", label: "🛡️ Security & Governance" },
  ];

  const filteredStories = newsStories
    .filter((s) => selectedCategory === "ALL" || s.category === selectedCategory)
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.cvImpact.toLowerCase().includes(q) ||
        s.relevantSkills.some((k) => k.toLowerCase().includes(q))
      );
    });

  return (
    <AppShell pageTitle="Industry Intelligence & Tech News Threads">
      {/* Top Banner & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            Strategic Industry Threads Grounded in Candidate Credentials
          </h2>
          <p className="text-xs text-foreground-muted">
            Curated market shifts, regional compensation trends in ZAR & USD, and high-yield opportunities affecting Whitemore Ngwira&apos;s CV.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-subtle" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search intelligence threads..."
            className="h-9 w-full rounded-xl border border-border bg-card/80 pl-9 pr-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`h-8 px-3 rounded-xl border text-xs font-medium transition-all select-none cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                : "border-border/80 bg-card/60 text-foreground-muted hover:bg-secondary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News Feed Stream */}
      <div className="space-y-4">
        {filteredStories.map((story) => (
          <Card
            key={story.id}
            className="p-6 border-border/80 bg-card/75 hover:border-primary/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                    {story.categoryLabel}
                  </Badge>
                  <span className="text-[11px] text-foreground-subtle font-mono">
                    Source: {story.source} • {new Date(story.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors">
                  {story.title}
                </h3>
              </div>

              <Button size="sm" variant="glow" asChild className="shrink-0 gap-1.5 text-xs">
                <Link href={`/cover-letters?jobId=${story.suggestedActionRole.jobId}`}>
                  <span>Target {story.suggestedActionRole.company}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <p className="text-xs md:text-sm text-foreground-muted leading-relaxed">
              {story.summary}
            </p>

            {/* CV Impact Box */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                  CV Relevance & Strategic Opportunity Analysis
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                {story.cvImpact}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
              <span className="text-[11px] text-foreground-subtle mr-1">Aligned Skills:</span>
              {story.relevantSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary/80 text-foreground-muted border border-border/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
