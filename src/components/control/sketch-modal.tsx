"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PenTool,
  Eraser,
  RotateCcw,
  Check,
  X,
  Palette,
  Sparkles,
} from "lucide-react";

interface SketchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachSketch: (dataUrl: string, name?: string) => void;
}

const COLORS = [
  { id: "white", hex: "#ffffff", name: "White" },
  { id: "sky", hex: "#38bdf8", name: "Sky Blue" },
  { id: "emerald", hex: "#34d399", name: "Emerald" },
  { id: "purple", hex: "#c084fc", name: "Purple" },
  { id: "amber", hex: "#fbbf24", name: "Amber" },
  { id: "red", hex: "#f87171", name: "Rose" },
];

const BRUSH_SIZES = [
  { id: "thin", size: 2, label: "Fine" },
  { id: "med", size: 5, label: "Medium" },
  { id: "thick", size: 10, label: "Bold" },
];

export function SketchModal({
  isOpen,
  onClose,
  onAttachSketch,
}: SketchModalProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [color, setColor] = React.useState("#38bdf8");
  const [brushSize, setBrushSize] = React.useState(3);
  const [isEraser, setIsEraser] = React.useState(false);
  const [hasContent, setHasContent] = React.useState(false);

  // Initialize canvas with black background
  const initCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(initCanvas, 50);
    }
  }, [isOpen, initCanvas]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? "#090d16" : color;

    setIsDrawing(true);
    setHasContent(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const handleAttach = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onAttachSketch(dataUrl, `architecture-sketch-${Date.now().toString(36)}.png`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-border/90 bg-[#090d16] p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
              <PenTool className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Architecture Sketchpad</h3>
                <Badge variant="outline" className="text-[10px] font-mono border-orange-500/40 text-orange-400">
                  Visual Diagram
                </Badge>
              </div>
              <p className="text-xs text-foreground-muted">
                Draw system flows, architecture topologies, or handwritten notes to attach to your prompt.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-card/60 border border-border/60 text-xs">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-foreground-subtle mr-1" />
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setColor(c.hex);
                  setIsEraser(false);
                }}
                className={`h-6 w-6 rounded-full border transition-transform cursor-pointer flex items-center justify-center ${
                  !isEraser && color === c.hex
                    ? "scale-110 border-white ring-2 ring-primary/60"
                    : "border-border/50 hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {!isEraser && color === c.hex && (
                  <Check className={`h-3 w-3 ${c.id === "white" ? "text-black" : "text-white"}`} />
                )}
              </button>
            ))}
          </div>

          {/* Stroke Widths */}
          <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-lg border border-border/40">
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBrushSize(b.size)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  brushSize === b.size
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Tools: Eraser & Clear */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={isEraser ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEraser(!isEraser)}
              className="h-7 px-2.5 text-xs gap-1"
            >
              <Eraser className="h-3.5 w-3.5" />
              <span>Eraser</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={initCanvas}
              className="h-7 px-2.5 text-xs gap-1 text-rose-400 hover:text-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative rounded-xl border border-border/80 overflow-hidden bg-[#090d16] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={380}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair touch-none max-w-full block"
          />
          {!hasContent && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-foreground-subtle text-xs gap-1.5 opacity-40">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>Draw architecture topologies, state machines, or workflow sketches here</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAttach}
            disabled={!hasContent}
            className="gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Attach Sketch to Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
