"use client";

import * as React from "react";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Layers,
  PenTool,
  ChevronUp,
  Check,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModelOption {
  id: string;
  name: string;
  shortName: string;
  role: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderActive: string;
  bgActive: string;
}

export const OPENCODE_MODELS: ModelOption[] = [
  {
    id: "nemotron-3-ultra-free",
    name: "Nemotron 3 Ultra Free",
    shortName: "Nemotron 3 Ultra",
    role: "Complex Reasoning & Agentic Workflows",
    badge: "Reasoning",
    icon: Sparkles,
    color: "text-purple-400",
    borderActive: "border-purple-500/40",
    bgActive: "bg-purple-500/10",
  },
  {
    id: "nemotron-3.5-lightning-free",
    name: "Nemotron 3.5 Lightning Free",
    shortName: "Nemotron 3.5 Lightning",
    role: "Fast Extraction & Parsing",
    badge: "Fast",
    icon: Zap,
    color: "text-amber-400",
    borderActive: "border-amber-500/40",
    bgActive: "bg-amber-500/10",
  },
  {
    id: "ling-3.0-flash-fin-free",
    name: "Ling 3.0 Flash Fin Free",
    shortName: "Ling 3.0 Flash Fin",
    role: "Financial & System Benchmarks",
    badge: "Finance",
    icon: TrendingUp,
    color: "text-emerald-400",
    borderActive: "border-emerald-500/40",
    bgActive: "bg-emerald-500/10",
  },
  {
    id: "mimo-v2.5-free",
    name: "MiMo V2.5 Free",
    shortName: "MiMo V2.5",
    role: "Multimodal Layout Analysis",
    badge: "Multimodal",
    icon: Layers,
    color: "text-cyan-400",
    borderActive: "border-cyan-500/40",
    bgActive: "bg-cyan-500/10",
  },
  {
    id: "muse-spark-1.3-contributor-free",
    name: "Muse Spark 1.3 Free",
    shortName: "Muse Spark 1.3",
    role: "Adaptive Creative Drafting",
    badge: "Creative",
    icon: PenTool,
    color: "text-pink-400",
    borderActive: "border-pink-500/40",
    bgActive: "bg-pink-500/10",
  },
];

interface ModelSwitcherProps {
  collapsed?: boolean;
}

export function ModelSwitcher({ collapsed = false }: ModelSwitcherProps) {
  const [activeModelId, setActiveModelId] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("applywise_active_model") ||
        localStorage.getItem("applywise_reasoning_model") ||
        "nemotron-3-ultra-free"
      );
    }
    return "nemotron-3-ultra-free";
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Listen for model change events across application
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleModelChange = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail) {
          setActiveModelId(customEvent.detail);
        }
      };

      window.addEventListener("applywise_model_changed", handleModelChange);
      return () => {
        window.removeEventListener("applywise_model_changed", handleModelChange);
      };
    }
  }, []);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectModel = async (modelId: string) => {
    setActiveModelId(modelId);
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("applywise_active_model", modelId);
      localStorage.setItem("applywise_reasoning_model", modelId);
      window.dispatchEvent(
        new CustomEvent("applywise_model_changed", { detail: modelId })
      );
      try {
        await fetch("/api/control/model", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId }),
        });
      } catch (err) {
        console.warn("Failed to sync active model to backend:", err);
      }
    }
  };

  const currentModel =
    OPENCODE_MODELS.find((m) => m.id === activeModelId) || OPENCODE_MODELS[0];
  const CurrentIcon = currentModel.icon;

  return (
    <div className="relative p-2" ref={popoverRef}>
      {/* Popover Menu (positioned above the bottom panel) */}
      {isOpen && (
        <div className="absolute bottom-full left-2 right-2 mb-2 z-50 rounded-xl border border-border/90 bg-[#0c1222] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150 min-w-[260px]">
          <div className="px-2 py-1.5 border-b border-border/50 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-foreground-subtle flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-emerald-400" />
              OpenCode Zen Suite
            </span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              100% FREE
            </span>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto">
            {OPENCODE_MODELS.map((model) => {
              const Icon = model.icon;
              const isSelected = model.id === activeModelId;

              return (
                <button
                  key={model.id}
                  onClick={() => selectModel(model.id)}
                  className={cn(
                    "w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 text-xs group cursor-pointer",
                    isSelected
                      ? `${model.bgActive} border ${model.borderActive} text-foreground`
                      : "hover:bg-secondary/60 text-foreground-muted hover:text-foreground border border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-md border shrink-0 mt-0.5",
                      isSelected
                        ? `${model.bgActive} ${model.borderActive}`
                        : "bg-secondary/40 border-border/40 group-hover:border-border"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", model.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold truncate text-[11px]">
                        {model.shortName}
                      </span>
                      {isSelected && (
                        <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-foreground-subtle leading-tight line-clamp-1 mt-0.5">
                      {model.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      {collapsed ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          title={`Active AI Model: ${currentModel.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-secondary/40 text-foreground hover:bg-secondary hover:border-primary/40 transition-all cursor-pointer mx-auto relative group"
        >
          <CurrentIcon className={cn("h-4 w-4", currentModel.color)} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full p-2.5 rounded-xl border transition-all text-left cursor-pointer group flex flex-col gap-1.5",
            isOpen
              ? "border-primary/50 bg-secondary/80 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
              : "border-border/80 bg-secondary/40 hover:bg-secondary/70 hover:border-border"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              OpenCode Zen Engine
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                FREE TIER
              </span>
              <ChevronUp
                className={cn(
                  "h-3.5 w-3.5 text-foreground-subtle transition-transform duration-200",
                  isOpen ? "rotate-180 text-primary" : "group-hover:text-foreground"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <CurrentIcon className={cn("h-3.5 w-3.5 shrink-0", currentModel.color)} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-foreground truncate">
                {currentModel.shortName}
              </p>
              <p className="text-[9px] text-foreground-subtle truncate leading-none">
                {currentModel.badge} • Click to switch
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
