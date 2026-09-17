"use client";

import * as React from "react";
import { ShieldCheck, Terminal } from "lucide-react";

interface ChatMarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Lightweight, zero-dependency Markdown & Citation Badge Renderer for ApplyWise AI Control Plane.
 * Parses:
 * - Citation Badges: [Source N: Title] into verified badge chips
 * - Tables: standard markdown pipes into responsive styled tables
 * - Code Blocks: ```lang into dark-mode styled code containers
 * - Inline Code: `code` into monospace highlighted spans
 * - Headings: #, ##, ### into styled typography
 * - Lists: •, -, *, 1. into clean indented items
 * - Bold: **text** and Italic: *text*
 * - Blockquotes: > text into accented quote callouts
 */
export function ChatMarkdownRenderer({ content, className = "" }: ChatMarkdownRendererProps) {
  const renderedElements = React.useMemo(() => {
    return parseMarkdownContent(content);
  }, [content]);

  return <div className={`text-sm leading-relaxed space-y-2 break-words ${className}`}>{renderedElements}</div>;
}

function parseMarkdownContent(rawText: string): React.ReactNode[] {
  if (!rawText) return [];

  const lines = rawText.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Block Fence (```)
    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace(/^```/, "").trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push(
        <div
          key={`code-${nodes.length}-${i}`}
          className="my-3 rounded-xl border border-border/80 bg-[#060a12] p-3 font-mono text-xs overflow-x-auto shadow-inner"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-1.5 mb-2 text-[10px] text-foreground-subtle">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3 text-primary" />
              {lang}
            </span>
          </div>
          <pre className="text-foreground-muted whitespace-pre">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Markdown Table Detection (Line contains | and next line is a separator |---|)
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      lines[i + 1].includes("|") &&
      /^[|\s-:]+$/.test(lines[i + 1].trim())
    ) {
      const tableLines: string[] = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().length > 0) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(renderTable(tableLines, `table-${nodes.length}-${i}`));
      continue;
    }

    // 3. Headings
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${i}`} className="text-sm font-bold text-foreground mt-3 mb-1 font-mono flex items-center gap-2">
          {renderInlineFormattedText(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${i}`} className="text-base font-bold text-foreground mt-4 mb-1.5 font-mono border-b border-border/50 pb-1">
          {renderInlineFormattedText(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={`h1-${i}`} className="text-lg font-extrabold text-foreground mt-4 mb-2 font-mono">
          {renderInlineFormattedText(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // 4. Horizontal Rule
    if (/^(\*\*\*|---|___)$/.test(line.trim())) {
      nodes.push(<hr key={`hr-${i}`} className="border-border/60 my-3" />);
      i++;
      continue;
    }

    // 5. Blockquote
    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-2 border-primary/60 bg-primary/5 pl-3 py-1.5 my-2 text-foreground-muted italic rounded-r-lg text-xs"
        >
          {renderInlineFormattedText(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // 6. List Item (Bullet or Numbered)
    const bulletMatch = line.match(/^(\s*)([•\-\*]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      const indentLevel = Math.floor(bulletMatch[1].length / 2);
      const contentText = bulletMatch[3];
      nodes.push(
        <div
          key={`list-${i}`}
          className="flex items-start gap-2 my-1"
          style={{ paddingLeft: `${indentLevel * 14}px` }}
        >
          <span className="text-primary mt-1 text-[10px] shrink-0">•</span>
          <span className="flex-1 text-xs leading-relaxed text-foreground">
            {renderInlineFormattedText(contentText)}
          </span>
        </div>
      );
      i++;
      continue;
    }

    // 7. Empty line
    if (!line.trim()) {
      nodes.push(<div key={`empty-${i}`} className="h-1.5" />);
      i++;
      continue;
    }

    // 8. Standard paragraph line
    nodes.push(
      <p key={`p-${i}`} className="text-xs leading-relaxed text-foreground">
        {renderInlineFormattedText(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

/**
 * Renders a markdown table into a styled HTML table
 */
function renderTable(tableLines: string[], key: string): React.ReactNode {
  const headerCells = tableLines[0]
    .split("|")
    .map((c) => c.trim())
    .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));

  const bodyRows = tableLines.slice(2).map((row) =>
    row
      .split("|")
      .map((c) => c.trim())
      .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""))
  );

  return (
    <div key={key} className="my-3 overflow-x-auto rounded-xl border border-border/80 bg-card/40">
      <table className="min-w-full text-left text-xs divide-y divide-border/80">
        <thead className="bg-secondary/60">
          <tr>
            {headerCells.map((h, idx) => (
              <th key={idx} className="px-3 py-2 text-[11px] font-mono font-semibold text-foreground tracking-wider">
                {renderInlineFormattedText(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 font-mono text-[11px]">
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-secondary/20 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-2 text-foreground-muted whitespace-nowrap">
                  {renderInlineFormattedText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Parses inline formatting:
 * - Evidence Badges: [Source N: Title]
 * - Bold: **text**
 * - Italic: *text* or _text_
 * - Inline Code: `code`
 */
function renderInlineFormattedText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Regex pattern matching inline elements
  // Group 1: Source badge [Source X: ...]
  // Group 2: Inline code `...`
  // Group 3: Bold **...**
  // Group 4: Italic *...*
  const pattern = /(\[Source\s+\d+:\s+[^\]]+\])|(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];

    if (match[1]) {
      // Evidence Citation Badge [Source N: ...]
      const badgeContent = token.slice(1, -1);
      parts.push(
        <span
          key={`badge-${match.index}`}
          className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-semibold tracking-wide shadow-sm"
        >
          <ShieldCheck className="h-3 w-3 inline text-emerald-400 shrink-0" />
          {badgeContent}
        </span>
      );
    } else if (match[2]) {
      // Inline Code `...`
      const codeContent = token.slice(1, -1);
      parts.push(
        <code
          key={`code-${match.index}`}
          className="mx-0.5 px-1.5 py-0.5 rounded bg-secondary/80 border border-border/60 text-[11px] font-mono text-cyan-300"
        >
          {codeContent}
        </code>
      );
    } else if (match[3]) {
      // Bold **...**
      const boldContent = token.slice(2, -2);
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-foreground">
          {boldContent}
        </strong>
      );
    } else if (match[4]) {
      // Italic *...*
      const italicContent = token.slice(1, -1);
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-foreground-muted">
          {italicContent}
        </em>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
