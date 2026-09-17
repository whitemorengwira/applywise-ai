"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Send,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Database,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ControlChatMessage, ControlRuntimeStatus, PendingApprovalAction } from "@/lib/control/types";

function getTimestamp(): string {
  return new Date().toISOString();
}

let msgSeq = 0;
function createMessageId(prefix: string): string {
  msgSeq += 1;
  return `${prefix}-${Date.now()}-${msgSeq}`;
}

const INITIAL_MESSAGE: ControlChatMessage = {
  id: "welcome-msg",
  role: "assistant",
  content:
    "Welcome to the ApplyWise AI Control Centre. I am your authoritative operational control plane. I coordinate specialized agents for job discovery, geographic eligibility (SA/ZW/MW Remote, Hybrid, On-site), candidate evidence RAG, grounded cover letters, cryptographic CV integrity, and cloud scheduler telemetry. How can I assist you?",
  timestamp: "2026-09-17T12:00:00.000Z",
  intent: "CONVERSATION",
  runtimeStatus: "REAL_AI",
};

const SUGGESTED_ACTIONS = [
  "hi",
  "What can you do?",
  "What is the current system status?",
  "What AI model is currently running?",
  "Find current AI architect jobs in South Africa",
  "Explain why the top result is eligible",
  "What AWS architecture evidence do I have?",
  "When did the last autonomous cycle run?",
  "How many applications did you submit this week?",
];

