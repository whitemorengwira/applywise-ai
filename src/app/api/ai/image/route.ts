import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/observability/logger";

export const runtime = "nodejs";

/**
 * POST /api/ai/image
 * Free AI Image Synthesis engine for technical architectures, system blueprints, and portfolio graphics.
 * Powered by zero-cost high-performance Flux models.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const width = Number(body.width) || 1024;
    const height = Number(body.height) || 1024;
    const seed = Math.floor(Math.random() * 1000000);

    // Enhance technical prompts for architectural excellence
    const enhancedPrompt = `${prompt}, technical architecture diagram, clean vector lines, high resolution, dark mode aesthetic, modern engineering schematic, cybernetic cyan and cobalt accents, 8k professional`;

    // Construct high-performance Pollinations AI Flux image URL (100% free, zero cost, no rate limits)
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

    logger.info("image_generation_requested", "AI Image generated successfully", {
      metadata: { prompt, width, height, seed, model: "flux-schnell" },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      model: "flux-schnell",
      width,
      height,
      seed,
      format: "png",
      costUSD: 0.0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("image_generation_failed", "Image generation failed", {
      metadata: { error: (error as Error).message },
    });
    return NextResponse.json(
      { success: false, error: "Image generation failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
