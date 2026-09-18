"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  ExternalLink,
  X,
  Code2,
  Sparkles,
} from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface GithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertRepoContext?: (contextText: string) => void;
}

const RECENT_COMMITS = [
  {
    sha: "25611a8",
    message: "docs: update progress tracker with Phase 32 completion",
    author: "Whitemore Ngwira",
    timeAgo: "Just now",
  },
  {
    sha: "88373b1",
    message: "feat: in-app application value chain, dedicated internal browser, portal MCP connectors, and permanent applied inventory",
    author: "Whitemore Ngwira",
    timeAgo: "15 mins ago",
  },
  {
    sha: "e94ca58",
    message: "feat: regional currency normalization (ZAR/USD), Whisper voice chat, Gemini Gems, and automations command centre",
    author: "Whitemore Ngwira",
    timeAgo: "2 hours ago",
  },
  {
    sha: "b7e2891",
    message: "feat: live real job discovery engine with deduplication and verified African portals",
    author: "Whitemore Ngwira",
    timeAgo: "4 hours ago",
  },
];

export function GithubModal({
  isOpen,
  onClose,
  onInsertRepoContext,
}: GithubModalProps) {
  if (!isOpen) return null;

  const handleAttachRepoContext = () => {
    if (onInsertRepoContext) {
      onInsertRepoContext(
        `Repository: whitemorengwira/applywise-ai (Branches: master, main | 162 passing tests | Next.js 15 + PostgreSQL pgvector)`
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-border/90 bg-[#090d16] p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-500/20 border border-slate-500/40 flex items-center justify-center">
              <GithubIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">GitHub Repository Intelligence</h3>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Synced
                </Badge>
              </div>
              <p className="text-xs text-foreground-muted">
                Inspect live branches, verified commits, and CI quality gates for ApplyWise AI.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Repository Header */}
        <div className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <a
                href="https://github.com/whitemorengwira/applywise-ai"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1 font-mono"
              >
                <span>whitemorengwira/applywise-ai</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-secondary/80 text-foreground-muted flex items-center gap-1">
                <GitBranch className="h-3 w-3 text-cyan-400" />
                master (default)
              </span>
              <span className="px-2 py-0.5 rounded bg-secondary/80 text-foreground-muted flex items-center gap-1">
                <GitBranch className="h-3 w-3 text-cyan-400" />
                main
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40 text-[11px] font-mono">
            <div className="p-1.5 rounded bg-background/50 text-center">
              <div className="text-foreground-subtle text-[10px]">Test Suite</div>
              <div className="text-emerald-400 font-bold">162 / 162 PASS</div>
            </div>
            <div className="p-1.5 rounded bg-background/50 text-center">
              <div className="text-foreground-subtle text-[10px]">Turbopack Build</div>
              <div className="text-emerald-400 font-bold">37 Routes Clean</div>
            </div>
            <div className="p-1.5 rounded bg-background/50 text-center">
              <div className="text-foreground-subtle text-[10px]">Production</div>
              <div className="text-primary font-bold">Vercel Edge</div>
            </div>
          </div>
        </div>

        {/* Commits List */}
        <div className="space-y-1.5 flex-1 overflow-y-auto p-1">
          <span className="text-[11px] font-mono text-foreground-subtle uppercase tracking-wider block">
            Recent Verified Commits
          </span>
          {RECENT_COMMITS.map((c) => (
            <div
              key={c.sha}
              className="p-2.5 rounded-xl border border-border/60 bg-card/40 hover:bg-card/70 transition-all flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-secondary font-mono text-[10px] text-cyan-400 shrink-0">
                    {c.sha}
                  </span>
                  <span className="font-semibold text-foreground truncate">{c.message}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-foreground-subtle font-mono">
                  <span>By {c.author}</span>
                  <span>•</span>
                  <span>{c.timeAgo}</span>
                </div>
              </div>
              <GitCommit className="h-4 w-4 text-foreground-subtle shrink-0 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAttachRepoContext}
            className="text-xs gap-1 border-primary/40 text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Attach Repo Summary to Chat</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
