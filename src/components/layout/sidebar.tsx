"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  FileText,
  Sparkles,
  Bot,
  BarChart3,
  Settings,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Zap,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelSwitcher } from "./model-switcher";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Core",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Control Centre", href: "/control", icon: Terminal, badge: "Orchestrator" },
      { title: "Job Discovery", href: "/jobs", icon: Briefcase, badge: "Live" },
      { title: "Applications", href: "/applications", icon: Layers },
    ],
  },
  {
    label: "AI Studio",
    items: [
      { title: "CV Studio", href: "/cv-studio", icon: FileText },
      { title: "Cover Letters", href: "/cover-letters", icon: Sparkles },
      { title: "Agentic RAG", href: "/rag-search", icon: BrainCircuit, badge: "AI" },
      { title: "AI Interviewer", href: "/interviews", icon: Bot },
    ],
  },
  {
    label: "Insights & Config",
    items: [
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-[#070b14] transition-all duration-300 select-none z-30",
        collapsed ? "w-18" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/80">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(14,165,233,0.3)]">
            <Zap className="h-5 w-5 fill-primary text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                ApplyWise<span className="text-primary font-mono text-xs px-1.5 py-0.5 rounded bg-primary/20 border border-primary/30">AI</span>
              </span>
              <span className="text-[11px] text-foreground-subtle tracking-wide uppercase font-semibold">
                Autonomous Job OS
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:bg-secondary transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                {group.label}
              </h4>
            )}
            <div className="space-y-1 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group relative",
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                        : "text-foreground-muted hover:bg-secondary/70 hover:text-foreground"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-foreground-muted group-hover:text-foreground"
                      )}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.title}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                          item.badge === "Live"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-primary/20 text-primary border border-primary/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive OpenCode Zen Model Switcher */}
      <div className="border-t border-border/80 bg-[#050811]/60">
        <ModelSwitcher collapsed={collapsed} />
      </div>
    </aside>
  );
}
