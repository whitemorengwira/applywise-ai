"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit,
  Send,
  Loader2,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { RAGChunk } from "@/lib/services/rag.service";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: RAGChunk[];
  latencyMs?: number;
}

const SAMPLE_QUESTIONS = [
  "Explain your experience architecting enterprise AI Gateways and model routing.",
  "How did you design EarCodeX from prototype to production on AWS?",
  "What is your strategy for Terraform blueprints, IAM, and zero-trust VPNs?",
  "Describe your experience with Next.js 15, TypeScript, and Supabase.",
];

export default function RAGSearchPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to the ApplyWise AI Career Copilot. I am grounded strictly in Whitemore Ngwira's verified engineering portfolio, production blueprints (EarCodeX, AI Gateways, Socinga Mining), and technical credentials. Ask me any question to test my factual grounding.",
    },
  ]);
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: questionText };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });
      const data = await res.json();

      if (data.success && data.result) {
        const assistantMsg: Message = {
          role: "assistant",
          content: data.result.answer,
          citations: data.result.citedChunks,
          latencyMs: data.result.latencyMs,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error("RAG query error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell pageTitle="Agentic RAG Career Copilot">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Agentic RAG Intelligence
                <Badge variant="success" className="text-[10px] font-mono gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  STRICT CITATIONS
                </Badge>
              </h2>
              <p className="text-xs text-foreground-muted">
                Hybrid semantic search across candidate career achievements with verifiable evidence citations.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Prompts */}
        <div className="space-y-1.5 pt-2 border-t border-border/60">
          <span className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider block">
            Suggested Verification Questions
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(sq)}
                className="text-xs px-3 py-1.5 rounded-lg bg-secondary/60 text-foreground-muted hover:text-foreground hover:bg-secondary border border-border/50 text-left transition-all cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4 min-h-[420px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-5 space-y-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-12"
                  : "bg-card border border-border/80 text-foreground mr-12 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between text-xs opacity-75 font-mono">
                <span>{msg.role === "user" ? "Recruiter / Interviewer" : "ApplyWise Copilot"}</span>
                <div className="flex items-center gap-2">
                  {msg.role === "assistant" && idx > 0 && (!msg.citations || msg.citations.length === 0) && (
                    <Badge variant="destructive" className="text-[9px] font-mono py-0">
                      ZERO-HALLUCINATION GUARD
                    </Badge>
                  )}
                  {msg.latencyMs && <span>{msg.latencyMs}ms response</span>}
                </div>
              </div>

              <div className="text-xs md:text-sm leading-relaxed whitespace-pre-line">
                {msg.content}
              </div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-border/60 space-y-2 mt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle flex items-center gap-1">
                    <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                    Verified Evidence Citations:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.citations.map((c, i) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-lg bg-secondary/40 border border-border/50 space-y-1 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">
                            [Source {i + 1}] {c.title}
                          </span>
                          <Badge variant="secondary" className="text-[9px] font-mono">
                            {c.category}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-foreground-muted leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 text-xs text-foreground-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Consulting pgvector knowledge base and synthesizing grounded response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(query);
        }}
        className="sticky bottom-4 z-10 flex gap-2 rounded-2xl border border-border/80 bg-[#080c16]/95 p-2 backdrop-blur-md shadow-2xl"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about Whitemore's architecture, AI systems, or production case studies..."
          className="flex-1 bg-transparent px-4 text-xs md:text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
        />
        <Button type="submit" variant="glow" disabled={isLoading || !query.trim()} className="gap-1.5 px-4">
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>
    </AppShell>
  );
}
