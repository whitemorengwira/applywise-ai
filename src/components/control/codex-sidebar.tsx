"use client";

import * as React from "react";
import {
  Plus,
  Image as ImageIcon,
  BookOpen,
  Clock,
  Terminal,
  Pin,
  Folder,
  Search,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import Link from "next/link";
import { SEED_PROFILE } from "@/lib/db/seed-data";

export interface PinnedThread {
  id: string;
  title: string;
  query: string;
  category?: string;
}

export const CODEX_PINNED_THREADS: PinnedThread[] = [
  {
    id: "pin-nws-revamp",
    title: "N.WHITE Systems Site Revamp",
    query: "Review architecture design and modernization plan for N.WHITE Systems enterprise platform.",
  },
  {
    id: "pin-nws-images",
    title: "NWS IMAGE GENERATIONS",
    query: "Generate technical architectural diagram for cloud microservices using Flux Schnell engine.",
  },
  {
    id: "pin-incubeta",
    title: "Incubeta - Analytics Solutions Architect",
    query: "Analyze job fit and prepare executive cover letter for Incubeta Analytics Solutions Architect role.",
  },
  {
    id: "pin-codex-vscode",
    title: "CODEX to VS CODE",
    query: "Inspect tool dispatching between Codex internal browser harness and local VS Code developer environment.",
  },
  {
    id: "pin-14peaks",
    title: "14Peaks Funding for EarCodeX",
    query: "Synthesize executive funding pitch and architecture documentation for EarCodeX deep-tech platform.",
  },
  {
    id: "pin-personal-email",
    title: "MY PERSONAL EMAIL",
    query: "Inspect Zoho Mail configuration and routing for whitemore@nwhite.systems with cryptographic audit logging.",
  },
  {
    id: "pin-video-sync",
    title: "Video Sync Request",
    query: "Prepare system design proposal for high-throughput video sync and distributed media streaming service.",
  },
  {
    id: "pin-earcodex-lireas",
    title: "Earcodex Lireas Holdings Funding",
    query: "Review InsurTech financial proposal and architectural reconciliation milestones for Lireas Holdings.",
  },
  {
    id: "pin-cv-job-options",
    title: "CV Job Options Listing",
    query: "Evaluate top Tier 1 African and global solutions architect vacancies matched against Master CV 3994a09c.",
  },
];

export const CODEX_PROJECTS = [
  {
    id: "proj-papa-mike",
    name: "Papa Mike",
    description: "Executive engineering initiative & architecture stream",
  },
  {
    id: "proj-configurations",
    name: "Configurations",
    description: "System environment variables, AI gateways & secrets",
  },
  {
    id: "proj-bongiwe",
    name: "BONGIWE SELANE 2026 CV",
    description: "Executive resume review & portfolio compilation",
  },
];

interface CodexSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat: () => void;
  onSelectPinnedThread: (thread: PinnedThread) => void;
  onOpenAction: (actionId: string) => void;
}

