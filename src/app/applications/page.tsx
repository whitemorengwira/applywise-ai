"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Layers,
  FileText,
  Search,
  Globe,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { JobApplication, ApplicationStatus } from "@/types";
import { SEED_APPLICATIONS } from "@/lib/db/seed-data";
import {
  ApplicationInventoryService,
  InventoryItem,
} from "@/lib/services/application-inventory.service";
import {
  PERMANENT_SESSIONS,
} from "@/lib/services/internal-browser.service";

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: "saved", label: "Saved Roles", color: "border-slate-500/30" },
  { id: "tailoring", label: "Tailoring Cover Letter", color: "border-blue-500/30" },
  { id: "ready", label: "Ready to Apply", color: "border-amber-500/30" },
  { id: "applied", label: "Applied / In Review", color: "border-purple-500/30" },
  { id: "interviewing", label: "Interviewing", color: "border-emerald-500/30" },
  { id: "offered", label: "Offer Received", color: "border-emerald-400" },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = React.useState<"INVENTORY" | "KANBAN" | "SESSIONS">("INVENTORY");
  const [applications, setApplications] = React.useState<JobApplication[]>(SEED_APPLICATIONS);
  const [inventory] = React.useState<InventoryItem[]>(() =>
    ApplicationInventoryService.getInventory()
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [portalFilter, setPortalFilter] = React.useState("ALL");
  const [selectedCoverLetter, setSelectedCoverLetter] = React.useState<InventoryItem | null>(null);

  const updateStatus = (appId: string, nextStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: nextStatus, updatedAt: new Date().toISOString() } : app))
    );
  };

  const filteredInventory = ApplicationInventoryService.filterInventory(
    inventory,
    portalFilter,
    searchQuery
  );

  const portalBadge = (portal: string) => {
    switch (portal) {
      case "PNET":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-[10px]">🇿🇦 PNet SA</Badge>;
      case "INDEED":
        return <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 font-mono text-[10px]">🌐 Indeed</Badge>;
      case "LINKEDIN":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-400 font-mono text-[10px]">💼 LinkedIn</Badge>;
      case "ZOHO_MAIL":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-[10px]">📧 Zoho Mail</Badge>;
      default:
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 font-mono text-[10px]">⚡ Direct Portal</Badge>;
    }
  };

  return (
    <AppShell pageTitle="Applications Hub & Permanent Applied Inventory">
      {/* Top View Selector & KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Dedicated Applied Jobs Inventory & Pipeline Ledger
          </h2>
          <p className="text-xs text-foreground-muted">
            Permanent, verifiable inventory of all submitted applications with cryptographic SHA-256 proof hashes.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/80 shrink-0">
          <button
            onClick={() => setActiveTab("INVENTORY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "INVENTORY"
                ? "bg-primary text-black font-bold shadow-sm"
                : "text-foreground-muted hover:text-foreground hover:bg-secondary"
            }`}
          >
            Permanent Ledger ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab("KANBAN")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "KANBAN"
                ? "bg-primary text-black font-bold shadow-sm"
                : "text-foreground-muted hover:text-foreground hover:bg-secondary"
            }`}
          >
            Pipeline CRM
          </button>
          <button
            onClick={() => setActiveTab("SESSIONS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "SESSIONS"
                ? "bg-primary text-black font-bold shadow-sm"
                : "text-foreground-muted hover:text-foreground hover:bg-secondary"
            }`}
          >
            Portal Sessions (4)
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-1">
          <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
            Total In Inventory
          </span>
          <p className="text-2xl font-bold font-mono text-foreground">{inventory.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Active Interviews
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {inventory.filter((a) => a.status === "INTERVIEWING").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/10 space-y-1">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            CV Cryptographic Lock
          </span>
          <p className="text-xs font-bold font-mono text-primary truncate">
            3994a09c... (100%)
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-1">
          <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">
            Weekly Target (200)
          </span>
          <p className="text-2xl font-bold font-mono text-cyan-400">
            {inventory.length} <span className="text-xs text-foreground-subtle font-normal font-sans">logged</span>
          </p>
        </div>
      </div>

      {/* TAB 1: PERMANENT APPLIED INVENTORY (LEDGER) */}
      {activeTab === "INVENTORY" && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-subtle" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applied jobs, companies, proof hashes..."
                className="h-9 w-full rounded-xl border border-border bg-card/80 pl-9 pr-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {["ALL", "PNET", "INDEED", "LINKEDIN", "ZOHO_MAIL", "DIRECT_PORTAL"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPortalFilter(p)}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-all ${
                    portalFilter === p
                      ? "bg-primary/20 text-primary border-primary/40 font-bold"
                      : "border-border/70 bg-card/50 text-foreground-muted hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Tabular Ledger Card */}
          <Card className="border-border/80 bg-card/75 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-secondary/40 font-mono text-[11px] text-foreground-muted">
                    <th className="p-3 pl-4">Target Role & Company</th>
                    <th className="p-3">Connector Route</th>
                    <th className="p-3">Compensation</th>
                    <th className="p-3">Applied Timestamp</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Proof Hash</th>
                    <th className="p-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/25 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground text-xs">{item.jobTitle}</p>
                          <p className="text-[11px] text-foreground-muted flex items-center gap-1">
                            <span>{item.company}</span>
                            <span>•</span>
                            <span className="text-foreground-subtle">{item.location}</span>
                          </p>
                        </div>
                      </td>

                      <td className="p-3">
                        {portalBadge(item.portalRoute)}
                      </td>

                      <td className="p-3 font-mono font-semibold text-emerald-400">
                        {item.salaryFormatted}
                      </td>

                      <td className="p-3 font-mono text-[11px] text-foreground-subtle">
                        {new Date(item.appliedAt).toLocaleDateString()} {new Date(item.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono ${
                            item.status === "INTERVIEWING"
                              ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                              : item.status === "UNDER_REVIEW"
                              ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/10"
                              : "border-primary/40 text-primary bg-primary/10"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-primary truncate max-w-[150px]">
                        {item.proofHash}
                      </td>

                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedCoverLetter(item)}
                            className="h-7 px-2 text-[11px] text-foreground-muted hover:text-foreground font-mono"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Cover Letter
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            asChild
                            className="h-7 w-7 text-foreground-muted hover:text-cyan-400"
                            title="Open in Internal Browser"
                          >
                            <Link href="/browser">
                              <Globe className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Modal / Detail for Selected Cover Letter */}
          {selectedCoverLetter && (
            <Card className="p-4 rounded-xl border border-primary/40 bg-black/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-bold text-xs text-foreground font-mono">
                    Archived Cover Letter: {selectedCoverLetter.jobTitle} at {selectedCoverLetter.company}
                  </span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedCoverLetter(null)} className="h-6 text-xs">
                  Close
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-[#070b14] border border-border/80 text-xs font-sans whitespace-pre-wrap text-foreground/90 leading-relaxed max-h-60 overflow-y-auto">
                {selectedCoverLetter.coverLetterFull}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
                <span>Proof: {selectedCoverLetter.proofHash}</span>
                <span>SHA-256 Lock: {selectedCoverLetter.cvHashLocked.slice(0, 16)}...</span>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: PIPELINE CRM (KANBAN) */}
      {activeTab === "KANBAN" && (
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
                        <p className="text-[11px] text-foreground-muted">{app.job?.company}</p>
                        <p className="text-[10px] text-foreground-subtle">{app.job?.location}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px]">
                        <span className="text-foreground-subtle flex items-center gap-1 font-mono">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(app.updatedAt || app.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-1">
                          {col.id === "ready" && (
                            <Button
                              size="sm"
                              variant="glow"
                              className="h-6 text-[10px] px-2 font-bold"
                              onClick={() => updateStatus(app.id, "applied")}
                            >
                              Apply
                            </Button>
                          )}
                          {col.id === "applied" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] px-2"
                              onClick={() => updateStatus(app.id, "interviewing")}
                            >
                              Interview
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: CONNECTED PORTAL SESSIONS */}
      {activeTab === "SESSIONS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERMANENT_SESSIONS.map((sess) => (
              <Card key={sess.id} className="p-5 border-border/80 bg-card/75 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                    <h3 className="font-bold text-sm text-foreground">{sess.name}</h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400">
                    PERMANENTLY AUTHENTICATED
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-secondary/30 border border-border/60 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground-subtle">Username / Account:</span>
                    <span className="font-mono text-foreground font-semibold">{sess.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-subtle">Role Persona:</span>
                    <span className="text-foreground-muted">{sess.profileRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-subtle">Active Feature:</span>
                    <span className="font-mono text-cyan-400">{sess.badge}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-[11px] text-foreground-subtle font-mono">
                    Session Status: Verified Active
                  </span>
                  <Button size="sm" variant="glow" asChild className="text-xs h-7 gap-1">
                    <Link href="/browser">
                      <span>Launch In Browser</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
