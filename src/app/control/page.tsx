"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Terminal,
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
  BookOpen,
  Plus,
  History,
  X,
  Brain,
  Paperclip,
  Globe,
  Search as SearchIcon,
  ArrowUp,
  Image as ImageIcon,
  Mic,
  Video as VideoIcon,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { ControlChatMessage, ControlRuntimeStatus, PendingApprovalAction } from "@/lib/control/types";
import { ChatMarkdownRenderer } from "@/components/control/chat-markdown";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { VoiceSpeaker } from "@/components/voice/voice-speaker";
import { VoiceDeliberationModal } from "@/components/voice/voice-deliberation-modal";
import { SYSTEM_GEMS, GemPersona } from "@/lib/control/gems-config";
import { KnowledgeService, CustomKnowledgeDoc } from "@/lib/services/knowledge.service";
import { CodexActionMenu } from "@/components/control/codex-action-menu";
import { SketchModal } from "@/components/control/sketch-modal";
import { LibraryModal, LibraryDocument } from "@/components/control/library-modal";
import { CalendarModal } from "@/components/control/calendar-modal";
import { GithubModal } from "@/components/control/github-modal";
import { CodexSidebar } from "@/components/control/codex-sidebar";

function extractImageUrl(data: unknown): string | null {
  if (
    data &&
    typeof data === "object" &&
    "imageUrl" in data &&
    typeof (data as { imageUrl?: unknown }).imageUrl === "string"
  ) {
    return (data as { imageUrl: string }).imageUrl;
  }
  return null;
}

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
  iconName: "sparkles" | "zap" | "trending-up" | "layers" | "pen-tool" | "image" | "mic" | "video";
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
  {
    id: "flux-1-schnell-free",
    name: "Flux.1 Schnell Free",
    subtitle: "Architecture Blueprint Image Gen",
    badge: "Free",
    iconName: "image",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/40",
    contextLimit: "4 steps",
    category: "OpenCode Zen",
  },
  {
    id: "sdxl-turbo-free",
    name: "SDXL Turbo Free",
    subtitle: "Real-Time Blueprint Diffusion",
    badge: "Free",
    iconName: "image",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/40",
    contextLimit: "1 step",
    category: "OpenCode Zen",
  },
  {
    id: "whisper-large-v3-turbo-free",
    name: "Whisper Large v3 Free",
    subtitle: "Audio Speech-to-Text & Commands",
    badge: "Free",
    iconName: "mic",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/40",
    contextLimit: "30s chunks",
    category: "OpenCode Zen",
  },
  {
    id: "kokoro-82m-free",
    name: "Kokoro 82M Free TTS",
    subtitle: "Notification Voice Reader Agent",
    badge: "Free",
    iconName: "mic",
    color: "text-purple-300",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
    contextLimit: "Streaming",
    category: "OpenCode Zen",
  },
  {
    id: "wan-2.1-t2v-free",
    name: "Wan 2.1 Video Free",
    subtitle: "System Walkthrough Video Gen",
    badge: "Free",
    iconName: "video",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/40",
    contextLimit: "5s 720p",
    category: "OpenCode Zen",
  },
  {
    id: "cogvideox-2b-free",
    name: "CogVideoX 2B Free",
    subtitle: "Visual Presentation Video Gen",
    badge: "Free",
    iconName: "video",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/40",
    contextLimit: "6s 720p",
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
    case "image":
      return <ImageIcon className={`h-3.5 w-3.5 ${colorClass}`} />;
    case "mic":
      return <Mic className={`h-3.5 w-3.5 ${colorClass}`} />;
    case "video":
      return <VideoIcon className={`h-3.5 w-3.5 ${colorClass}`} />;
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

  // Codex Experience & Plus Action Menu State
  const [isCodexSidebarOpen, setIsCodexSidebarOpen] = React.useState(true);
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false);
  const [isSketchModalOpen, setIsSketchModalOpen] = React.useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = React.useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = React.useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = React.useState(false);
  const [isVoiceDeliberationOpen, setIsVoiceDeliberationOpen] = React.useState(false);
  const [isExpandedContext, setIsExpandedContext] = React.useState(false);

  // Modes & Attachments
  const [isThinkModeActive, setIsThinkModeActive] = React.useState(false);
  const [isWebSearchActive, setIsWebSearchActive] = React.useState(false);
  const [isDeepResearchActive, setIsDeepResearchActive] = React.useState(false);
  const [attachedFiles, setAttachedFiles] = React.useState<
    Array<{ id: string; name: string; type: "image" | "file"; dataUrl: string }>
  >([]);
  const [attachedLibraryDocs, setAttachedLibraryDocs] = React.useState<LibraryDocument[]>([]);
  const [attachedSketch, setAttachedSketch] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const plusButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const isImg = file.type.startsWith("image/");
        setAttachedFiles((prev) => [
          ...prev,
          {
            id: createMessageId("file"),
            name: file.name,
            type: isImg ? "image" : "file",
            dataUrl,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleActionMenuSelect = (actionId: string) => {
    switch (actionId) {
      case "add_files":
        fileInputRef.current?.click();
        break;
      case "add_library":
        setIsLibraryModalOpen(true);
        break;
      case "create_image":
        setInputValue("Generate technical architecture blueprint diagram for ");
        textareaRef.current?.focus();
        break;
      case "sketch":
        setIsSketchModalOpen(true);
        break;
      case "web_search":
        setIsWebSearchActive((prev) => !prev);
        break;
      case "deep_research":
        setIsDeepResearchActive((prev) => !prev);
        break;
      case "google_calendar":
        setIsCalendarModalOpen(true);
        break;
      case "github":
        setIsGithubModalOpen(true);
        break;
      case "figma":
        setInputValue("Review design system tokens and component specs for ApplyWise UI");
        textareaRef.current?.focus();
        break;
      default:
        break;
    }
  };

  // Gemini-style Gems & Knowledge state
  const [activeGem, setActiveGem] = React.useState<GemPersona>(SYSTEM_GEMS[0]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = React.useState(false);
  const [knowledgeTitle, setKnowledgeTitle] = React.useState("");
  const [knowledgeContent, setKnowledgeContent] = React.useState("");
  const [knowledgeTags, setKnowledgeTags] = React.useState("");
  const [knowledgeDocs, setKnowledgeDocs] = React.useState<CustomKnowledgeDoc[]>(() =>
    KnowledgeService.getKnowledgeDocs()
  );
  const [chatHistoryList] = React.useState<
    Array<{ id: string; title: string; timestamp: string; messageCount: number }>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("applywise_chat_sessions_v1");
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });

  const handleAddKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledgeTitle.trim() || !knowledgeContent.trim()) return;
    KnowledgeService.addKnowledgeDoc({
      title: knowledgeTitle.trim(),
      category: "PROJECT_CASE_STUDY",
      content: knowledgeContent.trim(),
      tags: knowledgeTags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setKnowledgeDocs(KnowledgeService.getKnowledgeDocs());
    setKnowledgeTitle("");
    setKnowledgeContent("");
    setKnowledgeTags("");
    setShowKnowledgeModal(false);
  };

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

  // Auto-resize prompt textarea dynamically as content grows or contracts
  React.useEffect(() => {
    if (textareaRef.current) {
      if (isExpandedContext) {
        textareaRef.current.style.height = "320px";
      } else {
        textareaRef.current.style.height = "auto";
        const scrollHeight = textareaRef.current.scrollHeight;
        const targetHeight = Math.min(Math.max(scrollHeight, 72), 360);
        textareaRef.current.style.height = `${targetHeight}px`;
      }
    }
  }, [inputValue, isExpandedContext]);

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
    const rawText = (textToSend || "").trim();
    const hasAttachments = attachedFiles.length > 0 || attachedLibraryDocs.length > 0 || !!attachedSketch;
    if (!rawText && !approvedActionId && !hasAttachments) return;
    if (isLoading) return;

    const msgAttachments: ControlChatMessage["attachments"] = [];
    for (const f of attachedFiles) {
      msgAttachments.push({ id: f.id, name: f.name, type: f.type, dataUrl: f.dataUrl });
    }
    for (const d of attachedLibraryDocs) {
      msgAttachments.push({ id: d.id, name: d.title, type: "library" });
    }
    if (attachedSketch) {
      msgAttachments.push({ id: createMessageId("sketch"), name: "Architecture Sketch", type: "sketch", dataUrl: attachedSketch });
    }

    const displayContent = rawText || (msgAttachments.length > 0 ? `[Submitted ${msgAttachments.length} attachment(s)]` : "");

    const userMsg: ControlChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: displayContent,
      timestamp: getTimestamp(),
      attachments: msgAttachments.length > 0 ? msgAttachments : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);

    let enrichedPayload = rawText;
    if (attachedLibraryDocs.length > 0) {
      const docsText = attachedLibraryDocs
        .map((d) => `[LIBRARY DOC: ${d.title} (${d.filename})]: ${d.contentSnippet}`)
        .join("\n");
      enrichedPayload = `${docsText}\n\n${enrichedPayload}`;
    }
    if (isThinkModeActive) {
      enrichedPayload = `[THINK_MODE: EXTENDED_REASONING_CHAIN]\n${enrichedPayload}`;
    }
    if (isWebSearchActive) {
      enrichedPayload = `[WEB_SEARCH_ACTIVE]\n${enrichedPayload}`;
    }
    if (isDeepResearchActive) {
      enrichedPayload = `[DEEP_RESEARCH_ACTIVE]\n${enrichedPayload}`;
    }
    if (attachedSketch) {
      enrichedPayload = `[ATTACHED_SKETCH: Architecture diagram provided]\n${enrichedPayload}`;
    }

    setInputValue("");
    setAttachedFiles([]);
    setAttachedLibraryDocs([]);
    setAttachedSketch(null);

    setIsLoading(true);

    const userText = enrichedPayload;
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
        return data.message as string;
      } else {
        const errorMsg: ControlChatMessage = {
          id: createMessageId("err"),
          role: "assistant",
          content: `Operational Error: ${data.error || "Failed to process control plane request."}`,
          timestamp: getTimestamp(),
          runtimeStatus: "DEGRADED",
        };
        setMessages((prev) => [...prev, errorMsg]);
        return undefined;
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
      return undefined;
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
      <div className="flex h-[calc(100vh-5rem)] gap-3 overflow-hidden">
        {/* Codex Sidebar matching Desktop screengrabs */}
        <CodexSidebar
          isCollapsed={!isCodexSidebarOpen}
          onToggleCollapse={() => setIsCodexSidebarOpen((prev) => !prev)}
          onNewChat={handleClearChat}
          onSelectPinnedThread={(thread) => {
            setInputValue(thread.query);
            textareaRef.current?.focus();
          }}
          onOpenAction={(actionId) => handleActionMenuSelect(actionId)}
        />

        {/* Center & Right Control Workspace */}
        <div className="flex-1 flex flex-col min-w-0 space-y-3 overflow-hidden">
          {/* Top Control Plane Status Bar */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-3.5 backdrop-blur-md shadow-sm shrink-0">
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

              {/* Action Buttons: Knowledge, History, Export & Clear */}
              <div className="flex items-center gap-1.5 ml-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowKnowledgeModal(true)}
                  title="Add project dossiers, certifications, and case studies into RAG memory"
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-secondary/50 text-foreground-muted hover:text-foreground hover:bg-secondary/90 border border-border/60 transition-colors cursor-pointer"
                >
                  <BookOpen className="h-3 w-3 text-cyan-400" />
                  <span suppressHydrationWarning>Knowledge ({knowledgeDocs.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  title="Toggle Chat History Sessions"
                  className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    showHistory
                      ? "bg-primary/20 text-primary border-primary/50"
                      : "bg-secondary/50 text-foreground-muted hover:text-foreground hover:bg-secondary/90 border-border/60"
                  }`}
                >
                  <History className="h-3 w-3 text-primary" />
                  <span>History</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportTranscript}
                  title="Export conversation transcript as Markdown"
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-secondary/40 text-foreground-muted hover:text-foreground hover:bg-secondary/80 border border-border/40 transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  <span>Export</span>
                </button>

                <button
                  type="button"
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

          {/* Google Gemini-Style Executive Gems Selector Bar */}
          <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-foreground-subtle flex items-center gap-1 uppercase font-semibold shrink-0 mr-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Gems:
            </span>
            {SYSTEM_GEMS.map((gem) => {
              const isSelected = activeGem.id === gem.id;
              return (
                <button
                  key={gem.id}
                  type="button"
                  onClick={() => setActiveGem(gem)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-primary/20 text-primary border-primary/50 shadow-sm"
                      : "bg-secondary/40 text-foreground-muted border-border/70 hover:bg-secondary hover:text-foreground"
                  }`}
                  title={gem.description}
                >
                  <span>{gem.emoji}</span>
                  <span>{gem.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Suggestion Chips (Dynamic to Active Gem) */}
          <div className="mt-2 pt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider mr-1">
              {activeGem.name} Inquiries:
            </span>
            {activeGem.suggestedPrompts.map((action, i) => (
              <button
                key={i}
                type="button"
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
              {/* Agenda Hero Header matching screengrab */}
              {messages.length <= 1 && (
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center select-none animate-in fade-in duration-300">
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2 font-sans">
                    What&apos;s on the agenda today?
                  </h1>
                  <p className="text-xs sm:text-sm text-foreground-subtle max-w-md">
                    Autonomous career orchestrator, candidate RAG, and execution control plane
                  </p>
                </div>
              )}

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
                          {!isUser && msg.intent && !["CONVERSATION", "GENERAL_KNOWLEDGE", "UNKNOWN"].includes(msg.intent) && (
                            <Badge variant="outline" className="text-[9px] py-0 font-mono">
                              {msg.intent.replace(/_/g, " ")}
                            </Badge>
                          )}
                          {!isUser && msg.runtimeStatus && (
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
                          )}
                          {!isUser && <VoiceSpeaker text={msg.content} />}
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

                      {/* Attached items (files, sketch, library docs) */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {msg.attachments.map((att, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-border/60 text-xs font-mono"
                            >
                              {att.type === "image" && att.dataUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={att.dataUrl} alt={att.name} className="h-6 w-6 rounded object-cover" />
                              ) : att.type === "sketch" && att.dataUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={att.dataUrl} alt="Sketch" className="h-6 w-6 rounded object-cover border border-primary/50" />
                              ) : att.type === "library" ? (
                                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                              ) : (
                                <Paperclip className="h-3.5 w-3.5 text-slate-300" />
                              )}
                              <span className="truncate max-w-[160px] text-foreground">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Render generated architecture blueprint image if available */}
                      {msg.toolCalls?.some((tc) => extractImageUrl(tc.data)) && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-primary/40 bg-black/80 p-3 space-y-2">
                          {msg.toolCalls
                            .map((tc) => ({ tc, imgUrl: extractImageUrl(tc.data) }))
                            .filter((item): item is { tc: typeof item.tc; imgUrl: string } => Boolean(item.imgUrl))
                            .map(({ imgUrl }, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono text-primary">
                                  <span className="flex items-center gap-1.5 font-bold">
                                    <Sparkles className="h-4 w-4" />
                                    AI Architectural Blueprint (Flux Engine)
                                  </span>
                                  <a
                                    href={imgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                                  >
                                    View Full-Res ↗
                                  </a>
                                </div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={imgUrl}
                                  alt="Generated Architecture Diagram"
                                  className="w-full rounded-lg object-contain max-h-96 border border-border/70"
                                />
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Structured Operation Details (PLAN / EXECUTION / RESULT / EVIDENCE) */}
                      {!isUser &&
                        !["CONVERSATION", "GENERAL_KNOWLEDGE", "UNKNOWN"].includes(msg.intent || "") &&
                        (msg.toolCalls?.length || 0) > 0 &&
                        (msg.plan || msg.execution || msg.result || msg.evidence) && (
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

            {/* Attachment preview bar (appears above input if files, library docs, sketch, or modes are active) */}
            {(attachedFiles.length > 0 ||
              attachedLibraryDocs.length > 0 ||
              attachedSketch ||
              isThinkModeActive ||
              isWebSearchActive ||
              isDeepResearchActive) && (
              <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-t border-border/60 bg-[#161b26]/90 backdrop-blur-md">
                {isThinkModeActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Brain className="h-3 w-3" />
                    Think Active
                    <button
                      type="button"
                      onClick={() => setIsThinkModeActive(false)}
                      className="hover:text-white ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {isWebSearchActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    <Globe className="h-3 w-3" />
                    Web Search
                    <button
                      type="button"
                      onClick={() => setIsWebSearchActive(false)}
                      className="hover:text-white ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {isDeepResearchActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <SearchIcon className="h-3 w-3" />
                    Deep Research
                    <button
                      type="button"
                      onClick={() => setIsDeepResearchActive(false)}
                      className="hover:text-white ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {attachedSketch && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-orange-500/20 text-orange-300 border border-orange-500/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={attachedSketch} alt="Sketch" className="h-4 w-4 rounded object-cover" />
                    Sketch Attached
                    <button
                      type="button"
                      onClick={() => setAttachedSketch(null)}
                      className="hover:text-white ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {attachedLibraryDocs.map((doc) => (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  >
                    <BookOpen className="h-3 w-3 text-amber-400" />
                    <span className="truncate max-w-[140px]">{doc.title}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedLibraryDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                      className="hover:text-white ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {attachedFiles.map((file) => (
                  <span
                    key={file.id}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-slate-500/20 text-slate-200 border border-slate-500/40"
                  >
                    <Paperclip className="h-3 w-3 text-slate-400" />
                    <span className="truncate max-w-[140px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles((prev) => prev.filter((f) => f.id !== file.id))}
                      className="hover:text-white ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Chat Input Bar with ChatGPT / Codex Prompt Pill */}
            <div className="p-3 border-t border-border/80 bg-card/80 relative">
              {/* The Codex Floating Action Menu Popover anchored to the + button */}
              <CodexActionMenu
                isOpen={isActionMenuOpen}
                onClose={() => setIsActionMenuOpen(false)}
                onSelectAction={handleActionMenuSelect}
                anchorRef={plusButtonRef}
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex flex-col gap-1.5"
              >
                <div className="relative rounded-2xl sm:rounded-3xl border border-border/80 bg-[#1e1e1e]/95 shadow-2xl p-2.5 sm:p-3 backdrop-blur-xl transition-all focus-within:border-primary/60 flex flex-col gap-2">
                  {/* Prompt Textarea: Full width, spacious default height, auto-expanding, expandable */}
                  <div className="relative w-full">
                    <textarea
                      ref={textareaRef}
                      rows={isExpandedContext ? 10 : 2}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(inputValue);
                        }
                      }}
                      placeholder="Ask anything, paste job specifications, or dictate voice directives..."
                      disabled={isLoading}
                      style={{
                        resize: "vertical",
                        minHeight: isExpandedContext ? "300px" : "72px",
                        maxHeight: isExpandedContext ? "520px" : "360px",
                      }}
                      className="w-full bg-transparent border-none px-2 py-1 text-sm text-foreground placeholder:text-neutral-400 focus:outline-none leading-relaxed scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent transition-[height] duration-150"
                    />
                  </div>

                  {/* Bottom Action Controls Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/5">
                    {/* Left Controls: Plus Action Menu & Context stats */}
                    <div className="flex items-center gap-2">
                      <button
                        ref={plusButtonRef}
                        type="button"
                        onClick={() => setIsActionMenuOpen((prev) => !prev)}
                        title="Add photos & files, library docs, sketch, web search, or calendar"
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isActionMenuOpen
                            ? "bg-primary text-primary-foreground rotate-45"
                            : "bg-[#2f2f2f] hover:bg-[#3d3d3d] text-foreground-muted hover:text-foreground"
                        }`}
                      >
                        <Plus className="h-4 w-4 transition-transform duration-200" />
                      </button>

                      {inputValue.length > 0 && (
                        <span className="text-[11px] font-mono text-foreground-subtle hidden sm:inline">
                          {inputValue.length} chars (~{Math.round(inputValue.length / 4)} tokens)
                        </span>
                      )}
                    </div>

                    {/* Right Controls: Expand Context, Think Mode, Voice Deliberation, Send */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Expand / Minimize Context Window Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsExpandedContext((prev) => !prev)}
                        title={isExpandedContext ? "Compact context window" : "Expand context window for large prompts"}
                        className={`h-8 px-2.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 text-xs font-medium ${
                          isExpandedContext
                            ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                            : "border-transparent text-foreground-muted hover:text-foreground hover:bg-[#2f2f2f]"
                        }`}
                      >
                        {isExpandedContext ? (
                          <>
                            <Minimize2 className="h-3.5 w-3.5" />
                            <span className="text-[11px] hidden sm:inline">Compact</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="h-3.5 w-3.5" />
                            <span className="text-[11px] hidden sm:inline">Expand</span>
                          </>
                        )}
                      </button>

                      {/* Think mode toggle */}
                      <button
                        type="button"
                        onClick={() => setIsThinkModeActive((prev) => !prev)}
                        title="Extended Reasoning Chain (Deep Reasoning)"
                        className={`flex items-center gap-1 px-2.5 h-8 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isThinkModeActive
                            ? "bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                            : "text-foreground-muted hover:text-foreground hover:bg-[#2f2f2f]"
                        }`}
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>Think</span>
                      </button>

                      {/* Voice Deliberation (Dual mode: Dictate & Interact) */}
                      <VoiceRecorder
                        onTranscript={(text) =>
                          setInputValue((prev) => (prev ? `${prev} ${text}` : text))
                        }
                        onStartInteract={() => setIsVoiceDeliberationOpen(true)}
                        disabled={isLoading}
                      />

                      {/* Send button with ArrowUp icon */}
                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          (!inputValue.trim() &&
                            attachedFiles.length === 0 &&
                            attachedLibraryDocs.length === 0 &&
                            !attachedSketch)
                        }
                        className="h-8 w-8 rounded-full bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 ml-0.5"
                        title="Send prompt"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-black" />
                        ) : (
                          <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
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
    </div>

      {/* Chat History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm h-full bg-[#090d1a] border-r border-border/80 p-5 flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Conversation History</h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded text-foreground-subtle hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Button
              variant="glow"
              size="sm"
              onClick={() => {
                handleClearChat();
                setShowHistory(false);
              }}
              className="w-full gap-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Start Fresh Conversation
            </Button>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {chatHistoryList.length === 0 ? (
                <p className="text-xs text-foreground-subtle text-center py-6">
                  No previous sessions saved yet.
                </p>
              ) : (
                chatHistoryList.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl border border-border/60 bg-secondary/30 hover:bg-secondary/60 transition-all space-y-1"
                  >
                    <p className="text-xs font-semibold text-foreground truncate">
                      {session.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-foreground-subtle font-mono">
                      <span>{session.timestamp}</span>
                      <span>{session.messageCount} turns</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className="text-[11px] text-foreground-subtle text-center pt-2 border-t border-border/40 font-mono">
              Persisted in local browser storage.
            </p>
          </div>
          <div className="flex-1" onClick={() => setShowHistory(false)} />
        </div>
      )}

      {/* Add Knowledge Modal (Custom Dossier / Project Case Studies) */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border/80 bg-[#0a0f1e] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-base text-foreground">Add Custom Knowledge Dossier</h3>
              </div>
              <button
                onClick={() => setShowKnowledgeModal(false)}
                className="p-1 rounded text-foreground-subtle hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-foreground-muted">
              Add new project case studies, client deliveries, or certifications to ground the assistant and RAG vector store.
            </p>

            <form onSubmit={handleAddKnowledge} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider block mb-1">
                  Document / Project Title
                </label>
                <input
                  type="text"
                  value={knowledgeTitle}
                  onChange={(e) => setKnowledgeTitle(e.target.value)}
                  placeholder="e.g., Pan-African Telecommunications Cloud Blueprints"
                  required
                  className="w-full h-9 rounded-xl border border-border/80 bg-secondary/50 px-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider block mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={knowledgeTags}
                  onChange={(e) => setKnowledgeTags(e.target.value)}
                  placeholder="e.g., AWS, Terraform, Microservices, FinTech"
                  className="w-full h-9 rounded-xl border border-border/80 bg-secondary/50 px-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider block mb-1">
                  Knowledge Details / Case Study Content
                </label>
                <textarea
                  rows={5}
                  value={knowledgeContent}
                  onChange={(e) => setKnowledgeContent(e.target.value)}
                  placeholder="Detail the architectural challenges, technical solutions, and business outcomes..."
                  required
                  className="w-full rounded-xl border border-border/80 bg-secondary/50 p-3 text-xs text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKnowledgeModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="glow" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Save to Knowledge Bank
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden file upload input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.md,.json"
      />

      {/* Sketch Whiteboard Canvas Modal */}
      <SketchModal
        isOpen={isSketchModalOpen}
        onClose={() => setIsSketchModalOpen(false)}
        onAttachSketch={(dataUrl) => {
          setAttachedSketch(dataUrl);
          setIsSketchModalOpen(false);
        }}
      />

      {/* Candidate Document Library Modal */}
      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onAttachDocument={(doc) => {
          setAttachedLibraryDocs((prev) => [...prev, doc]);
          setIsLibraryModalOpen(false);
        }}
      />

      {/* Google Calendar Interview Coordination Modal */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onSelectEventToDiscuss={(evt) => {
          setInputValue(`Prepare discussion talking points and system architecture preparation for ${evt.title} with ${evt.company} on ${evt.date}.`);
          setIsCalendarModalOpen(false);
        }}
      />

      {/* GitHub Repository Showcase Modal */}
      <GithubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        onInsertRepoContext={(ctx) => {
          setInputValue((prev) => (prev ? `${prev} [${ctx}]` : `Review repository status: ${ctx}`));
          setIsGithubModalOpen(false);
        }}
      />

      {/* Voice Deliberation Interactive Modal */}
      <VoiceDeliberationModal
        isOpen={isVoiceDeliberationOpen}
        onClose={() => setIsVoiceDeliberationOpen(false)}
        onSendMessage={async (text) => {
          const res = await handleSendMessage(text);
          return res || "";
        }}
        activeModelName={currentModel.name}
        activeGemName={activeGem.name}
      />
    </AppShell>
  );
}
