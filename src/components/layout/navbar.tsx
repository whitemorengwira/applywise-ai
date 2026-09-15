"use client";

import * as React from "react";
import { Bell, Search, UserCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-[#080c16]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Search jobs, skills, companies... (Cmd+K)"
            className="h-9 w-64 rounded-lg border border-border bg-secondary/30 pl-9 pr-4 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* System Health Badge */}
        <Badge variant="success" className="hidden sm:inline-flex gap-1.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px]">ALL SYSTEMS NOMINAL</span>
        </Badge>

        {/* Notifications */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground-muted hover:bg-secondary hover:text-foreground transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold text-xs font-mono">
            NW
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-medium text-foreground leading-tight flex items-center gap-1">
              N. White
              <UserCheck className="h-3 w-3 text-emerald-400" />
            </span>
            <span className="text-[10px] text-foreground-subtle">
              Principal Architect
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
