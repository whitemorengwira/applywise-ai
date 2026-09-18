"use client";

import * as React from "react";
import {
  Paperclip,
  BookOpen,
  Image as ImageIcon,
  PenTool,
  Globe,
  Search,
  Calendar,
} from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function FigmaIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.25 12a3.75 3.75 0 1 1 0-7.5h7.5a3.75 3.75 0 1 1 0 7.5h-7.5zm0 0a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 3.75-3.75V12h-3.75zm3.75 3.75a3.75 3.75 0 1 0 3.75-3.75h-3.75v3.75zM12 12V8.25a3.75 3.75 0 1 0-3.75 3.75H12z" />
    </svg>
  );
}

export interface CodexActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  category: "files" | "tools" | "integrations";
}

export const CODEX_ACTION_ITEMS: CodexActionItem[] = [
  {
    id: "add_files",
    title: "Add photos & files",
    description: "Upload from computer",
    icon: Paperclip,
    iconColor: "text-slate-300",
    category: "files",
  },
  {
    id: "add_library",
    title: "Add from library",
    description: "Browse and search your files",
    icon: BookOpen,
    iconColor: "text-amber-400",
    category: "files",
  },
  {
    id: "create_image",
    title: "Create image",
    description: "Visualize anything",
    icon: ImageIcon,
    iconColor: "text-sky-400",
    category: "tools",
  },
  {
    id: "sketch",
    title: "Sketch",
    description: "Draw and attach an image",
    icon: PenTool,
    iconColor: "text-orange-400",
    category: "tools",
  },
  {
    id: "web_search",
    title: "Web search",
    description: "Find real-time news and info",
    icon: Globe,
    iconColor: "text-blue-400",
    category: "tools",
  },
  {
    id: "deep_research",
    title: "Deep research",
    description: "Get a detailed report",
    icon: Search,
    iconColor: "text-cyan-400",
    category: "tools",
  },
  {
    id: "google_calendar",
    title: "Google Calendar",
    description: "Manage Google Calendar events",
    icon: Calendar,
    iconColor: "text-blue-500",
    category: "integrations",
  },
  {
    id: "github",
    title: "GitHub",
    description: "Triage PRs, issues, CI, and publish flows",
    icon: GithubIcon,
    iconColor: "text-slate-100",
    category: "integrations",
  },
  {
    id: "figma",
    title: "Figma",
    description: "Create designs, ship to code",
    icon: FigmaIcon,
    iconColor: "text-purple-400",
    category: "integrations",
  },
];

interface CodexActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export function CodexActionMenu({
  isOpen,
  onClose,
  onSelectAction,
}: CodexActionMenuProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSearchQuery("");
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = CODEX_ACTION_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
  });

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 mb-3 w-80 sm:w-96 rounded-2xl border border-border/80 bg-[#171717] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl text-foreground"
    >
      <div className="max-h-96 overflow-y-auto space-y-1 p-1">
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-foreground-subtle font-mono">
            No matching actions found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  onSelectAction(item.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-[#262626] transition-colors text-left group cursor-pointer"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-foreground group-hover:text-white truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#8e8e8e] group-hover:text-foreground-muted truncate">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Search Bar matching Codex */}
      <div className="pt-2 px-2 pb-1 border-t border-border/50">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#212121] border border-border/60 text-xs">
          <Search className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search plugins, files, folders & skills"
            className="w-full bg-transparent text-xs text-foreground placeholder:text-[#737373] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
