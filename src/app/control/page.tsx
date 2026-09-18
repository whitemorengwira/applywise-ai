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
  Copy,
  Check,
  RotateCcw,
  Download,
  Zap,
  TrendingUp,
  PenTool,
} from "lucide-react";
import { ControlChatMessage, ControlRuntimeStatus, PendingApprovalAction } from "@/lib/control/types";
import { ChatMarkdownRenderer } from "@/components/control/chat-markdown";

function getTimestamp(): string {
  return new Date().toISOString();
}

let msgSeq = 0;
function createMessageId(prefix: string): string {
  msgSeq += 1;
  return `${prefix}-${Date.now()}-${msgSeq}`;
}

export interface OpenCodeZenModel {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  iconName: "sparkles" | "zap" | "trending-up" | "layers" | "pen-tool";
  color: string;
  bgColor: string;
  borderColor: string;
  contextLimit: string;
  category: "OpenCode Zen";
}

export const OPENCODE_ZEN_FREE_SUITE: OpenCodeZenModel[] = [
  {
    id: "nemotron-3-ultra-free",
    name: "Nemotron 3 Ultra",
    subtitle: "Complex Reasoning & Agentic...",
    badge: "Free",
    iconName: "sparkles",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
    contextLimit: "1,000,000",
    category: "OpenCode Zen",
  },
  {
    id: "nemotron-3.5-lightning-free",
    name: "Nemotron 3.5 Lightning",
    subtitle: "Fast Extraction & Parsing",
    badge: "Free",
    iconName: "zap",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/40",
    contextLimit: "256,000",
    category: "OpenCode Zen",
  },
  {
    id: "ling-3.0-flash-fin-free",
    name: "Ling 3.0 Flash Fin",
    subtitle: "Financial & System Benchmarks",
    badge: "Free",
    iconName: "trending-up",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/40",
    contextLimit: "512,000",
    category: "OpenCode Zen",
  },
  {
    id: "mimo-v2.5-free",
    name: "MiMo V2.5",
    subtitle: "Multimodal Layout Analysis",
    badge: "Free",
    iconName: "layers",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/40",
    contextLimit: "1,000,000",
    category: "OpenCode Zen",
  },
  {
    id: "muse-spark-1.3-contributor-free",
    name: "Muse Spark 1.3",
    subtitle: "Adaptive Creative Drafting",
    badge: "Free",
    iconName: "pen-tool",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/40",
    contextLimit: "256,000",
    category: "OpenCode Zen",
  },
];

