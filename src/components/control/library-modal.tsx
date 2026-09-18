"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  ShieldCheck,
  Search,
  Check,
  X,
  Lock,
  Sparkles,
} from "lucide-react";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity-constants";

export interface LibraryDocument {
  id: string;
  title: string;
  category: "CV_CREDENTIALS" | "CASE_STUDY" | "ARCHITECTURE_SPEC" | "COVER_LETTER";
  filename: string;
  description: string;
  sizeFormatted: string;
  locked: boolean;
  sha256?: string;
  contentSnippet: string;
}

export const CANDIDATE_LIBRARY_DOCS: LibraryDocument[] = [
  {
    id: "doc_master_cv",
    title: "Master Curriculum Vitae (Whitemore Ngwira)",
    category: "CV_CREDENTIALS",
    filename: "whitemore_ngwira_cv_n.white.pdf",
    description: "Certified immutable master CV PDF detailing 14+ years of systems architecture, distributed platforms, and cloud engineering.",
    sizeFormatted: "230 KB",
    locked: true,
    sha256: MASTER_CV_SHA256,
    contentSnippet: "Whitemore Ngwira — Principal Solutions Architect & Engineering Leader. Expertise across AWS, PostgreSQL pgvector, Next.js 15, zero-trust security.",
  },
  {
    id: "doc_exec_cover_letter",
    title: "Executive Cover Letter Template",
    category: "COVER_LETTER",
    filename: "whitemore_ngwira_cover_n.white.pdf",
    description: "Adaptive, grounded executive cover letter template crafted in British English.",
    sizeFormatted: "142 KB",
    locked: false,
    contentSnippet: "Dear Hiring Leadership, I am writing to formally submit my executive candidacy... 14+ years enterprise systems delivery.",
  },
  {
    id: "doc_nws_dossier",
    title: "N.White Systems Enterprise Architecture Dossier",
    category: "ARCHITECTURE_SPEC",
    filename: "nwhite_systems_dossier.md",
    description: "Verified client implementations, high-throughput microservices, and cryptographic reconciliation specs.",
    sizeFormatted: "48 KB",
    locked: false,
    contentSnippet: "N.White Systems architectural portfolio: Automated document reconciliation, multi-agent AI gateways, zero-cost cloud governance.",
  },
  {
    id: "doc_insurtech_case_study",
    title: "InsurTech AWS Reconciliation Microservices Case Study",
    category: "CASE_STUDY",
    filename: "case_study_insurtech_reconciliation.md",
    description: "Production delivery of automated policy document validation engine reducing claim processing latency by 85%.",
    sizeFormatted: "34 KB",
    locked: false,
    contentSnippet: "Production AWS serverless architecture processing 50,000+ daily policy certificates with zero reconciliation discrepancy.",
  },
  {
    id: "doc_multimodel_spec",
    title: "OpenCode Zen Multi-Model Gateway Specification",
    category: "ARCHITECTURE_SPEC",
    filename: "opencode_zen_gateway_spec.md",
    description: "Resilient 5-model rotation chain with circuit breakers and Cloudflare AI Gateway integration.",
    sizeFormatted: "26 KB",
    locked: false,
    contentSnippet: "Nemotron 3 Ultra, Nemotron 3.5 Lightning, Ling 3.0, MiMo V2.5, Muse Spark 1.3 free suite failover protocol.",
  },
];

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachDocument: (doc: LibraryDocument) => void;
}

export function LibraryModal({
  isOpen,
  onClose,
  onAttachDocument,
}: LibraryModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDocId, setSelectedDocId] = React.useState<string>(CANDIDATE_LIBRARY_DOCS[0].id);

  if (!isOpen) return null;

  const filteredDocs = CANDIDATE_LIBRARY_DOCS.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.filename.toLowerCase().includes(q)
    );
  });

  const selectedDoc = CANDIDATE_LIBRARY_DOCS.find((d) => d.id === selectedDocId) || CANDIDATE_LIBRARY_DOCS[0];

  const handleAttach = () => {
    if (selectedDoc) {
      onAttachDocument(selectedDoc);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-border/90 bg-[#090d16] p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Candidate Document Library</h3>
                <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-400">
                  Grounded Evidence
                </Badge>
              </div>
              <p className="text-xs text-foreground-muted">
                Select documents to attach to your prompt for ground truth reasoning and context grounding.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-foreground-subtle" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate files, credentials, case studies..."
            className="w-full rounded-xl bg-card/80 border border-border/70 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-1 p-1">
          {filteredDocs.map((doc) => {
            const isSelected = selectedDocId === doc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "border-border/60 bg-card/40 hover:bg-card/80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold text-foreground truncate">{doc.title}</span>
                    </div>
                    {isSelected ? (
                      <Check className="h-4 w-4 text-amber-400 shrink-0" />
                    ) : (
                      doc.locked && <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-foreground-muted mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-foreground-subtle pt-1 border-t border-border/40">
                  <span className="text-cyan-400">{doc.filename}</span>
                  <span>{doc.sizeFormatted}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview Selected Doc */}
        {selectedDoc && (
          <div className="p-3 rounded-xl bg-card/60 border border-border/70 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Selected Context:</span>
                <span className="font-mono text-amber-400">{selectedDoc.title}</span>
              </span>
              {selectedDoc.locked && (
                <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  SHA-256 Locked
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-foreground-muted font-sans italic bg-background/50 p-2 rounded-lg border border-border/40">
              &quot;{selectedDoc.contentSnippet}&quot;
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAttach}
            className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Attach Document to Prompt</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