export function CodexSidebar({
  isCollapsed,
  onToggleCollapse,
  onNewChat,
  onSelectPinnedThread,
  onOpenAction,
}: CodexSidebarProps) {
  const [filterQuery, setFilterQuery] = React.useState("");
  const [showSearchInput, setShowSearchInput] = React.useState(false);

  const filteredPinned = CODEX_PINNED_THREADS.filter((p) =>
    !filterQuery ? true : p.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <div className="w-14 shrink-0 border-r border-border/80 bg-[#121212] flex flex-col items-center py-3 space-y-4">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-[#212121] transition-colors"
          title="Expand Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onNewChat}
          className="p-2.5 rounded-xl bg-[#212121] text-foreground hover:bg-[#2a2a2a] transition-colors"
          title="New Chat"
        >
          <Plus className="h-4 w-4" />
        </button>

        <div className="w-6 h-[1px] bg-border/40 my-1" />

        <button
          type="button"
          onClick={() => onOpenAction("create_image")}
          className="p-2 rounded-xl text-foreground-subtle hover:text-foreground hover:bg-[#212121] transition-colors"
          title="Images"
        >
          <ImageIcon className="h-4 w-4 text-sky-400" />
        </button>

        <button
          type="button"
          onClick={() => onOpenAction("add_library")}
          className="p-2 rounded-xl text-foreground-subtle hover:text-foreground hover:bg-[#212121] transition-colors"
          title="Library"
        >
          <BookOpen className="h-4 w-4 text-amber-400" />
        </button>

        <button
          type="button"
          onClick={() => onOpenAction("google_calendar")}
          className="p-2 rounded-xl text-foreground-subtle hover:text-foreground hover:bg-[#212121] transition-colors"
          title="Scheduled"
        >
          <Clock className="h-4 w-4 text-blue-400" />
        </button>

        <Link
          href="/browser"
          className="p-2 rounded-xl text-foreground-subtle hover:text-foreground hover:bg-[#212121] transition-colors"
          title="Internal Browser Codex"
        >
          <Terminal className="h-4 w-4 text-emerald-400" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-64 shrink-0 border-r border-border/80 bg-[#121212] flex flex-col justify-between text-xs h-full select-none">
      {/* Top Header */}
      <div className="p-3 space-y-2 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground tracking-tight">ChatGPT</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">Codex</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#212121] transition-colors"
              title="Search Chats"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#212121] transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Search input if toggled */}
        {showSearchInput && (
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search pinned & chats..."
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#212121] border border-border/60 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-primary animate-in fade-in duration-100"
            autoFocus
          />
        )}

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#212121] hover:bg-[#2a2a2a] text-foreground font-medium transition-all shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" />
            <span>New chat</span>
          </span>
        </button>

        {/* Top Quick Links */}
        <div className="space-y-0.5 pt-1">
          <button
            type="button"
            onClick={() => onOpenAction("create_image")}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
            <span>Images</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAction("add_library")}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Library</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAction("google_calendar")}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span>Scheduled</span>
          </button>
          <Link
            href="/browser"
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-[#1a1a1a] transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Codex Browser</span>
          </Link>
        </div>
      </div>

      {/* Middle Scrollable: Pinned & Projects */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Pinned Section */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider flex items-center gap-1.5">
            <Pin className="h-2.5 w-2.5" />
            <span>Pinned</span>
          </div>
          <div className="space-y-0.5">
            {filteredPinned.map((pin) => (
              <button
                key={pin.id}
                type="button"
                onClick={() => onSelectPinnedThread(pin)}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-foreground-muted hover:text-foreground hover:bg-[#1f1f1f] transition-colors truncate block group cursor-pointer"
                title={pin.title}
              >
                <span className="truncate block group-hover:text-white">{pin.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-1 pt-2 border-t border-border/40">
          <div className="px-2 py-1 text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="h-2.5 w-2.5" />
            <span>Projects</span>
          </div>
          <div className="space-y-0.5">
            {CODEX_PROJECTS.map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() =>
                  onSelectPinnedThread({
                    id: proj.id,
                    title: proj.name,
                    query: `Inspect project workspace: ${proj.name} — ${proj.description}`,
                  })
                }
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-foreground-muted hover:text-foreground hover:bg-[#1f1f1f] transition-colors truncate cursor-pointer group"
                title={proj.description}
              >
                <Folder className="h-3 w-3 text-cyan-400 shrink-0" />
                <span className="truncate block group-hover:text-white">{proj.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="p-3 border-t border-border/60 bg-[#0d0d0d] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-purple-600 to-primary flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
            WN
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground text-xs truncate">
              {SEED_PROFILE.fullName}
            </div>
            <div className="text-[10px] text-foreground-subtle">Free Tier Active</div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground-subtle">
          14+ Yrs
        </span>
      </div>
    </div>
  );
}
