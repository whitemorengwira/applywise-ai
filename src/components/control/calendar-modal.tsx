"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Plus,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
  type: "TECHNICAL_INTERVIEW" | "EXECUTIVE_SCREEN" | "SYSTEM_DESIGN" | "AUTONOMOUS_CYCLE";
  meetingUrl?: string;
  notes: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Technical Architecture Deep-Dive",
    company: "Entelect South Africa",
    date: "2026-09-22",
    time: "10:00 - 11:00 CAT",
    type: "TECHNICAL_INTERVIEW",
    meetingUrl: "https://meet.google.com/ent-tech-arch",
    notes: "Review distributed system patterns, Next.js 15 SSR architecture, and pgvector scalability.",
  },
  {
    id: "evt-2",
    title: "Executive Leadership & Cultural Alignment",
    company: "IQbusiness",
    date: "2026-09-24",
    time: "14:00 - 14:45 CAT",
    type: "EXECUTIVE_SCREEN",
    meetingUrl: "https://meet.google.com/iqb-exec-round",
    notes: "Discussion on senior stakeholder management and leading teams across Southern Africa.",
  },
  {
    id: "evt-3",
    title: "AI & Cloud Architecture Presentation",
    company: "Econet Wireless Zimbabwe",
    date: "2026-09-26",
    time: "11:30 - 12:30 CAT",
    type: "SYSTEM_DESIGN",
    meetingUrl: "https://meet.google.com/eco-sys-design",
    notes: "Presentation on telco AI billing gateways and microservices fault tolerance.",
  },
  {
    id: "evt-4",
    title: "ApplyWise AI Autonomous Cloud Cycle",
    company: "ApplyWise Cloud Scheduler",
    date: "Daily",
    time: "08:00 UTC",
    type: "AUTONOMOUS_CYCLE",
    notes: "Automated Vercel cron execution polling African and global vacancy feeds.",
  },
];

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEventToDiscuss?: (event: CalendarEvent) => void;
}

export function CalendarModal({
  isOpen,
  onClose,
  onSelectEventToDiscuss,
}: CalendarModalProps) {
  const [events, setEvents] = React.useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");

  if (!isOpen) return null;

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      date: newDate || "2026-09-28",
      time: newTime || "14:00 CAT",
      type: "TECHNICAL_INTERVIEW",
      notes: "Scheduled via ApplyWise AI Google Calendar Connector.",
    };

    setEvents([newEvt, ...events]);
    setIsAdding(false);
    setNewTitle("");
    setNewCompany("");
    setNewDate("");
    setNewTime("");
  };

  const getTypeBadge = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "TECHNICAL_INTERVIEW":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-400 font-mono text-[10px]">Technical</Badge>;
      case "SYSTEM_DESIGN":
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 font-mono text-[10px]">System Design</Badge>;
      case "EXECUTIVE_SCREEN":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-mono text-[10px]">Executive</Badge>;
      default:
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-[10px]">Autonomous</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-border/90 bg-[#090d16] p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Google Calendar Integration</h3>
                <Badge variant="outline" className="text-[10px] font-mono border-blue-500/40 text-blue-400">
                  Synchronized
                </Badge>
              </div>
              <p className="text-xs text-foreground-muted">
                Manage upcoming interviews, recruiter calls, and autonomous pipeline schedules.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Add Event Form Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-foreground-subtle">
            {events.length} Scheduled Events
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(!isAdding)}
            className="h-7 text-xs gap-1 border-blue-500/40 text-blue-400"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isAdding ? "Cancel" : "Add Interview Event"}</span>
          </Button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddEvent} className="p-3 rounded-xl bg-card/80 border border-blue-500/40 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Interview Title (e.g. Lead Architect Round)"
                className="rounded-lg bg-background/80 border border-border/70 p-2 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Company (e.g. Entelect, AWS)"
                className="rounded-lg bg-background/80 border border-border/70 p-2 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                placeholder="Date (YYYY-MM-DD)"
                className="rounded-lg bg-background/80 border border-border/70 p-2 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Time (e.g. 10:00 - 11:00 CAT)"
                className="rounded-lg bg-background/80 border border-border/70 p-2 text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" className="h-7 text-xs bg-blue-500 hover:bg-blue-600 text-white">
                Save to Calendar
              </Button>
            </div>
          </form>
        )}

        {/* Event List */}
        <div className="space-y-2 overflow-y-auto flex-1 p-1">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl border border-border/70 bg-card/40 hover:bg-card/70 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{evt.title}</span>
                  <span className="text-xs text-cyan-400 font-mono">• {evt.company}</span>
                </div>
                {getTypeBadge(evt.type)}
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-foreground-subtle">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-blue-400" />
                  {evt.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-400" />
                  {evt.time}
                </span>
                {evt.meetingUrl && (
                  <a
                    href={evt.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <Video className="h-3 w-3" />
                    Google Meet
                  </a>
                )}
              </div>

              <p className="text-[11px] text-foreground-muted">{evt.notes}</p>

              {onSelectEventToDiscuss && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEventToDiscuss(evt);
                      onClose();
                    }}
                    className="text-[10px] font-mono text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Prepare Interview Questions for this Session
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <span className="text-[10px] font-mono text-foreground-subtle flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            Calendar Two-Way Sync Active
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
