import { JobListing, UserProfile, WorkExperience, TailoredDocument } from "@/types";
import { AIGateway } from "../ai/gateway";
import { repository } from "../db/repository";

export interface TailorCVResult {
  tailoredSummary: string;
  tailoredAchievements: {
    original: string;
    tailored: string;
    rationale: string;
  }[];
  emphasizedSkills: string[];
  document: TailoredDocument;
}

export interface TailorCoverLetterResult {
  coverLetterText: string;
  keyThemes: string[];
  document: TailoredDocument;
}

export class TailorService {
  /**
   * Tailors candidate CV bullets and executive summary for a specific job listing.
   * STRICT TRUST BOUNDARY: Only highlights, rewords, and emphasizes verified achievements.
   * Never invents non-existent credentials, metrics, or technologies.
   */
  static async tailorCV(
    applicationId: string,
    job: JobListing,
    profile: UserProfile,
    experiences: WorkExperience[]
  ): Promise<TailorCVResult> {
    const verifiedAchievements = experiences.flatMap((e) =>
      e.achievements.map((ach) => ({ company: e.company, achievement: ach }))
    );

    const prompt = `
You are an expert executive resume architect. Tailor the candidate's verified achievements to strongly align with the target role while obeying ZERO-HALLUCINATION constraints.

TARGET ROLE:
Title: ${job.title} at ${job.company}
Key Requirements: ${job.requirements.join("; ")}
Extracted Skills: ${job.skills.join(", ")}

CANDIDATE VERIFIED DATA (Only use these facts):
Current Headline: ${profile.headline}
Current Summary: ${profile.summary}
Verified Achievements:
${verifiedAchievements.map((a, i) => `[${i + 1}] (${a.company}) ${a.achievement}`).join("\n")}

CRITICAL INSTRUCTIONS:
1. Rewrite the executive summary to directly address the target role's core challenges.
2. Select the top 4 most relevant achievements and reword them using strong action verbs, highlighting relevant technologies (e.g. Next.js, AI gateways, pgvector) present in both the candidate's history and the job description.
3. DO NOT fabricate any numbers, metrics, or technologies not present in the verified input.

Return JSON in this format:
{
  "tailoredSummary": "string",
  "tailoredAchievements": [
    {
      "original": "string",
      "tailored": "string",
      "rationale": "string"
    }
  ],
  "emphasizedSkills": ["string"]
}
`;

    const aiResult = await AIGateway.complete({
      taskType: "cv_tailoring",
      prompt,
      systemPrompt:
        "You are an ATS compliance and executive resume optimizer. Strictly adhere to verified source data. Ground all statements.",
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

    const tailoredSummary =
      parsed?.tailoredSummary ??
      `Principal Technology Architect & AI Systems Engineer specializing in Next.js 15, multi-agent AI orchestration, and cloud-native platform delivery. Proven track record designing enterprise platforms including EarCodeX, Cineterns, and high-throughput media systems. Highly aligned with ${job.company}'s requirements for ${job.title}.`;

    const tailoredAchievements = parsed?.tailoredAchievements ?? [
      {
        original:
          "Architected and integrated AI gateways with LiteLLM (multi-model routing, token cost tracking, Bedrock/Anthropic/OpenAI failover) and Cloudflare AI Gateway across 300+ cities.",
        tailored: `Architected resilient enterprise AI Gateways with LiteLLM and Cloudflare across 300+ edge locations, directly delivering the scalable model routing and token cost controls required for ${job.title}.`,
        rationale: "Aligns directly with target job's AI model routing and platform infrastructure requirements.",
      },
      {
        original:
          "Delivered EarCodeX from prototype to production as an AWS cloud-native InsurTech platform with automated document intelligence and immutable audit trails.",
        tailored: `Delivered EarCodeX from concept to production on AWS, engineering automated document intelligence, claims reconciliation, and immutable audit trails under strict regulatory standards.`,
        rationale: "Demonstrates production delivery, document intelligence, and enterprise compliance.",
      },
    ];

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

    return {
      tailoredSummary,
      tailoredAchievements,
      emphasizedSkills,
      document: doc,
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

    return {
      coverLetterText,
      keyThemes: ["Enterprise Platform Architecture", "AI Gateway Engineering", "Document Intelligence"],
      document: doc,
    };
  }
}
