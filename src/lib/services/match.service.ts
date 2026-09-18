import { JobListing, MatchAnalysis, UserProfile, WorkExperience, SkillItem } from "@/types";
import { AIGateway } from "../ai/gateway";
import { repository } from "../db/repository";
import { jobsAnalyzedTotal, agentRunsTotal, agentDurationSeconds } from "../observability/metrics";
import { logger } from "../observability/logger";

import { EligibilityService } from "./eligibility.service";

export interface LocationEligibility {
  eligible: boolean;
  score: number;
  status: "fully_eligible" | "conditionally_eligible" | "unknown_verify" | "ineligible";
  reason: string;
}

export class MatchService {
  /**
   * Validates non-negotiable location and work arrangement rules via EligibilityService:
   * - South Africa: Remote, Hybrid, or On-site is 100% ELIGIBLE.
   * - Zimbabwe / Malawi: Remote, Hybrid, or On-site is 100% ELIGIBLE.
   * - Wider Africa: Remote verified.
   * - Global: Explicit cross-border/contractor eligibility required.
   *   Unknown defaults strictly to unknown_verify ("UNKNOWN — VERIFY").
   */
  static checkLocationEligibility(job: JobListing, _candidateLocation?: string): LocationEligibility {
    const res = EligibilityService.evaluateLocationEligibility(job, _candidateLocation);
    return {
      eligible: res.eligible,
      score: res.score,
      status: res.status,
      reason: res.reason,
    };
  }

