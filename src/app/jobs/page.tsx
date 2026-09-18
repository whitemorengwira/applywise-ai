"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  MapPin,
  ExternalLink,
  Target,
  PlusCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { JobListing, MatchAnalysis } from "@/types";
import { SEED_JOBS } from "@/lib/db/seed-data";

function getCleanDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "Direct Portal";
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<JobListing[]>(SEED_JOBS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [remoteOnly, setRemoteOnly] = React.useState(false);
  const [evaluatingJobId, setEvaluatingJobId] = React.useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = React.useState<MatchAnalysis | null>(null);
  const [showIngestModal, setShowIngestModal] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  // New role form state
  const [newTitle, setNewTitle] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("Remote (Global)");
  const [newSkills, setNewSkills] = React.useState("Next.js 15, TypeScript, Supabase, pgvector");
  const [newApplyUrl, setNewApplyUrl] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");

  const handleSyncLiveJobs = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/jobs?refresh=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to sync live jobs:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  React.useEffect(() => {
    let active = true;
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => {
        console.error("Failed to load live jobs:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (remoteOnly && job.remoteType !== "Remote") return false;
    if (searchQuery.trim() === "") return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const runDeepMatch = async (jobId: string) => {
    setEvaluatingJobId(jobId);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setActiveAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setEvaluatingJobId(null);
    }
  };

  const handleIngestJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    const finalApplyUrl = newApplyUrl.trim().startsWith("http")
      ? newApplyUrl.trim()
      : "https://www.offerzen.com/";

    const newJob: JobListing = {
      id: `job-custom-${Date.now()}`,
      source: "manual",
      title: newTitle,
      company: newCompany,
      location: newLocation,
      remoteType: newLocation.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
      salaryMin: 130000,
      salaryMax: 160000,
      currency: "GBP",
      description: newDescription || "Ingested custom target role for agentic matching.",
      requirements: ["Senior architecture leadership", "Proven production systems"],
      responsibilities: ["Lead engineering roadmap", "Deliver scalable platforms"],
      skills: newSkills.split(",").map((s) => s.trim()),
      applyUrl: finalApplyUrl,
      postedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setJobs([newJob, ...jobs]);
    setShowIngestModal(false);
    // Reset form
    setNewTitle("");
    setNewCompany("");
    setNewApplyUrl("");
    setNewDescription("");
  };

  return (
    <AppShell pageTitle="Job Discovery & Opportunity Matching">
      {/* Search and Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-subtle" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, or stack (e.g. Next.js, pgvector)..."
              className="h-10 w-full rounded-xl border border-border bg-card/80 pl-9 pr-4 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <button
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`h-10 px-3.5 rounded-xl border text-xs font-medium transition-all select-none cursor-pointer flex items-center gap-1.5 ${
              remoteOnly
                ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                : "border-border bg-card/60 text-foreground-muted hover:bg-secondary"
            }`}
          >
            Remote Only
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncLiveJobs}
            disabled={isSyncing}
            className="h-10 px-3 rounded-xl border-border bg-card/60 text-foreground hover:bg-secondary gap-1.5 text-xs shrink-0 cursor-pointer"
            title="Sync latest live opportunities from public APIs and verified corporate portals"
          >
            {isSyncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 text-primary" />
            )}
            <span className="hidden md:inline">{isSyncing ? "Syncing..." : "Sync Live Jobs"}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="outline" className="text-[11px] font-mono border-border/80 text-foreground-muted hidden sm:inline-flex gap-1.5 py-1.5 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {filteredJobs.length} Real Vacancies
          </Badge>

          <Button variant="glow" onClick={() => setShowIngestModal(true)} className="gap-2 shrink-0">
            <PlusCircle className="h-4 w-4" />
            Ingest Custom Role
          </Button>
        </div>
      </div>

      {/* Main Grid: Job Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job) => {
          const isEvaluating = evaluatingJobId === job.id;
          const cleanDomain = getCleanDomain(job.applyUrl);

          return (
            <Card
              key={job.id}
              className="border-border/80 bg-card/75 p-6 hover:border-primary/40 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base md:text-lg text-foreground hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <Badge
                      variant="default"
                      className={`text-[10px] font-mono uppercase ${
                        job.source === "remotive"
                          ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                          : job.source === "arbeitnow"
                          ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                          : job.source === "direct_portal"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-secondary text-foreground-muted"
                      }`}
                    >
                      {job.source === "remotive"
                        ? "Remotive Live"
                        : job.source === "arbeitnow"
                        ? "Arbeitnow Live"
                        : job.source === "direct_portal"
                        ? "Verified Portal"
                        : job.source}
                    </Badge>
                    <Badge variant={job.remoteType === "Remote" ? "success" : "secondary"} className="text-[10px]">
                      {job.remoteType}
                    </Badge>
                  </div>

                  <p className="text-xs md:text-sm text-foreground-muted flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{job.company}</span>
                    <span className="text-foreground-subtle">•</span>
                    <span className="flex items-center gap-1 text-foreground-subtle">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="text-foreground-subtle">•</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      £{job.salaryMin?.toLocaleString()} - £{job.salaryMax?.toLocaleString()} GBP
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runDeepMatch(job.id)}
                    disabled={isEvaluating}
                    className="gap-1.5"
                  >
                    {isEvaluating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    ) : (
                      <Target className="h-3.5 w-3.5 text-primary" />
                    )}
                    Run Deep Match
                  </Button>

                  <Button size="sm" variant="glow" asChild>
                    <Link href={`/cover-letters?jobId=${job.id}`} className="gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Tailor Cover Letter
                    </Link>
                  </Button>
                </div>
              </div>

              <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
                <span className="text-[11px] text-foreground-subtle mr-1">Target Skills:</span>
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary/80 text-foreground-muted border border-border/60"
                  >
                    {skill}
                  </span>
                ))}
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[11px] text-primary hover:underline flex items-center gap-1 font-mono group"
                >
                  <span className="text-foreground-subtle group-hover:text-primary">Apply on</span>
                  <span className="font-semibold text-primary">{cleanDomain}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Deep Match Analysis Drawer / Modal */}
      {activeAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-[#0a0f1d] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  AI Fit Assessment & Gap Analysis
                </h3>
              </div>
              <button
                onClick={() => setActiveAnalysis(null)}
                className="text-foreground-subtle hover:text-foreground text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/25">
              <div>
                <span className="text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                  Overall Compatibility Fit
                </span>
                <h4 className="text-2xl font-bold font-mono text-foreground mt-0.5">
                  {activeAnalysis.overallScore}% MATCH
                </h4>
              </div>
              <Badge variant="highMatch" className="text-xs uppercase px-3 py-1 font-mono">
                {activeAnalysis.tier.replace("_", " ")}
              </Badge>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                Scoring Breakdown
              </h5>
              <div className="space-y-2">
                {activeAnalysis.breakdown.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border/60 bg-secondary/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{cat.category}</span>
                      <span className="font-mono text-xs text-primary font-bold">{cat.score}%</span>
                    </div>
                    <p className="text-[11px] text-foreground-muted">{cat.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Strengths */}
            {activeAnalysis.keyStrengths.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Key Demonstrated Strengths
                </h5>
                <ul className="space-y-1 text-xs text-foreground-muted list-disc list-inside">
                  {activeAnalysis.keyStrengths.map((strength, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Critical Gaps */}
            {activeAnalysis.criticalGaps.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> Actionable Gap Refinements
                </h5>
                <ul className="space-y-1 text-xs text-foreground-muted list-disc list-inside">
                  {activeAnalysis.criticalGaps.map((gap, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Action */}
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 space-y-1">
              <span className="text-[10px] font-mono font-semibold text-foreground-subtle uppercase">
                AI Strategic Recommendation
              </span>
              <p className="text-xs text-foreground leading-relaxed">
                {activeAnalysis.recommendedAction}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button variant="outline" onClick={() => setActiveAnalysis(null)}>
                Dismiss
              </Button>
              <Button variant="glow" asChild>
                <Link href={`/cover-letters?jobId=${activeAnalysis.jobId}`}>
                  Proceed to Tailor Cover Letter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ingest Custom Job Modal */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleIngestJob}
            className="w-full max-w-lg rounded-2xl border border-border bg-[#0a0f1d] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Ingest Custom Target Vacancy</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIngestModal(false)}
                className="text-foreground-subtle hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground-subtle block mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Principal AI Platform Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground-subtle block mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Entelect / Standard Bank"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground-subtle block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground-subtle block mb-1">
                  Application URL (Direct Careers Link)
                </label>
                <input
                  type="url"
                  placeholder="https://company.com/careers/role-id"
                  value={newApplyUrl}
                  onChange={(e) => setNewApplyUrl(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground-subtle block mb-1">
                  Required Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border bg-secondary/30 px-3 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground-subtle block mb-1">
                  Role Description or Pasted Job Spec
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste requirements, tech stack, or job description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/30 p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setShowIngestModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow">
                Save & Run Match
              </Button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
