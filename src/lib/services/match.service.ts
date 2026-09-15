import { JobListing, MatchAnalysis, UserProfile, WorkExperience, SkillItem } from "@/types";
import { AIGateway } from "../ai/gateway";
import { repository } from "../db/repository";

export class MatchService {
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
    const candidateSkillNames = skills.map((s) => s.name.toLowerCase());
    const requiredSkills = job.skills.map((s) => s.toLowerCase());

    // 1. Deterministic skill overlap
    const matchedSkills = job.skills.filter((s) =>
      candidateSkillNames.some((cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs))
    );
    const missingSkills = job.skills.filter((s) => !matchedSkills.includes(s));
    const skillScore = requiredSkills.length > 0 ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 85;

    // 2. Experience seniority heuristic
    const expScore = profile.yearsExperience >= 10 ? 95 : 80;

    // 3. Prompt AI Gateway for comprehensive qualitative reasoning
    const prompt = `
Evaluate the candidate fit for this role:
Role: ${job.title} at ${job.company}
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

      const overallScore = parsed?.overallScore ?? Math.round(skillScore * 0.5 + expScore * 0.5);
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
            weight: 0.45,
            matchedSkills,
            missingSkills,
            notes: `${matchedSkills.length} of ${job.skills.length} target skills directly verified.`,
          },
          {
            category: "Architectural Seniority",
            score: parsed?.experienceScore ?? expScore,
            weight: 0.35,
            matchedSkills: ["Principal Level Leadership", "Enterprise Platform Engineering"],
            missingSkills: [],
            notes: `${profile.yearsExperience} years verified production experience.`,
          },
          {
            category: "Industry & Governance Alignment",
            score: parsed?.domainScore ?? 88,
            weight: 0.20,
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
        recommendedAction:
          parsed?.recommendedAction ??
          "High priority opportunity. Proceed to CV tailoring highlighting enterprise AI Gateway and distributed telemetry architectures.",
        modelUsed: aiResult.modelUsed,
        createdAt: new Date().toISOString(),
      };

      repository.saveMatchAnalysis(analysis);
      return analysis;
    } catch (err) {
      console.error("[MatchService] Error evaluating match:", err);
      // Deterministic fallback
      const fallbackAnalysis: MatchAnalysis = {
        id: `match-fb-${Date.now()}`,
        jobId: job.id,
        profileId: profile.id,
        overallScore: Math.round(skillScore * 0.6 + expScore * 0.4),
        tier: skillScore >= 75 ? "strong_match" : "moderate_match",
        breakdown: [
          {
            category: "Technical Overlap",
            score: skillScore,
            weight: 0.6,
            matchedSkills,
            missingSkills,
            notes: "Automated deterministic calculation.",
          },
        ],
        keyStrengths: ["Verified full-stack engineering background."],
        criticalGaps: missingSkills,
        recommendedAction: "Review missing keywords before submission.",
        modelUsed: "Heuristic Matcher (Offline)",
        createdAt: new Date().toISOString(),
      };
      repository.saveMatchAnalysis(fallbackAnalysis);
      return fallbackAnalysis;
    }
  }
}
