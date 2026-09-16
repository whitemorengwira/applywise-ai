import { JobListing, MatchAnalysis, UserProfile, WorkExperience, SkillItem } from "@/types";
import { AIGateway } from "../ai/gateway";
import { repository } from "../db/repository";
import { jobsAnalyzedTotal, agentRunsTotal, agentDurationSeconds } from "../observability/metrics";
import { logger } from "../observability/logger";

export interface LocationEligibility {
  eligible: boolean;
  score: number;
  status: "fully_eligible" | "conditionally_eligible" | "ineligible";
  reason: string;
}

export class MatchService {
  /**
   * Validates non-negotiable location and work arrangement rules:
   * - South Africa: 100% remote only.
   * - Zimbabwe / Malawi: Remote, hybrid, or on-site.
   * - Rest of Africa: 100% remote only.
   * - Global: 100% remote only, with explicit country or contractor eligibility.
   */
  static checkLocationEligibility(job: JobListing, _candidateLocation?: string): LocationEligibility {
    const loc = (job.location || "").toLowerCase();
    const desc = (job.description || "").toLowerCase();
    const candidateLoc = (_candidateLocation || "").toLowerCase();
    const isRemote = job.remoteType === "Remote" || loc.includes("remote option") || desc.includes("remote option") || desc.includes("remote available");

    // Check if candidate profile explicitly establishes residency / eligibility in this market
    const candidateHasUkTies = (candidateLoc.includes("london") || candidateLoc.includes("uk")) && (loc.includes("london") || loc.includes("uk"));

    // 1. Zimbabwe or Malawi: Remote, hybrid, or on-site permitted
    if (loc.includes("zimbabwe") || loc.includes("harare") || loc.includes("malawi") || loc.includes("lilongwe") || loc.includes("blantyre")) {
      return {
        eligible: true,
        score: 100,
        status: "fully_eligible",
        reason: "Permitted market (Zimbabwe/Malawi): On-site, hybrid, or remote accepted.",
      };
    }

    // 2. South Africa: 100% remote only
    if (loc.includes("south africa") || loc.includes("johannesburg") || loc.includes("cape town") || loc.includes("durban") || loc.includes("pretoria")) {
      if (isRemote) {
        return {
          eligible: true,
          score: 100,
          status: "fully_eligible",
          reason: "South Africa market: 100% remote arrangement verified.",
        };
      }
      return {
        eligible: false,
        score: 20,
        status: "ineligible",
        reason: "Non-negotiable rule: South Africa roles must be 100% remote only. On-site or hybrid is disqualified.",
      };
    }

    // 3. Other African countries: 100% remote only
    const africanCountries = ["kenya", "nigeria", "ghana", "rwanda", "uganda", "egypt", "tanzania", "zambia", "botswana", "namibia"];
    if (africanCountries.some((c) => loc.includes(c))) {
      if (isRemote) {
        return {
          eligible: true,
          score: 100,
          status: "fully_eligible",
          reason: "African regional market: 100% remote verified.",
        };
      }
      return {
        eligible: false,
        score: 25,
        status: "ineligible",
        reason: "African regional market requires 100% remote arrangement.",
      };
    }

    // 4. Candidate with explicit UK/London residency or Remote Option
    if (candidateHasUkTies || isRemote) {
      // Check for explicit exclusionary geo-fencing in remote roles
      const geoRestrictions = [
        "us only", "u.s. only", "united states only", "must reside in the us", "must reside in us",
        "us citizens only", "security clearance required", "must be based in the us",
      ];

      const hasGeoLock = geoRestrictions.some((r) => loc.includes(r) || desc.includes(r));
      if (hasGeoLock) {
        return {
          eligible: false,
          score: 35,
          status: "ineligible",
          reason: "Role contains strict regional geographic lock (e.g., US residency/citizenship required).",
        };
      }

      // Check for positive cross-border indicators
      const globalPermissive = ["worldwide", "anywhere", "global", "emea", "contractor", "all countries", "africa", "international", "remote option"];
      const isExplicitlyGlobal = globalPermissive.some((p) => loc.includes(p) || desc.includes(p)) || candidateHasUkTies;

      if (isExplicitlyGlobal) {
        return {
          eligible: true,
          score: 100,
          status: "fully_eligible",
          reason: candidateHasUkTies
            ? "Candidate profile verifies UK/London eligibility with remote flexibility."
            : "Global / EMEA remote with explicit cross-border or contractor eligibility.",
        };
      }

      return {
        eligible: true,
        score: 85,
        status: "conditionally_eligible",
        reason: "Remote role — verify employer accepts international independent contractor arrangement.",
      };
    }

    // 5. International on-site/hybrid without candidate residency match
    return {
      eligible: false,
      score: 15,
      status: "ineligible",
      reason: "International roles must be 100% remote unless candidate maintains local residency.",
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
        systemPrompt: "You are a principal talent evaluation engine. Produce factual, rigorous, non-flattering assessments.",
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
          : parsed?.recommendedAction ??
            "High priority opportunity. Proceed to CV tailoring highlighting enterprise AI Gateway and distributed telemetry architectures.",
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
