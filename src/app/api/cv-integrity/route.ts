import { NextResponse } from "next/server";
import { CVIntegrityService, MASTER_CV_SHA256, MASTER_COVER_LETTER_SHA256 } from "@/lib/services/cv-integrity.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const meta = CVIntegrityService.verifyMasterCV();
    return NextResponse.json({
      success: true,
      data: {
        ...meta,
        masterCoverLetter: {
          filename: "whitemore_ngwira_cover_n.white.pdf",
          expectedHash: MASTER_COVER_LETTER_SHA256,
          purpose: "adaptive_template_baseline",
        },
        protectionRules: [
          "Master CV is cryptographically immutable (SHA-256 locked)",
          "No AI model or user mutation allowed on Master CV",
          "All applications submit exact certified Master CV PDF",
          "Cover letters are the sole adaptive application document",
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "CV integrity check failed",
        expectedHash: MASTER_CV_SHA256,
      },
      { status: 500 }
    );
  }
}
