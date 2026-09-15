"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  Award,
} from "lucide-react";
import { SEED_JOBS } from "@/lib/db/seed-data";
import { InterviewQuestion, STAREvaluation } from "@/lib/services/interview.service";

const DEFAULT_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q-arch-1",
    category: "Technical Architecture",
    question:
      "How would you architect an AI gateway to ensure 99.9% uptime, multi-model failover, and token cost controls?",
    context: "Assesses enterprise AI gateway architecture and failover resilience.",
    idealAnswerStructure: [
      "State LiteLLM / Cloudflare AI Gateway routing architecture with circuit breakers",
      "Explain caching strategy at the CDN edge to eliminate duplicate inference costs",
      "Detail fallback degradation protocol when upstream LLMs experience 503 capacity errors",
    ],
  },
  {
    id: "q-sys-2",
    category: "System Design",
    question:
      "Walk us through how you designed EarCodeX to handle automated document intelligence, immutable audit trails, and human-in-the-loop approvals.",
    context: "Evaluates end-to-end production systems design for mission-critical workflows.",
    idealAnswerStructure: [
      "Describe AWS serverless ingestion tier with S3 and event-driven Lambda triggers",
      "Explain pgvector/PostgreSQL schema partitioning for auditability",
      "Detail human approval gate UI and security boundaries",
    ],
  },
];

