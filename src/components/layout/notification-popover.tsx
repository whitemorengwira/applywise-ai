"use client";

import * as React from "react";
import {
  Bell,
  Volume2,
  VolumeX,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotificationService, SystemNotification } from "@/lib/services/notification.service";
import Link from "next/link";

export function NotificationPopover() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<SystemNotification[]>(() =>
    NotificationService.getNotifications()
  );
  const [filter, setFilter] = React.useState<"ALL" | "JOBS" | "APPLICATIONS" | "ALERTS">("ALL");
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [activeReadingId, setActiveReadingId] = React.useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Subscribe to real-time notification changes
  React.useEffect(() => {
    const unsubscribe = NotificationService.subscribe((updated) => {
      setNotifications(updated);
    });
    return () => unsubscribe();
  }, []);

  // Click outside listener to close popover
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = React.useMemo(() => {
    switch (filter) {
      case "JOBS":
        return notifications.filter((n) => n.type === "NEW_JOB");
      case "APPLICATIONS":
        return notifications.filter((n) => n.type === "APPLICATION_SUBMITTED");
      case "ALERTS":
        return notifications.filter((n) => n.type === "SYSTEM_ALERT" || n.type === "INTERVIEW_UPDATE");
      default:
        return notifications;
    }
  }, [notifications, filter]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead();
  };

  const handleClearAll = () => {
    NotificationService.clearAll();
  };

  const handleReadAloud = async (id?: string) => {
    if (isSpeaking) {
      NotificationService.stopReading();
      setIsSpeaking(false);
      setActiveReadingId(null);
      return;
    }

    setIsSpeaking(true);
    setActiveReadingId(id || "all");

    if (id) {
      NotificationService.markAsRead(id);
    } else {
      NotificationService.markAllAsRead();
    }

    await NotificationService.readNotificationAloud(id);
    setIsSpeaking(false);
    setActiveReadingId(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Notification Bell Button with Live Unread Badge */}
      <button
        type="button"
        onClick={handleToggleOpen}
        title="Notifications & 24/7 Job Alerts"
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all relative cursor-pointer ${
          isOpen
            ? "border-primary bg-primary/20 text-primary"
            : "border-border text-foreground-muted hover:bg-secondary hover:text-foreground"
        }`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold font-mono text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-[420px] rounded-2xl border border-border/80 bg-[#0c111d] shadow-2xl p-0 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl text-foreground">
          {/* Header Bar */}
          <div className="p-3.5 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/20 text-primary border border-primary/40 flex items-center justify-center">
                <Bell className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-foreground-subtle">
                  24/7 live job alerts & autonomous submissions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-secondary/60 text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-[10px]">Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  title="Clear notifications"
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Dedicated Audio Voice Reader Agent Bar */}
          <div className="px-3.5 py-2 border-b border-border/50 bg-[#121826] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
                <Sparkles className="h-3 w-3" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-foreground block truncate">
                  Notification Voice Agent
                </span>
                <span className="text-[10px] text-foreground-subtle flex items-center gap-1">
                  <Radio className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
                  {isSpeaking ? "Reading notifications aloud..." : "Synthesizes recent job alerts aloud"}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant={isSpeaking ? "destructive" : "outline"}
              onClick={() => handleReadAloud()}
              className="h-7 text-[11px] gap-1.5 shrink-0"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3 w-3" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3 w-3 text-purple-400" />
                  <span>Read Aloud</span>
                </>
              )}
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 py-1.5 border-b border-border/40 flex items-center gap-1 text-[11px] font-medium overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "ALL"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-foreground-muted hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("JOBS")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "JOBS"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-foreground-muted hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              Fresh Jobs ({notifications.filter((n) => n.type === "NEW_JOB").length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("APPLICATIONS")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "APPLICATIONS"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-foreground-muted hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              Applied ({notifications.filter((n) => n.type === "APPLICATION_SUBMITTED").length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("ALERTS")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === "ALERTS"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-foreground-muted hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              System
            </button>
          </div>

          {/* Notification List Container */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40 p-1">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto opacity-70" />
                <p className="text-xs text-foreground-muted font-medium">No notifications in this view</p>
                <p className="text-[11px] text-foreground-subtle">
                  24/7 discovery agent is actively monitoring free portals
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => {
                const isItemSpeaking = isSpeaking && activeReadingId === n.id;
                return (
                  <div
                    key={n.id}
                    className={`p-3 transition-colors hover:bg-secondary/40 rounded-xl space-y-1.5 ${
                      !n.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {!n.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        )}
                        <span className="text-xs font-bold text-foreground">
                          {n.title}
                        </span>
                        {n.portalSource && (
                          <Badge variant="outline" className="text-[9px] font-mono py-0 text-primary border-primary/40">
                            {n.portalSource}
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-foreground-subtle font-mono shrink-0">
                        {n.timeAgo}
                      </span>
                    </div>

                    {n.company && (
                      <div className="text-[11px] text-foreground-muted flex items-center gap-1.5">
                        <Briefcase className="h-3 w-3 text-foreground-subtle" />
                        <span className="font-semibold text-foreground">{n.company}</span>
                        {n.location && <span>• {n.location}</span>}
                      </div>
                    )}

                    {n.salaryFormatted && (
                      <div className="text-[11px] font-mono font-semibold text-emerald-400">
                        {n.salaryFormatted}
                      </div>
                    )}

                    <p className="text-[11px] text-foreground-muted leading-relaxed">
                      {n.message}
                    </p>

                    {/* Notification Actions */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <div className="flex items-center gap-1.5">
                        {n.type === "NEW_JOB" && (
                          <Link
                            href={`/browser?portal=${encodeURIComponent(n.portalSource || "Direct")}&job=${encodeURIComponent(n.title)}&url=${encodeURIComponent(n.applyUrl || "")}`}
                            onClick={() => {
                              NotificationService.markAsRead(n.id);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40 text-[10px] font-semibold transition-colors"
                          >
                            <span>Apply in Browser</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}

                        {n.type === "APPLICATION_SUBMITTED" && (
                          <Link
                            href="/applications"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/80 text-foreground hover:bg-secondary border border-border/60 text-[10px] font-medium transition-colors"
                          >
                            <span>View in Ledger</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => handleReadAloud(n.id)}
                          title="Read this alert aloud"
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] transition-colors cursor-pointer ${
                            isItemSpeaking
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                              : "bg-secondary/40 text-foreground-subtle hover:text-foreground border-border/40"
                          }`}
                        >
                          <Volume2 className="h-2.5 w-2.5 text-purple-400" />
                          <span>{isItemSpeaking ? "Reading..." : "Listen"}</span>
                        </button>
                      </div>

                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={() => NotificationService.markAsRead(n.id)}
                          title="Mark as read"
                          className="text-[10px] text-foreground-subtle hover:text-foreground flex items-center gap-0.5 cursor-pointer"
                        >
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Mark read</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 border-t border-border/60 bg-[#090d16] flex items-center justify-between text-[10px] font-mono text-foreground-subtle">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>24/7 Agent Active</span>
            </div>
            <Link
              href="/automations"
              onClick={() => setIsOpen(false)}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <span>Automations & Polling</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
