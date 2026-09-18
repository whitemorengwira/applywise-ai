"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { JobApplication, ApplicationStatus } from "@/types";
import { SEED_APPLICATIONS } from "@/lib/db/seed-data";

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: "saved", label: "Saved Roles", color: "border-slate-500/30" },
  { id: "tailoring", label: "Tailoring Cover Letter", color: "border-blue-500/30" },
  { id: "ready", label: "Ready to Apply", color: "border-amber-500/30" },
  { id: "applied", label: "Applied / In Review", color: "border-purple-500/30" },
  { id: "interviewing", label: "Interviewing", color: "border-emerald-500/30" },
  { id: "offered", label: "Offer Received", color: "border-emerald-400" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState<JobApplication[]>(SEED_APPLICATIONS);

  const updateStatus = (appId: string, nextStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: nextStatus, updatedAt: new Date().toISOString() } : app))
    );
  };

  return (
    <AppShell pageTitle="Application Pipeline & CRM Tracker">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-1">
          <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
            Total In Pipeline
          </span>
          <p className="text-2xl font-bold font-mono text-foreground">{applications.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 space-y-1">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            Active Interviews
          </span>
          <p className="text-2xl font-bold font-mono text-primary">
            {applications.filter((a) => a.status === "interviewing").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-1">
          <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
            Ready to Submit
          </span>
          <p className="text-2xl font-bold font-mono text-amber-400">
            {applications.filter((a) => a.status === "ready").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-1">
          <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
            Avg Application Fit
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-400">95%</p>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin min-w-0">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div key={col.id} className="flex flex-col space-y-3 min-w-[260px] max-w-[280px] flex-shrink-0">
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-secondary/40 border border-border/60">
                <span className="text-xs font-semibold text-foreground tracking-wide">
                  {col.label}
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-background text-foreground-muted">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {colApps.map((app) => (
                  <Card
                    key={app.id}
                    className={`border ${col.color} bg-card/85 p-4 space-y-3 shadow-sm hover:border-primary/50 transition-all`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-foreground leading-tight">
                          {app.job?.title}
                        </h4>
                        {app.matchAnalysis && (
                          <Badge variant="highMatch" className="text-[9px] font-mono px-1.5 py-0.2">
                            {app.matchAnalysis.overallScore}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-primary font-medium">
                        {app.job?.company}
                      </p>
                      <p className="text-[10px] text-foreground-subtle font-mono">
                        {app.job?.location}
                      </p>
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-foreground-muted italic line-clamp-2 bg-secondary/30 p-2 rounded border border-border/40">
                        &ldquo;{app.notes}&rdquo;
                      </p>
                    )}

                    {app.interviewStages && app.interviewStages.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-border/40">
                        <span className="text-[10px] font-semibold uppercase text-emerald-400 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> Next Round
                        </span>
                        <p className="text-[10px] text-foreground font-medium">
                          {app.interviewStages[app.interviewStages.length - 1].stage}
                        </p>
                      </div>
                    )}

                    {/* Stage Transition Action */}
                    <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                      {col.id === "saved" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(app.id, "tailoring")}
                          className="text-[10px] h-7 px-2 gap-1 ml-auto text-primary"
                        >
                          Start Tailoring <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                      {col.id === "tailoring" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(app.id, "ready")}
                          className="text-[10px] h-7 px-2 gap-1 ml-auto text-amber-400"
                        >
                          Mark Ready <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                      {col.id === "ready" && (
                        <Button
                          size="sm"
                          variant="glow"
                          onClick={() => updateStatus(app.id, "applied")}
                          className="text-[10px] h-7 px-2.5 gap-1 ml-auto"
                        >
                          Submit Applied <CheckCircle2 className="h-3 w-3" />
                        </Button>
                      )}
                      {col.id === "applied" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(app.id, "interviewing")}
                          className="text-[10px] h-7 px-2 gap-1 ml-auto text-emerald-400"
                        >
                          Stage Interview <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                      {col.id === "interviewing" && (
                        <Button
                          size="sm"
                          variant="glow"
                          onClick={() => updateStatus(app.id, "offered")}
                          className="text-[10px] h-7 px-2.5 gap-1 ml-auto bg-emerald-500 hover:bg-emerald-600"
                        >
                          Log Offer! 🎉
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {colApps.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-border/50 text-center text-foreground-subtle text-xs">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