export default function ControlCentrePage() {
  const [messages, setMessages] = React.useState<ControlChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeModel, setActiveModel] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("applywise_active_model") || "nemotron-3-ultra-free";
    }
    return "nemotron-3-ultra-free";
  });
  const [runtimeStatus, setRuntimeStatus] = React.useState<ControlRuntimeStatus>("REAL_AI");
  const [pendingApproval, setPendingApproval] = React.useState<PendingApprovalAction | null>(null);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Sync active model from localStorage and listen to changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleModelChange = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail) setActiveModel(customEvent.detail);
      };
      window.addEventListener("applywise_model_changed", handleModelChange);
      return () => window.removeEventListener("applywise_model_changed", handleModelChange);
    }
  }, []);

  // Fetch initial system and runtime status
  React.useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/control/status");
        if (res.ok) {
          const data = await res.json();
          if (data.aiModel?.runtimeStatus) {
            setRuntimeStatus(data.aiModel.runtimeStatus);
          }
        }
      } catch (err) {
        console.warn("Failed to load initial control plane status:", err);
      }
    }
    loadStatus();
  }, []);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendMessage = async (textToSend: string, approvedActionId?: string) => {
    if (!textToSend.trim() && !approvedActionId) return;
    if (isLoading) return;

    const userText = textToSend.trim();
    if (userText) {
      const userMsg: ControlChatMessage = {
        id: createMessageId("user"),
        role: "user",
        content: userText,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/control/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          modelOverride: activeModel,
          approvedActionId,
          actionConfirmed: !!approvedActionId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.runtimeStatus) setRuntimeStatus(data.runtimeStatus);
        if (data.requiresApproval && data.pendingAction) {
          setPendingApproval(data.pendingAction);
        } else {
          setPendingApproval(null);
        }

        const assistantMsg: ControlChatMessage = {
          id: data.auditId || createMessageId("asst"),
          role: "assistant",
          content: data.message,
          timestamp: data.timestamp || getTimestamp(),
          intent: data.intent,
          runtimeStatus: data.runtimeStatus,
          plan: data.plan,
          execution: data.execution,
          result: data.result,
          evidence: data.evidence,
          nextActions: data.nextActions,
          toolCalls: data.toolCalls,
          pendingAction: data.pendingAction,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: ControlChatMessage = {
          id: createMessageId("err"),
          role: "assistant",
          content: `Operational Error: ${data.error || "Failed to process control plane request."}`,
          timestamp: getTimestamp(),
          runtimeStatus: "DEGRADED",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: ControlChatMessage = {
        id: createMessageId("err"),
        role: "assistant",
        content: `Network / Gateway Error: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: getTimestamp(),
        runtimeStatus: "DEGRADED",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (actionId: string, confirmed: boolean) => {
    if (!confirmed) {
      setPendingApproval(null);
      const cancelMsg: ControlChatMessage = {
        id: createMessageId("cancel"),
        role: "assistant",
        content: "Action cancelled. The application has been preserved in PREPARED status without submission.",
        timestamp: getTimestamp(),
        intent: "APPLICATION_SUBMISSION",
      };
      setMessages((prev) => [...prev, cancelMsg]);
      return;
    }
    await handleSendMessage("", actionId);
  };

  return (
    <AppShell pageTitle="ApplyWise AI Control Centre">
      <div className="flex flex-col h-[calc(100vh-5rem)] space-y-4">
        {/* Top Control Plane Status Bar */}
        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur-md shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground flex items-center gap-2">
                  ApplyWise AI Control Centre
                  <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary">
                    ORCHESTRATOR
                  </Badge>
                </h1>
                <p className="text-xs text-foreground-muted">
                  Intelligent conversational orchestration & multi-agent operational control
                </p>
              </div>
            </div>

            {/* Runtime Telemetry Indicators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60">
                <Cpu className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-foreground-muted">Model:</span>
                <span className="font-semibold text-foreground truncate max-w-[140px]">
                  {activeModel.replace("opencode/", "").replace(":free", "")}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60">
                <span
                  className={`h-2 w-2 rounded-full ${
                    runtimeStatus === "REAL_AI"
                      ? "bg-emerald-400 animate-pulse"
                      : runtimeStatus === "AI_RUNTIME_UNAVAILABLE" || runtimeStatus === "UNAVAILABLE"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
                <span className="text-foreground-muted">Runtime:</span>
                <span
                  className={`font-semibold ${
                    runtimeStatus === "REAL_AI"
                      ? "text-emerald-400"
                      : runtimeStatus === "AI_RUNTIME_UNAVAILABLE" || runtimeStatus === "UNAVAILABLE"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {runtimeStatus}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-foreground-muted">Supabase:</span>
                <span className="font-semibold text-emerald-400">13 Chunks</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-foreground-muted">Scheduler:</span>
                <span className="font-semibold text-foreground">0 6 * * *</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-foreground-muted">Master CV:</span>
                <span className="font-semibold text-emerald-400">3994A09C</span>
              </div>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider mr-1">
              Quick Inquiries:
            </span>
            {SUGGESTED_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(action)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-md bg-secondary/40 text-foreground-muted hover:text-foreground hover:bg-secondary/80 border border-border/40 transition-colors cursor-pointer"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
          {/* Chat Stream (3 cols) */}
          <div className="lg:col-span-3 flex flex-col rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const isExpanded = expandedSections[msg.id];

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-3xl rounded-2xl p-4 space-y-3 ${
                        isUser
                          ? "bg-primary text-primary-foreground ml-8"
                          : "bg-[#0b1120] border border-border/80 text-foreground mr-8 shadow-sm"
                      }`}
                    >
                      {/* Header bar of message */}
                      <div className="flex items-center justify-between gap-3 text-[11px] opacity-75 font-mono border-b border-border/40 pb-1.5">
                        <span className="font-semibold">
                          {isUser ? "Candidate / Operator" : "ApplyWise Control Plane"}
                        </span>
                        <div className="flex items-center gap-2">
                          {msg.intent && (
                            <Badge variant="outline" className="text-[9px] py-0 font-mono">
                              {msg.intent}
                            </Badge>
                          )}
                          {msg.runtimeStatus && (
                            <span
                              className={`text-[9px] ${
                                msg.runtimeStatus === "REAL_AI"
                                  ? "text-emerald-400"
                                  : "text-amber-400"
                              }`}
                            >
                              [{msg.runtimeStatus}]
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Message Text */}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Structured Operation Details (PLAN / EXECUTION / RESULT / EVIDENCE) */}
                      {(msg.plan || msg.execution || msg.result || msg.evidence) && (
                        <div className="pt-2 border-t border-border/50">
                          <button
                            onClick={() => toggleExpand(msg.id)}
                            className="flex items-center justify-between w-full text-xs text-primary hover:text-primary-hover font-mono py-1 cursor-pointer"
                          >
                            <span>Operational Trace & Evidence</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 p-3 rounded-xl bg-secondary/40 border border-border/60 space-y-2 text-xs font-mono animate-in fade-in duration-150">
                              {msg.plan && (
                                <div>
                                  <span className="font-semibold text-purple-400">PLAN: </span>
                                  <span className="text-foreground-muted">{msg.plan}</span>
                                </div>
                              )}
                              {msg.execution && (
                                <div>
                                  <span className="font-semibold text-blue-400">EXECUTION: </span>
                                  <span className="text-foreground-muted">{msg.execution}</span>
                                </div>
                              )}
                              {msg.result && (
                                <div>
                                  <span className="font-semibold text-emerald-400">RESULT: </span>
                                  <span className="text-foreground-muted">{msg.result}</span>
                                </div>
                              )}
                              {msg.evidence && (
                                <div>
                                  <span className="font-semibold text-amber-400">EVIDENCE: </span>
                                  <span className="text-foreground-muted">{msg.evidence}</span>
                                </div>
                              )}

                              {/* Tool Call Records */}
                              {msg.toolCalls && msg.toolCalls.length > 0 && (
                                <div className="pt-1.5 border-t border-border/40">
                                  <span className="font-semibold text-foreground-subtle block mb-1">
                                    TOOLS EXECUTED:
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {msg.toolCalls.map((tc, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded bg-background/60 border border-border/60 text-[10px] text-foreground-muted"
                                      >
                                        `{tc.toolName}` ({tc.latencyMs}ms)
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Next Actions Chips */}
                      {msg.nextActions && msg.nextActions.length > 0 && (
                        <div className="pt-2 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase font-mono text-foreground-subtle mr-1">
                            Suggested Next:
                          </span>
                          {msg.nextActions.map((na, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(na)}
                              disabled={isLoading}
                              className="text-[11px] px-2 py-0.5 rounded bg-secondary/50 text-foreground-muted hover:text-foreground hover:bg-secondary border border-border/50 transition-colors cursor-pointer"
                            >
                              {na}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Action Approval Banner */}
              {pendingApproval && (
                <div className="rounded-2xl border-2 border-amber-500/60 bg-amber-500/10 p-4 backdrop-blur-md shadow-lg space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Action Approval Required</span>
                  </div>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {pendingApproval.description}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApproval(pendingApproval.actionId, true)}
                      disabled={isLoading}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Confirm & Submit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(pendingApproval.actionId, false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-foreground-muted font-mono p-3 rounded-xl bg-card border border-border/60 w-fit">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Control Plane Orchestrator evaluating intent & coordinating agents...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-border/80 bg-card/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question, inspect system state, or request an operational agent workflow..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-secondary/50 border border-border/80 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading || !inputValue.trim()}
                  className="rounded-xl px-4 py-2.5 gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Activity & Diagnostics Panel (1 col) */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 overflow-y-auto text-xs">
            <div>
              <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 mb-2">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Specialized Agents
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Candidate Intelligence", status: "READY", color: "text-emerald-400" },
                  { name: "Job Discovery", status: "ACTIVE", color: "text-emerald-400" },
                  { name: "Eligibility Engine", status: "STRICT", color: "text-emerald-400" },
                  { name: "Candidate RAG", status: "INDEXED", color: "text-emerald-400" },
                  { name: "Cover Letter Studio", status: "GROUNDED", color: "text-emerald-400" },
                  { name: "LangGraph Orchestrator", status: "READY", color: "text-emerald-400" },
                  { name: "Cloud Scheduler", status: "0 6 * * *", color: "text-purple-400" },
                  { name: "Observability Agent", status: "ACTIVE", color: "text-emerald-400" },
                ].map((agent, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/40"
                  >
                    <span className="text-foreground-muted">{agent.name}</span>
                    <span className={`font-mono text-[10px] font-semibold ${agent.color}`}>
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60">
              <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Governance & Policies
              </h3>
              <ul className="space-y-1.5 text-[11px] text-foreground-muted leading-relaxed">
                <li>• **CV Immutability**: Exact SHA-256 byte lock. Zero mutations permitted.</li>
                <li>• **Geography**: SA, ZW, MW Remote, Hybrid, and On-site eligible.</li>
                <li>• **Free Tier**: 100% zero-cost operation under `FREE_ONLY_MODE=true`.</li>
                <li>• **Grounding**: Strict &gt;= 75% threshold. Zero hallucinations.</li>
                <li>• **Safety**: Mutating dispatches require explicit confirmation.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
