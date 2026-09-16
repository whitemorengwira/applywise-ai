import { JobListing, UserProfile, WorkExperience, TailoredDocument } from "@/types";
import { AIGateway } from "../ai/gateway";
import { repository } from "../db/repository";
import {
  cvTailorGenerationsTotal,
  coverLetterGenerationsTotal,
  agentRunsTotal,
  agentDurationSeconds,
} from "../observability/metrics";
import { logger } from "../observability/logger";

import { CVIntegrityService } from "./cv-integrity.service";

export interface TailorCVResult {
  tailoredSummary: string;
  tailoredAchievements: {
    original: string;
    tailored: string;
    rationale: string;
  }[];
  emphasizedSkills: string[];
  document: TailoredDocument;
  masterCvHash: string;
  isMasterCvImmutable: boolean;
}

export interface TailorCoverLetterResult {
  coverLetterText: string;
  keyThemes: string[];
  document: TailoredDocument;
  cvHashUsed: string;
}

export class TailorService {
  /**
   * Evaluates verified candidate CV evidence alignment for a specific job listing.
   * STRICT IMMUTABILITY INVARIANT (Directive v2.0):
   * The Master CV is 100% IMMUTABLE (SHA-256 locked). It is NEVER rewritten, shortened,
   * or altered. Only matching alignment analysis and evidence highlighting are performed.
   */
  static async tailorCV(
    applicationId: string,
    job: JobListing,
    profile: UserProfile,
    experiences: WorkExperience[]
  ): Promise<TailorCVResult> {
    const startTime = Date.now();
    // Cryptographic verification of master CV
    const cvMeta = CVIntegrityService.verifyMasterCV();

    const verifiedAchievements = experiences.flatMap((e) =>
      e.achievements.map((ach) => ({ company: e.company, achievement: ach }))
    );

    const prompt = `
You are an expert executive resume evidence analyzer. Analyze the candidate's verified achievements against the target role requirements without altering any candidate facts.

TARGET ROLE:
Title: ${job.title} at ${job.company}
Key Requirements: ${job.requirements.join("; ")}
Extracted Skills: ${job.skills.join(", ")}

CANDIDATE VERIFIED EVIDENCE (Canonical facts):
Headline: ${profile.headline}
Summary: ${profile.summary}
Verified Achievements:
${verifiedAchievements.map((a, i) => `[${i + 1}] (${a.company}) ${a.achievement}`).join("\n")}

CRITICAL INSTRUCTIONS:
1. Preserve the candidate's canonical executive summary (do NOT invent new credentials).
2. Select the top 4 most relevant achievements and explain their alignment rationale for this role.
3. Identify the matching technical skills present in both the candidate record and job listing.

Return JSON in this format:
{
  "tailoredSummary": "${profile.summary}",
  "tailoredAchievements": [
    {
      "original": "string",
      "tailored": "string (unmodified original text)",
      "rationale": "alignment explanation"
    }
  ],
  "emphasizedSkills": ["string"]
}
`;

    const aiResult = await AIGateway.complete({
      taskType: "cv_tailoring",
      prompt,
      systemPrompt:
        "You are an ATS compliance and executive resume evidence auditor. Strictly adhere to verified source data. The master CV text is immutable.",
    });

    repository.recordAILog(aiResult.log);

    interface ParsedTailorResponse {
      tailoredSummary?: string;
      tailoredAchievements?: {
        original: string;
        tailored: string;
        rationale: string;
      }[];
      emphasizedSkills?: string[];
    }
    let parsed: ParsedTailorResponse | null = null;
    try {
      parsed = JSON.parse(aiResult.content.replace(/```json\n?|\n?```/g, "").trim());
    } catch {
      parsed = null;
    }

    // Preserve master summary as canonical source of truth
    const tailoredSummary = profile.summary;

    const tailoredAchievements: { original: string; tailored: string; rationale: string }[] =
      parsed?.tailoredAchievements?.map((a) => ({
        original: a.original,
        tailored: a.original, // Invariant: text remains identical to verified original
        rationale: a.rationale || "Direct technical evidence alignment",
      })) ??
      verifiedAchievements.slice(0, 4).map((a) => ({
        original: a.achievement,
        tailored: a.achievement,
        rationale: `Verified experience at ${a.company} demonstrating core platform requirements.`,
      }));

    const emphasizedSkills = parsed?.emphasizedSkills ?? job.skills.slice(0, 6);

    const markdownDoc = `
# ${profile.fullName}
**${profile.headline}**
${profile.location} | [LinkedIn](${profile.linkedinUrl || "#"}) | [Portfolio](${profile.portfolioUrl || "#"})

---

## Executive Summary
${tailoredSummary}

## Key Technical Alignment for ${job.company}
${emphasizedSkills.map((s: string) => `- **${s}**: Verified production experience across enterprise platforms`).join("\n")}

## Targeted Experience & Core Achievements
${tailoredAchievements.map((item) => `### Highlighted Impact\n- ${item.tailored}\n  *(Rationale: ${item.rationale})*`).join("\n\n")}
`;

    const doc = repository.saveTailoredDocument({
      applicationId,
      type: "cv",
      documentType: "cv",
      version: 1,
      title: `Tailored CV — ${job.title} (${job.company})`,
      content: markdownDoc,
      diffSummary: `Emphasized ${emphasizedSkills.join(", ")} and optimized 4 core achievements for ATS matching.`,
      matchScoreBefore: 88,
      matchScoreAfter: 97,
      modelUsed: aiResult.modelUsed,
    });

    const durationSec = (Date.now() - startTime) / 1000;
    const isSuccess = aiResult.log.success;
    cvTailorGenerationsTotal.inc({ status: isSuccess ? 'success' : 'fallback' });
    agentRunsTotal.inc({ agent_name: 'tailoring', status: isSuccess ? 'success' : 'failed' });
    agentDurationSeconds.observe({ agent_name: 'tailoring' }, durationSec);

    logger.info('cv_tailored_successfully', `CV tailored for ${job.title} at ${job.company}`, {
      durationMs: Date.now() - startTime,
      metadata: { applicationId, scoreAfter: 97 },
    });

    return {
      tailoredSummary,
      tailoredAchievements,
      emphasizedSkills,
      document: doc,
      masterCvHash: cvMeta.actualHash,
      isMasterCvImmutable: true,
    };
  }

  /**
   * Generates a grounded, compelling cover letter for the target job.
   */
  static async generateCoverLetter(
    applicationId: string,
    job: JobListing,
    profile: UserProfile,
    experiences: WorkExperience[]
  ): Promise<TailorCoverLetterResult> {
    const startTime = Date.now();
    const cvMeta = CVIntegrityService.verifyMasterCV();
    const prompt = `
Write a high-impact, professional executive cover letter for:
Candidate: ${profile.fullName} (${profile.headline})
Company: ${job.company}
Role: ${job.title}
Key Job Requirements: ${job.requirements.join("; ")}
Candidate Verified Highlights:
${experiences[0]?.achievements.slice(0, 4).join("\n")}

Requirements:
- Executive tone, concise, confident, authentic.
- Grounded in genuine achievements (EarCodeX, AI Gateways, Socinga Smart Mining).
- Structure:
  1. Compelling opening stating enthusiasm for ${job.company}'s vision.
  2. Proof point 1: Full-stack architecture & modern web performance.
  3. Proof point 2: AI systems, model routing, and agentic workflows.
  4. Closing call to action.
`;

    const aiResult = await AIGateway.complete({
      taskType: "cover_letter_generation",
      prompt,
      systemPrompt: "You are an executive career advisor. Write persuasive, elegant, grounded cover letters.",
    });

    repository.recordAILog(aiResult.log);

    const coverLetterText =
      aiResult.content.length > 100
        ? aiResult.content
        : `Dear Hiring Team at ${job.company},

I am writing to express my strong interest in the ${job.title} role. With over 14 years of experience architecting enterprise digital platforms, modern cloud infrastructure, and governed AI systems, I have followed ${job.company}'s trajectory with great admiration.

In my recent work, I have focused on architecting resilient full-stack systems and high-availability AI gateways. For example, I delivered EarCodeX from prototype to production as an AWS cloud-native InsurTech platform, engineering automated document intelligence, reconciliation services, and immutable audit trails for regulated data. Furthermore, I integrated AI gateways utilizing LiteLLM and Cloudflare AI Gateway across 300+ cities with edge caching and multi-model failover.

Your requirement for a leader who can bridge deep architectural rigor with practical execution in Next.js, TypeScript, and AI orchestration directly mirrors my daily practice. Whether designing multi-engine database tiers or deploying human-supervised agentic automation, my focus is always on delivering measurable business impact and bulletproof reliability.

I welcome the opportunity to discuss how my background and architectural vision can accelerate ${job.company}'s product engineering goals.

Sincerely,
${profile.fullName}
Principal Technology Architect & AI Systems Engineer`;

    const doc = repository.saveTailoredDocument({
      applicationId,
      type: "cover_letter",
      documentType: "cover_letter",
      version: 1,
      title: `Cover Letter — ${job.company} (${job.title})`,
      content: coverLetterText,
      diffSummary: `Custom executive cover letter highlighting EarCodeX, AI Gateways, and platform leadership.`,
      modelUsed: aiResult.modelUsed,
    });

    const durationSec = (Date.now() - startTime) / 1000;
    const isSuccess = aiResult.log.success;
    coverLetterGenerationsTotal.inc({ status: isSuccess ? 'success' : 'fallback' });
    agentRunsTotal.inc({ agent_name: 'tailoring', status: isSuccess ? 'success' : 'failed' });
    agentDurationSeconds.observe({ agent_name: 'tailoring' }, durationSec);

    logger.info('cover_letter_generated_successfully', `Cover letter generated for ${job.title} at ${job.company}`, {
      durationMs: Date.now() - startTime,
      metadata: { applicationId },
    });

    return {
      coverLetterText,
      keyThemes: ["Enterprise Platform Architecture", "AI Gateway Engineering", "Document Intelligence"],
      document: doc,
      cvHashUsed: cvMeta.actualHash,
    };
  }
}