function renderModelIcon(iconName: string, colorClass: string) {
  switch (iconName) {
    case "sparkles":
      return <Sparkles className={`h-3.5 w-3.5 ${colorClass}`} />;
    case "zap":
      return <Zap className={`h-3.5 w-3.5 ${colorClass}`} />;
    case "trending-up":
      return <TrendingUp className={`h-3.5 w-3.5 ${colorClass}`} />;
    case "layers":
      return <Layers className={`h-3.5 w-3.5 ${colorClass}`} />;
    case "pen-tool":
      return <PenTool className={`h-3.5 w-3.5 ${colorClass}`} />;
    default:
      return <Sparkles className={`h-3.5 w-3.5 ${colorClass}`} />;
  }
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
  const [loadingStatusText, setLoadingStatusText] = React.useState("Evaluating intent & coordinating domain agents...");
  const [pendingApproval, setPendingApproval] = React.useState<PendingApprovalAction | null>(null);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showModelMenu, setShowModelMenu] = React.useState(false);

  const currentModel =
    OPENCODE_ZEN_FREE_SUITE.find((m) => m.id === activeModel) || OPENCODE_ZEN_FREE_SUITE[0];

  const totalTokens = React.useMemo(() => {
    let input = 12450;
    let output = 3120;
    let reasoning = 420;
    for (const msg of messages) {
      if (msg.role === "user") input += Math.round(msg.content.length * 1.3);
      if (msg.role === "assistant") {
        output += Math.round(msg.content.length * 0.9);
        reasoning += Math.round(msg.content.length * 0.15);
      }
    }
    return { input, output, reasoning, total: input + output + reasoning };
  }, [messages]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

  const handleCopyMessage = (id: string, content: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: createMessageId("welcome"),
        role: "assistant",
        content:
          "Conversation cleared. I am ready for your next command, inquiry, or operational workflow.",
        timestamp: getTimestamp(),
        intent: "CONVERSATION",
        runtimeStatus: "REAL_AI",
      },
    ]);
  };

  const handleExportTranscript = () => {
    const lines = [
      `# ApplyWise AI Control Centre — Conversation Transcript`,
      `**Exported At**: ${new Date().toISOString()}`,
      `**Active Model**: ${activeModel}`,
      `**Runtime Status**: ${runtimeStatus}`,
      `**Master CV SHA-256**: 3994A09C2...`,
      ``,
      `---`,
      ``,
    ];

    for (const msg of messages) {
      const author = msg.role === "user" ? "Candidate / Operator" : "ApplyWise Control Plane";
      const intentTag = msg.intent ? ` [${msg.intent}]` : "";
      lines.push(`### ${author}${intentTag} (${msg.timestamp})`);
      lines.push(``);
      lines.push(msg.content);
      lines.push(``);
      if (msg.plan || msg.execution || msg.result || msg.evidence) {
        lines.push(`> **Trace**:`);
        if (msg.plan) lines.push(`> - PLAN: ${msg.plan}`);
        if (msg.execution) lines.push(`> - EXECUTION: ${msg.execution}`);
        if (msg.result) lines.push(`> - RESULT: ${msg.result}`);
        if (msg.evidence) lines.push(`> - EVIDENCE: ${msg.evidence}`);
        lines.push(``);
      }
      lines.push(`---`);
      lines.push(``);
    }

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applywise-transcript-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleModelSelect = (newModel: string) => {
    setActiveModel(newModel);
    if (typeof window !== "undefined") {
      localStorage.setItem("applywise_active_model", newModel);
      window.dispatchEvent(new CustomEvent("applywise_model_changed", { detail: newModel }));
    }
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    const lowerText = userText.toLowerCase();
    let initialProgress = "Evaluating intent & coordinating domain agents...";
    if (lowerText.includes("cv") || lowerText.includes("hash") || lowerText.includes("sha")) {
      initialProgress = "Validating Master CV cryptographic SHA-256 hash...";
    } else if (
      lowerText.includes("architect") ||
      lowerText.includes("background") ||
      lowerText.includes("experience") ||
      lowerText.includes("earcodex") ||
      lowerText.includes("supabets") ||
      lowerText.includes("nico") ||
      lowerText.includes("socinga") ||
      lowerText.includes("samf") ||
      lowerText.includes("aws") ||
      lowerText.includes("terraform") ||
      lowerText.includes("evidence")
    ) {
      initialProgress = "Executing tool: query_rag & synthesizing candidate evidence...";
    } else if (lowerText.includes("job") || lowerText.includes("find") || lowerText.includes("search")) {
      initialProgress = "Executing tool: search_jobs across African markets...";
    } else if (lowerText.includes("scheduler") || lowerText.includes("cycle") || lowerText.includes("cron")) {
      initialProgress = "Executing tool: get_scheduler_status & checking lease locks...";
    } else if (lowerText.includes("model") || lowerText.includes("runtime")) {
      initialProgress = "Executing tool: get_ai_model_status & verifying provider...";
    } else if (lowerText.includes("observability") || lowerText.includes("grafana") || lowerText.includes("metrics")) {
      initialProgress = "Executing tool: get_observability_status...";
    } else if (lowerText.includes("prepare")) {
      initialProgress = "Executing tool: prepare_application via LangGraph...";
    }
    setLoadingStatusText(initialProgress);

    // Build multi-turn conversational history payload (last 10 turns)
    const historyPayload = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
      intent: m.intent,
    }));

    try {
      const storedApiKey = typeof window !== "undefined" ? localStorage.getItem("applywise_api_key") || undefined : undefined;
      const storedProvider = typeof window !== "undefined" ? localStorage.getItem("applywise_ai_provider") || undefined : undefined;

      const res = await fetch("/api/control/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          modelOverride: activeModel,
          apiKeyOverride: storedApiKey,
          providerOverride: storedProvider,
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

            {/* Runtime Telemetry Indicators & Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Interactive Model Selector Dropdown */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60">
                <Cpu className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="text-foreground-muted">Model:</span>
                <select
                  value={activeModel}
                  onChange={(e) => handleModelSelect(e.target.value)}
                  className="bg-transparent font-semibold text-foreground text-xs focus:outline-none cursor-pointer border-none"
                >
                  {OPENCODE_ZEN_FREE_SUITE.map((m) => (
                    <option key={m.id} value={m.id} className="bg-card text-foreground">
                      {m.name} (Free)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 border border-border/60">
                <span
                  className={`h-2 w-2 rounded-full ${
                    runtimeStatus === "REAL_AI"
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-purple-400"
                  }`}
                />
                <span className="text-foreground-muted">Engine:</span>
                <span
                  className={`font-semibold ${
                    runtimeStatus === "REAL_AI"
                      ? "text-emerald-400"
                      : "text-purple-300"
                  }`}
                >
                  {runtimeStatus === "REAL_AI" ? "Real AI (Live)" : "OpenCode Zen (Free Tier)"}
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

              {/* Action Buttons: Export & Clear */}
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={handleExportTranscript}
                  title="Export conversation transcript as Markdown"
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-secondary/40 text-foreground-muted hover:text-foreground hover:bg-secondary/80 border border-border/40 transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-secondary/40 text-foreground-muted hover:text-rose-400 hover:bg-rose-500/10 border border-border/40 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear</span>
                </button>
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
          <div className="lg:col-span-3 min-w-0 flex flex-col rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden">
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
                          {msg.intent && msg.intent !== "CONVERSATION" && (
                            <Badge variant="outline" className="text-[9px] py-0 font-mono">
                              {msg.intent.replace(/_/g, " ")}
                            </Badge>
                          )}
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1 ${
                              msg.runtimeStatus === "REAL_AI"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                msg.runtimeStatus === "REAL_AI" ? "bg-emerald-400 animate-pulse" : "bg-purple-400"
                              }`}
                            />
                            {msg.runtimeStatus === "REAL_AI" ? "Real AI • Live" : "OpenCode Zen • Free Grounded"}
                          </span>
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            title="Copy message content"
                            className="p-1 rounded hover:bg-secondary/80 text-foreground-subtle hover:text-foreground transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-sans">
                                <Check className="h-3 w-3" /> Copied
                              </span>
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Main Message Text */}
                      {isUser ? (
                        <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>
                      ) : (
                        <ChatMarkdownRenderer content={msg.content} />
                      )}

                      {/* Structured Operation Details (PLAN / EXECUTION / RESULT / EVIDENCE) */}
                      {msg.intent !== "CONVERSATION" && (msg.plan || msg.execution || msg.result || msg.evidence) && (
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
                <div className="flex items-center gap-2.5 text-xs text-foreground-muted font-mono p-3 rounded-xl bg-card/90 border border-primary/40 shadow-[0_0_15px_rgba(14,165,233,0.15)] w-fit animate-in fade-in duration-150">
                  <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                  <span className="text-foreground font-semibold">{loadingStatusText}</span>
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
                className="flex flex-col gap-1.5"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    placeholder="Ask a question, inspect system state, or request an operational agent workflow..."
                    disabled={isLoading}
                    className="flex-1 max-h-44 min-h-[44px] resize-none rounded-xl bg-secondary/50 border border-border/80 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isLoading || !inputValue.trim()}
                    className="rounded-xl px-4 py-2.5 gap-2 shrink-0 h-[44px]"
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
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
                  {/* OpenCode Zen Model Selector Button directly inside chat input */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowModelMenu(!showModelMenu)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary border border-border/80 text-xs text-foreground font-medium transition-all shadow-sm cursor-pointer"
                    >
                      {renderModelIcon(currentModel.iconName, currentModel.color)}
                      <span className="font-mono text-[11px] font-semibold">{currentModel.name} Free</span>
                      <ChevronDown className="h-3 w-3 text-foreground-subtle ml-0.5" />
                    </button>

                    {showModelMenu && (
                      <div className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl bg-[#0e1726] border border-border/80 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl">
                        <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider border-b border-border/50">
                          <span className="text-foreground font-mono">OpenCode Zen</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">100% Free Tier</span>
                        </div>
                        <div className="space-y-1">
                          {OPENCODE_ZEN_FREE_SUITE.map((m) => {
                            const isSelected = activeModel === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  handleModelSelect(m.id);
                                  setShowModelMenu(false);
                                }}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-950/60 border border-purple-500/50 text-foreground shadow-sm"
                                    : "hover:bg-secondary/60 text-foreground-muted hover:text-foreground border border-transparent"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`p-2 rounded-lg ${m.bgColor} ${m.borderColor} border shrink-0`}>
                                    {renderModelIcon(m.iconName, m.color)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
                                      <span>{m.name}</span>
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-secondary text-foreground-subtle font-mono">Free</span>
                                    </div>
                                    <div className="text-[11px] text-foreground-subtle truncate">{m.subtitle}</div>
                                  </div>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-purple-400 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-foreground-subtle px-1 font-mono">
                    <span>Press <kbd className="px-1 py-0.5 rounded bg-secondary/60 border border-border/40 text-foreground-muted">Enter ↵</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-secondary/60 border border-border/40 text-foreground-muted">Shift + Enter</kbd> for new line</span>
                    {inputValue.length > 0 && <span>• {inputValue.length} chars</span>}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Activity & Diagnostics Panel (1 col) */}
          <div className="lg:col-span-1 min-w-0 flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 overflow-y-auto text-xs">
            {/* OpenCode Zen Session Context Panel (from OpenCode Desktop) */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-foreground">Session Context</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                  OpenCode Zen
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-subtle">Session</span>
                  <span className="font-medium text-foreground truncate max-w-[140px]" title="ApplyWise AI Autonomous Control">Career Engineering</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-subtle">Provider</span>
                  <span className="font-semibold text-foreground">OpenCode Zen</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-subtle">Model</span>
                  <span className="font-semibold text-purple-300 truncate max-w-[140px]">{currentModel.name} Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-subtle">Context Limit</span>
                  <span className="font-mono text-foreground">{currentModel.contextLimit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-subtle">Total Cost</span>
                  <span className="font-mono font-bold text-emerald-400">$0.00</span>
                </div>

                {/* Token Counters */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono">
                  <div className="p-1 rounded bg-card/60 border border-border/40">
                    <div className="text-[9px] text-foreground-subtle">Input</div>
                    <div className="text-[11px] font-bold text-foreground">{totalTokens.input.toLocaleString()}</div>
                  </div>
                  <div className="p-1 rounded bg-card/60 border border-border/40">
                    <div className="text-[9px] text-foreground-subtle">Output</div>
                    <div className="text-[11px] font-bold text-foreground">{totalTokens.output.toLocaleString()}</div>
                  </div>
                  <div className="p-1 rounded bg-card/60 border border-border/40">
                    <div className="text-[9px] text-foreground-subtle">Reasoning</div>
                    <div className="text-[11px] font-bold text-purple-300">{totalTokens.reasoning.toLocaleString()}</div>
                  </div>
                </div>

                {/* Context Breakdown Meter */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-foreground-subtle">
                    <span>Context Breakdown</span>
                    <span className="font-mono">{messages.length} msgs</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
                    <div className="bg-emerald-400 h-full" style={{ width: "20%" }} title="User Input" />
                    <div className="bg-purple-400 h-full" style={{ width: "45%" }} title="Assistant Reasoning" />
                    <div className="bg-cyan-400 h-full" style={{ width: "15%" }} title="Tool Calls" />
                    <div className="bg-slate-500 h-full" style={{ width: "20%" }} title="Dossier Knowledge" />
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-foreground-subtle pt-0.5 font-mono">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"/>User</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-400 inline-block"/>Assistant</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400 inline-block"/>Tools</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-500 inline-block"/>Dossier</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 mb-2">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Specialized Agents
              </h3>
              <div className="space-y-1.5">
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
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/40 min-w-0 gap-2"
                  >
                    <span className="text-foreground-muted truncate">{agent.name}</span>
                    <span className={`font-mono text-[10px] font-semibold shrink-0 ${agent.color}`}>
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered Deterministic Domain Tools */}
            <div className="pt-3 border-t border-border/60">
              <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2 mb-2">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                Domain Tools (7)
              </h3>
              <div className="space-y-1.5">
                {[
                  { tool: "query_rag", status: "BOUND", desc: "pgvector evidence search", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                  { tool: "search_jobs", status: "BOUND", desc: "African vacancy discovery", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                  { tool: "prepare_application", status: "SAFE", desc: "LangGraph safe preparation", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
                  { tool: "get_master_cv_integrity", status: "LOCKED", desc: "SHA-256 byte invariant", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                  { tool: "get_ai_model_status", status: "ACTIVE", desc: "OpenCode Zen routing", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
                  { tool: "get_scheduler_status", status: "READY", desc: "Cloud cron execution leases", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
                  { tool: "get_observability_status", status: "ACTIVE", desc: "Prometheus & Grafana", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-1.5 rounded-lg bg-secondary/30 border border-border/40 min-w-0"
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-mono text-[11px] font-semibold text-foreground truncate">
                        `{item.tool}`
                      </span>
                      <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${item.color}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-foreground-subtle truncate">{item.desc}</p>
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
                <li>• **CV Immutability**: Exact SHA-256 byte lock (`3994A09C`). Zero mutation.</li>
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