export default function InterviewsPage() {
  const [selectedJobId, setSelectedJobId] = React.useState(SEED_JOBS[0].id);
  const selectedJob = SEED_JOBS.find((j) => j.id === selectedJobId) || SEED_JOBS[0];

  const [questions, setQuestions] = React.useState<InterviewQuestion[]>(DEFAULT_QUESTIONS);
  const [activeQuestionIndex, setActiveQuestionIndex] = React.useState(0);
  const [candidateAnswer, setCandidateAnswer] = React.useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = React.useState(false);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [evaluation, setEvaluation] = React.useState<STAREvaluation | null>(null);

  const loadQuestions = async (jobId: string) => {
    setIsLoadingQuestions(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_questions", jobId }),
      });
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setActiveQuestionIndex(0);
        setEvaluation(null);
        setCandidateAnswer("");
      }
    } catch (err) {
      console.error("Questions error:", err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const activeQuestion = questions[activeQuestionIndex];

  const handleEvaluateAnswer = async () => {
    if (!activeQuestion || !candidateAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate_answer",
          question: activeQuestion,
          answer: candidateAnswer,
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const loadSampleAnswer = () => {
    setCandidateAnswer(
      "When architecting the AI Gateway for our production platform, the primary objective was 99.9% uptime and zero margin erosion from duplicate inference. I deployed LiteLLM as an intelligent router fronted by Cloudflare AI Gateway across 300+ edge locations. For high-reasoning tasks like multi-agent RAG, we routed to Gemini 2.0 Flash Thinking, while structured extraction tasks failed over to Llama 3.3. By implementing edge caching and token budgeting, we reduced average response latency by 45% and preserved project margins under aggressive usage surges."
    );
  };

  return (
    <AppShell pageTitle="AI Interview Intelligence & Mock Practice">
      {/* Configuration Header */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Role-Specific Technical & STAR Interview Prep
            </h2>
            <p className="text-xs text-foreground-muted">
              Target Company: <span className="font-semibold text-foreground">{selectedJob.company}</span> • Target Role: {selectedJob.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                loadQuestions(e.target.value);
              }}
              className="h-10 rounded-xl border border-border bg-secondary/40 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              {SEED_JOBS.map((j) => (
                <option key={j.id} value={j.id} className="bg-[#0a0f1d] text-foreground">
                  {j.company} — {j.title}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadQuestions(selectedJobId)}
              disabled={isLoadingQuestions}
            >
              {isLoadingQuestions ? <Loader2 className="h-4 w-4 animate-spin" /> : "Regenerate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Navigation & Active Prompt (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Question Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestionIndex(idx);
                  setEvaluation(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none cursor-pointer whitespace-nowrap ${
                  activeQuestionIndex === idx
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-secondary/40 text-foreground-muted hover:bg-secondary hover:text-foreground border border-border/60"
                }`}
              >
                Q{idx + 1}: {q.category}
              </button>
            ))}
          </div>

          {activeQuestion && (
            <Card className="border-border/80 bg-card/75 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-[10px] font-mono">
                    {activeQuestion.category}
                  </Badge>
                  <span className="text-[11px] text-foreground-subtle">
                    Question {activeQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-foreground leading-snug">
                  &ldquo;{activeQuestion.question}&rdquo;
                </h3>
                <p className="text-xs text-foreground-muted italic">
                  Context: {activeQuestion.context}
                </p>
              </div>

              {/* Ideal Structure Guidance */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-primary" /> Key Dimensions to Address:
                </span>
                <ul className="space-y-0.5">
                  {activeQuestion.idealAnswerStructure.map((pt, i) => (
                    <li key={i} className="text-xs text-foreground flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Candidate Answer Box */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                    Your Architectural / Behavioral Answer
                  </label>
                  <button
                    onClick={loadSampleAnswer}
                    className="text-[11px] text-primary hover:underline font-mono"
                  >
                    + Populate Verified Sample Answer
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Structure your answer with clear architectural context, implementation decisions, and measurable outcomes..."
                  className="w-full rounded-xl border border-border/70 bg-secondary/20 p-4 text-xs md:text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="glow"
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !candidateAnswer.trim()}
                  className="gap-2"
                >
                  {isEvaluating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Award className="h-4 w-4" />
                  )}
                  {isEvaluating ? "Scoring with STAR Rubric..." : "Evaluate with STAR Method"}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* STAR Evaluation Results Pane (1 Col) */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Executive STAR Scorecard
          </h3>

          {evaluation ? (
            <Card className="border-border/80 bg-card/75 p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/10 border border-primary/25">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-foreground-subtle">
                    Overall Readiness
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {evaluation.overallScore} / 10
                  </div>
                </div>
                <Badge variant="highMatch" className="font-mono text-xs">
                  VP APPROVED
                </Badge>
              </div>

              {/* Individual STAR Scores */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-center">
                  <span className="text-[10px] text-foreground-subtle block">Situation</span>
                  <span className="text-base font-mono font-bold text-foreground">
                    {evaluation.situationScore}/10
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-center">
                  <span className="text-[10px] text-foreground-subtle block">Task</span>
                  <span className="text-base font-mono font-bold text-foreground">
                    {evaluation.taskScore}/10
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-center">
                  <span className="text-[10px] text-foreground-subtle block">Action</span>
                  <span className="text-base font-mono font-bold text-foreground">
                    {evaluation.actionScore}/10
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/50 text-center">
                  <span className="text-[10px] text-foreground-subtle block">Result</span>
                  <span className="text-base font-mono font-bold text-foreground">
                    {evaluation.resultScore}/10
                  </span>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Key Strengths
                </span>
                <ul className="space-y-1">
                  {evaluation.strengths.map((st, i) => (
                    <li key={i} className="text-xs text-foreground leading-relaxed flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Refinement */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Recommended Refinement
                </span>
                <ul className="space-y-1">
                  {evaluation.refinements.map((rf, i) => (
                    <li key={i} className="text-xs text-foreground-muted leading-relaxed flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Executive Feedback */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-foreground-subtle block">
                  VP Executive Feedback
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {evaluation.executiveFeedback}
                </p>
              </div>
            </Card>
          ) : (
            <Card className="border-border/80 bg-card/50 p-8 text-center space-y-2 border-dashed">
              <Bot className="h-8 w-8 text-foreground-subtle mx-auto" />
              <p className="text-xs text-foreground-muted">
                Submit an answer above to generate a comprehensive STAR method evaluation and score breakdown.
              </p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