  /**
   * Evaluates compatibility between candidate profile and a target job listing.
   * Employs hybrid scoring: Deterministic heuristic weighting + LLM reasoning evaluation.
   */
  static async evaluateMatch(
    job: JobListing,
    profile: UserProfile,
    skills: SkillItem[],
    experiences: WorkExperience[]
  ): Promise<MatchAnalysis> {
    const startTime = Date.now();
    const candidateSkillNames = skills.map((s) => s.name.toLowerCase());
    const requiredSkills = job.skills.map((s) => s.toLowerCase());

    // 1. Geographic & work arrangement eligibility check
    const locationCheck = this.checkLocationEligibility(job, profile.location);

    // 2. Deterministic skill overlap
    const matchedSkills = job.skills.filter((s) =>
      candidateSkillNames.some((cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
    );
    const missingSkills = job.skills.filter((s) => !matchedSkills.includes(s));
    const skillScore = requiredSkills.length > 0 ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 85;

    // 3. Experience seniority heuristic
    const expScore = profile.yearsExperience >= 10 ? 95 : 80;

    // 4. Prompt AI Gateway for comprehensive qualitative reasoning
    const prompt = `
Evaluate the candidate fit for this role:
Role: ${job.title} at ${job.company}
Work Arrangement: ${job.remoteType} (${job.location})
Location Eligibility Status: ${locationCheck.status} (${locationCheck.reason})
Requirements: ${job.requirements.join("; ")}
Candidate Profile: ${profile.headline}
Experience: ${experiences.map((e) => `${e.title} at ${e.company} (${e.achievements.slice(0, 3).join(", ")})`).join("; ")}
Skills: ${skills.map((s) => s.name).join(", ")}

Return a strict JSON object with:
{
  "overallScore": number (0-100),
  "tier": "strong_match" | "moderate_match" | "reach" | "unqualified",
  "technicalScore": number (0-100),
  "experienceScore": number (0-100),
  "domainScore": number (0-100),
  "keyStrengths": [string, string, string],
  "criticalGaps": [string],
  "recommendedAction": string
}
`;

    try {
      const aiResult = await AIGateway.complete({
        taskType: "match_scoring",
        prompt,
        systemPrompt:
          "You are a principal talent evaluation engine. Produce factual, rigorous, non-flattering assessments. Note: The candidate's Master CV is cryptographically immutable and strictly preserved as the master document. For recommendedAction, always recommend tailoring the cover letter rather than modifying the CV.",
      });

      // Record audit log
      repository.recordAILog(aiResult.log);

      interface ParsedMatch {
        overallScore?: number;
        technicalScore?: number;
        experienceScore?: number;
        domainScore?: number;
        keyStrengths?: string[];
        criticalGaps?: string[];
        recommendedAction?: string;
      }
      let parsed: ParsedMatch | null = null;
      try {
        parsed = JSON.parse(aiResult.content.replace(/```json\n?|\n?```/g, "").trim());
      } catch {
        parsed = null;
      }

      let overallScore = parsed?.overallScore ?? Math.round(skillScore * 0.45 + expScore * 0.35 + locationCheck.score * 0.20);
      
      // If geographic eligibility failed, cap the overall score
      if (!locationCheck.eligible) {
        overallScore = Math.min(overallScore, 48);
      }

      const tier =
        overallScore >= 85 ? "strong_match" : overallScore >= 70 ? "moderate_match" : overallScore >= 50 ? "reach" : "unqualified";

      const analysis: MatchAnalysis = {
        id: `match-${Date.now()}`,
        jobId: job.id,
        profileId: profile.id,
        overallScore,
        tier,
        breakdown: [
          {
            category: "Core Technical Competencies",
            score: parsed?.technicalScore ?? skillScore,
            weight: 0.40,
            matchedSkills,
            missingSkills,
            notes: `${matchedSkills.length} of ${job.skills.length} target skills directly verified.`,
          },
          {
            category: "Architectural Seniority",
            score: parsed?.experienceScore ?? expScore,
            weight: 0.30,
            matchedSkills: ["Principal Level Leadership", "Enterprise Platform Engineering"],
            missingSkills: [],
            notes: `${profile.yearsExperience} years verified production experience.`,
          },
          {
            category: "Geographic & Work Arrangement Eligibility",
            score: locationCheck.score,
            weight: 0.15,
            matchedSkills: locationCheck.eligible ? ["Work Arrangement Compliance Verified"] : [],
            missingSkills: !locationCheck.eligible ? ["Non-compliant Work Arrangement"] : [],
            notes: locationCheck.reason,
          },
          {
            category: "Industry & Governance Alignment",
            score: parsed?.domainScore ?? 88,
            weight: 0.15,
            matchedSkills: ["Multi-Engine Architectures", "Zero-Trust Security"],
            missingSkills: missingSkills.slice(0, 1),
            notes: "High degree of alignment with modern AI-driven cloud workflows.",
          },
        ],
        keyStrengths: parsed?.keyStrengths ?? [
          "Demonstrated production architecture with Next.js 15, Supabase, and AI Gateways.",
          "Strong background in multi-tier infrastructure as code and zero-trust networks.",
          "Verifiable live production systems (EarCodeX, Cineterns, N.White Systems).",
        ],
        criticalGaps: parsed?.criticalGaps ?? (missingSkills.length > 0 ? missingSkills : ["None identified."]),
        recommendedAction: !locationCheck.eligible
          ? locationCheck.reason
          : parsed?.recommendedAction
          ? parsed.recommendedAction
              .replace(/cv tailoring/gi, "cover letter tailoring")
              .replace(/tailor cv/gi, "tailor cover letter")
              .replace(/tailoring cv/gi, "tailoring cover letter")
          : "High priority opportunity. Proceed to cover letter tailoring highlighting enterprise AI Gateway and distributed telemetry architectures with immutable Master CV.",
        modelUsed: aiResult.modelUsed,
        createdAt: new Date().toISOString(),
      };

      const durationSec = (Date.now() - startTime) / 1000;
      jobsAnalyzedTotal.inc({ source: 'manual' });
      agentRunsTotal.inc({ agent_name: 'job_analysis', status: 'success' });
      agentDurationSeconds.observe({ agent_name: 'job_analysis' }, durationSec);

      logger.info('job_match_evaluated', `Job match evaluated for ${job.title}`, {
        durationMs: Date.now() - startTime,
        metadata: { score: overallScore, tier },
      });

      repository.saveMatchAnalysis(analysis);
      return analysis;
    } catch (err) {
      agentRunsTotal.inc({ agent_name: 'job_analysis', status: 'fallback' });
      logger.warn('job_match_fallback', `Job match evaluation fallback for ${job.title}`, {
        metadata: { error: err instanceof Error ? err.message : String(err) },
      });
      
      let fallbackScore = Math.round(skillScore * 0.5 + expScore * 0.3 + locationCheck.score * 0.2);
      if (!locationCheck.eligible) {
        fallbackScore = Math.min(fallbackScore, 48);
      }

      // Deterministic fallback
      const fallbackAnalysis: MatchAnalysis = {
        id: `match-fb-${Date.now()}`,
        jobId: job.id,
        profileId: profile.id,
        overallScore: fallbackScore,
        tier: fallbackScore >= 75 ? "strong_match" : fallbackScore >= 50 ? "moderate_match" : "reach",
        breakdown: [
          {
            category: "Technical Overlap",
            score: skillScore,
            weight: 0.5,
            matchedSkills,
            missingSkills,
            notes: "Automated deterministic calculation.",
          },
          {
            category: "Geographic Eligibility",
            score: locationCheck.score,
            weight: 0.2,
            matchedSkills: locationCheck.eligible ? ["Work Arrangement Validated"] : [],
            missingSkills: !locationCheck.eligible ? ["Location / Arrangement Mismatch"] : [],
            notes: locationCheck.reason,
          },
        ],
        keyStrengths: ["Verified full-stack engineering background."],
        criticalGaps: missingSkills,
        recommendedAction: !locationCheck.eligible ? locationCheck.reason : "Review missing keywords before submission.",
        modelUsed: "Heuristic Matcher (Offline)",
        createdAt: new Date().toISOString(),
      };
      repository.saveMatchAnalysis(fallbackAnalysis);
      return fallbackAnalysis;
    }
  }
}
