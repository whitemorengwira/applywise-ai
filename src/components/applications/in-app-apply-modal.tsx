"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
  ArrowRight,
  Clock,
  Layers,
  X,
} from "lucide-react";
import { JobListing } from "@/types";
import { InAppApplyService, InAppApplyResult } from "@/lib/services/in-app-apply.service";
import Link from "next/link";

interface InAppApplyModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: InAppApplyResult) => void;
}

export function InAppApplyModal({ job, isOpen, onClose, onSuccess }: InAppApplyModalProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [activeStage, setActiveStage] = React.useState<number>(0);
  const [result, setResult] = React.useState<InAppApplyResult | null>(null);
  const [showFullLetter, setShowFullLetter] = React.useState(false);

  const handleClose = () => {
    setResult(null);
    setActiveStage(0);
    setShowFullLetter(false);
    onClose();
  };

  if (!isOpen || !job) return null;

  const handleStartApply = async () => {
    setIsRunning(true);
    setActiveStage(1);
    setResult(null);

    try {
      // Simulate real-time progression through the stages for responsive feedback
      const res = await InAppApplyService.executeValueChain(job, (p) => {
        setActiveStage(p.stage);
      });

      setResult(res);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.error("In-app apply failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const getPortalLabel = (route: string) => {
    switch (route) {
      case "PNET":
        return "🇿🇦 PNet South Africa MCP";
      case "INDEED":
        return "🌐 Indeed Quick Apply MCP";
      case "LINKEDIN":
        return "💼 LinkedIn Easy Apply MCP";
      case "ZOHO_MAIL":
        return "📧 Zoho Business Mail Gateway";
      default:
        return "⚡ Direct Enterprise Portal";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-border/90 bg-[#090d16] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border/70 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary uppercase tracking-wider">
                Zero-Download Value Chain
              </Badge>
              <span className="text-xs text-foreground-subtle font-mono">
                In-App Autonomous Application
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>{job.title}</span>
              <span className="text-xs font-mono text-emerald-400 font-normal">
                • {job.company}
              </span>
            </h2>
            <p className="text-xs text-foreground-muted">
              Apply completely within ApplyWise AI without downloading files. The internal browser connector handles matching, tailoring, form autofill, and proof recording.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-7 w-7 text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Overview Job Metadata */}
        <div className="p-3 rounded-xl border border-border/70 bg-card/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-foreground-subtle uppercase">Target Employer</span>
            <p className="font-semibold text-foreground truncate">{job.company}</p>
          </div>
          <div>
            <span className="text-[10px] text-foreground-subtle uppercase">Location</span>
            <p className="font-semibold text-foreground truncate">{job.location}</p>
          </div>
          <div>
            <span className="text-[10px] text-foreground-subtle uppercase">Application Gateway</span>
            <p className="font-mono text-cyan-400 font-semibold truncate">
              {getPortalLabel(job.applyUrl?.includes("pnet") ? "PNET" : job.applyUrl?.includes("indeed") ? "INDEED" : "DIRECT_PORTAL")}
            </p>
          </div>
        </div>

        {/* Value Chain 5 Stages */}
        <div className="space-y-2 py-2">
          <span className="text-xs font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Autonomous Value Chain Stages
          </span>

          <div className="space-y-2">
            {/* Stage 1 */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStage === 1
                  ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                  : activeStage > 1
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border/50 bg-card/40 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center font-mono text-[10px]">
                    1
                  </span>
                  Master CV Immutability Check (SHA-256 Lock)
                </span>
                {activeStage > 1 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : activeStage === 1 ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                )}
              </div>
              <p className="text-[11px] text-foreground-muted mt-1 ml-7">
                Verifies cryptographic hash <code className="text-primary font-mono">3994a09c...</code> (230,064 bytes) with zero mutation.
              </p>
            </div>

            {/* Stage 2 */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStage === 2
                  ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                  : activeStage > 2
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border/50 bg-card/40 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center font-mono text-[10px]">
                    2
                  </span>
                  Executive Cover Letter Synthesis (British English)
                </span>
                {activeStage > 2 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : activeStage === 2 ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                )}
              </div>
              <p className="text-[11px] text-foreground-muted mt-1 ml-7">
                Synthesizes targeted executive narrative grounded in Whitemore&apos;s 14+ years systems leadership.
              </p>
            </div>

            {/* Stage 3 */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStage === 3
                  ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                  : activeStage > 3
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border/50 bg-card/40 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center font-mono text-[10px]">
                    3
                  </span>
                  Portal Connector Resolution & Authenticated Session
                </span>
                {activeStage > 3 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : activeStage === 3 ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                )}
              </div>
              <p className="text-[11px] text-foreground-muted mt-1 ml-7">
                Routes to permanent session: PNet SA (ZAR), Indeed, LinkedIn Easy Apply, or Zoho Mail.
              </p>
            </div>

            {/* Stage 4 */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStage === 4
                  ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                  : activeStage > 4
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border/50 bg-card/40 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center font-mono text-[10px]">
                    4
                  </span>
                  In-App Form Autofill & Portal Submission
                </span>
                {activeStage > 4 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : activeStage === 4 ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                )}
              </div>
              <p className="text-[11px] text-foreground-muted mt-1 ml-7">
                Automated form field extraction, candidate contact injection, and direct headless dispatch.
              </p>
            </div>

            {/* Stage 5 */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                activeStage === 5
                  ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                  : result
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border/50 bg-card/40 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center font-mono text-[10px]">
                    5
                  </span>
                  Cryptographic Proof Capture & Permanent Inventory
                </span>
                {result ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : activeStage === 5 ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-foreground-subtle" />
                )}
              </div>
              <p className="text-[11px] text-foreground-muted mt-1 ml-7">
                Generates immutable audit hash and archives to permanent application inventory ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Completion Success Card */}
        {result && (
          <Card className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  Application Successfully Submitted!
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-400">
                {result.portalRoute}
              </Badge>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed">
              {result.message}
            </p>

            <div className="p-2.5 rounded-lg bg-black/50 border border-emerald-500/30 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-foreground-subtle">Cryptographic Proof Hash:</span>
                <span className="text-emerald-400 font-bold">{result.proofHash}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-foreground-subtle">Master CV Verified Lock:</span>
                <span className="text-primary truncate max-w-[240px]">{result.cvHashLocked}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowFullLetter(!showFullLetter)}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <FileText className="h-3.5 w-3.5" />
                {showFullLetter ? "Hide Cover Letter" : "Inspect Tailored Cover Letter"}
              </button>

              <Button size="sm" variant="glow" asChild className="gap-1 text-xs">
                <Link href="/applications">
                  <span>View in Applications Inventory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {showFullLetter && (
              <div className="mt-2 p-3 rounded-lg bg-black/70 border border-border/80 text-xs font-sans whitespace-pre-wrap text-foreground/90 max-h-60 overflow-y-auto">
                {result.coverLetterFull}
              </div>
            )}
          </Card>
        )}

        {/* Action Button Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isRunning}>
            Close
          </Button>

          {!result ? (
            <Button
              variant="glow"
              size="sm"
              onClick={handleStartApply}
              disabled={isRunning}
              className="gap-2 font-semibold"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Executing In-App Application...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Execute In-App 1-Click Apply
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleClose}>
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
