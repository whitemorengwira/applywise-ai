import { JobListing } from "@/types";

export type EligibilityDecision = "APPLY" | "CONSIDER" | "VERIFY" | "DO_NOT_APPLY";

export type ApplicationRoute =
  | "DIRECT_PORTAL"
  | "LINKEDIN_EASY_APPLY"
  | "EMAIL"
  | "EXTERNAL_JOB_BOARD"
  | "RECRUITER"
  | "UNKNOWN";

export type RolePriorityTier =
  | "Tier 1: AI / Agentic Systems"
  | "Tier 2: AI + Cloud Architecture"
  | "Tier 3: Cloud Architecture / Engineering"
  | "Tier 4: Platform & Infrastructure"
  | "Tier 5: DevOps & DevSecOps"
  | "Tier 6: Systems Architecture & Engineering"
  | "Tier 7: Automation & Technical Operations"
  | "Tier 8: General Technical & Other";

export interface DetailedEligibilityResult {
  decision: EligibilityDecision;
  eligible: boolean;
  score: number;
  status: "fully_eligible" | "conditionally_eligible" | "unknown_verify" | "ineligible";
  reason: string;
  roleTier: RolePriorityTier;
  rolePriorityScore: number;
  applicationRoute: ApplicationRoute;
  locationDetails: {
    market: "South Africa" | "Zimbabwe" | "Malawi" | "Wider Africa" | "Global" | "Unknown";
    workMode: "Remote" | "Hybrid" | "On-site" | "Unspecified";
    isAfricaFirst: boolean;
    isGeofencedRestricted: boolean;
  };
}

export class EligibilityService {
  /**
   * Evaluates role priority tier from title and description.
   * AI/Agentic AI takes highest priority, followed by Cloud, DevOps, Platform, Systems.
   */
  static evaluateRolePriority(title: string, description: string = ""): {
    tier: RolePriorityTier;
    priorityScore: number;
  } {
    const text = `${title} ${description}`.toLowerCase();

    // Priority 1: AI / Agentic AI / AI Systems
    if (
      /\b(agentic|ai agent|ai engineer|ai architect|llm|generative ai|machine learning systems|rag|ai systems|ai solutions)\b/i.test(
        title
      ) ||
      (/\b(multi-agent|langgraph|langchain|model routing|ai gateway)\b/i.test(text) &&
        /\b(ai|engineer|architect)\b/i.test(title))
    ) {
      return { tier: "Tier 1: AI / Agentic Systems", priorityScore: 100 };
    }

    // Priority 2: AI + Cloud
    if (
      (/\b(ai|ml)\b/i.test(text) && /\b(cloud|aws|azure|gcp)\b/i.test(text)) ||
      /\b(cloud ai|ai platform|mlops)\b/i.test(title)
    ) {
      return { tier: "Tier 2: AI + Cloud Architecture", priorityScore: 92 };
    }

    // Priority 3: Cloud Architecture / Cloud Engineering
    if (/\b(cloud architect|cloud engineer|aws architect|solutions architect|enterprise architect)\b/i.test(title)) {
      return { tier: "Tier 3: Cloud Architecture / Engineering", priorityScore: 88 };
    }

    // Priority 4: Platform / Infrastructure
    if (/\b(platform engineer|infrastructure engineer|platform architect|site reliability|sre)\b/i.test(title)) {
      return { tier: "Tier 4: Platform & Infrastructure", priorityScore: 84 };
    }

    // Priority 5: DevOps / DevSecOps
    if (/\b(devops|devsecops|ci\/cd|release engineer)\b/i.test(title)) {
      return { tier: "Tier 5: DevOps & DevSecOps", priorityScore: 80 };
    }

    // Priority 6: Systems Architecture / Systems Engineering
    if (/\b(systems architect|systems engineer|principal engineer|technical architect|staff engineer)\b/i.test(title)) {
      return { tier: "Tier 6: Systems Architecture & Engineering", priorityScore: 78 };
    }

    // Priority 7: Automation / Integration / Technical Operations
    if (/\b(automation engineer|integration engineer|technical operations|tech lead)\b/i.test(title)) {
      return { tier: "Tier 7: Automation & Technical Operations", priorityScore: 72 };
    }

    // Deprioritized: Generic junior software or unrelated multimedia
    return { tier: "Tier 8: General Technical & Other", priorityScore: 50 };
  }

  /**
   * Classifies application submission route
   */
  static classifyApplicationRoute(job: Partial<JobListing>): ApplicationRoute {
    const url = (job.applicationUrl || "").toLowerCase();
    const source = (job.source || "").toLowerCase();
    const desc = (job.description || "").toLowerCase();

    if (url.includes("mailto:") || desc.includes("send cv to") || desc.includes("email your application")) {
      return "EMAIL";
    }
    if (url.includes("linkedin.com") || source.includes("linkedin")) {
      return "LINKEDIN_EASY_APPLY";
    }
    if (
      url.includes("greenhouse.io") ||
      url.includes("lever.co") ||
      url.includes("workable.com") ||
      url.includes("ashbyhq.com") ||
      url.includes("smartrecruiters.com") ||
      url.includes("bamboohr.com")
    ) {
      return "DIRECT_PORTAL";
    }
    if (url.includes("indeed.com") || url.includes("glassdoor.com") || source.includes("job_board")) {
      return "EXTERNAL_JOB_BOARD";
    }
    if (source.includes("recruiter") || desc.includes("recruitment agency")) {
      return "RECRUITER";
    }
    return "UNKNOWN";
  }

  /**
   * Evaluates comprehensive location & work eligibility.
   * Strict Rule:
   * - South Africa: Remote, Hybrid, or On-site is 100% ELIGIBLE.
   * - Zimbabwe & Malawi: Remote, Hybrid, or On-site is 100% ELIGIBLE.
   * - Wider Africa: Remote or African-contractor supported.
   * - Global: Must have positive evidence of Africa/South Africa acceptance or international B2B contractor.
   *   If US-only or UK-only geofenced -> INELIGIBLE.
   *   If remote without clear international eligibility -> UNKNOWN — VERIFY.
   */
  static evaluateLocationEligibility(
    job: Partial<JobListing>,
    candidateLocation?: string
  ): {
    eligible: boolean;
    score: number;
    status: "fully_eligible" | "conditionally_eligible" | "unknown_verify" | "ineligible";
    reason: string;
    locationDetails: DetailedEligibilityResult["locationDetails"];
  } {
    const loc = (job.location || "").toLowerCase();
    const desc = (job.description || "").toLowerCase();
    const remoteType = (job.remoteType || "").toLowerCase();
    const candLoc = (candidateLocation || "").toLowerCase();

    const isRemote =
      remoteType === "remote" ||
      loc.includes("remote") ||
      desc.includes("remote option") ||
      desc.includes("100% remote") ||
      desc.includes("remote first");

    const isHybrid = remoteType === "hybrid" || loc.includes("hybrid");
    const isOnsite = remoteType === "on-site" || (!isRemote && !isHybrid);

    const workMode = isRemote ? "Remote" : isHybrid ? "Hybrid" : isOnsite ? "On-site" : "Unspecified";

    // Candidate residency ties in UK/London
    const candidateHasUkTies =
      (candLoc.includes("london") || candLoc.includes("uk")) &&
      (loc.includes("london") || loc.includes("uk"));
    if (candidateHasUkTies) {
      return {
        eligible: true,
        score: 100,
        status: "fully_eligible",
        reason: `Candidate profile verifies UK/London eligibility with ${workMode} arrangement.`,
        locationDetails: {
          market: "Global",
          workMode,
          isAfricaFirst: false,
          isGeofencedRestricted: false,
        },
      };
    }

    // 1. South Africa: Fully open to Remote, Hybrid, AND On-site!
    const isSouthAfrica =
      loc.includes("south africa") ||
      loc.includes("johannesburg") ||
      loc.includes("cape town") ||
      loc.includes("durban") ||
      loc.includes("pretoria") ||
      loc.includes("gauteng") ||
      loc.includes("stellenbosch");

    if (isSouthAfrica) {
      return {
        eligible: true,
        score: 100,
        status: "fully_eligible",
        reason: `South Africa Tier 1 market: Verified eligible for ${workMode} arrangement.`,
        locationDetails: {
          market: "South Africa",
          workMode,
          isAfricaFirst: true,
          isGeofencedRestricted: false,
        },
      };
    }

    // 2. Zimbabwe & Malawi: Fully open to Remote, Hybrid, AND On-site!
    const isZimOrMalawi =
      loc.includes("zimbabwe") ||
      loc.includes("harare") ||
      loc.includes("bulawayo") ||
      loc.includes("malawi") ||
      loc.includes("lilongwe") ||
      loc.includes("blantyre");

    if (isZimOrMalawi) {
      const marketName = loc.includes("zimbabwe") || loc.includes("harare") ? "Zimbabwe" : "Malawi";
      return {
        eligible: true,
        score: 100,
        status: "fully_eligible",
        reason: `${marketName} priority market: Verified eligible for ${workMode} arrangement.`,
        locationDetails: {
          market: marketName,
          workMode,
          isAfricaFirst: true,
          isGeofencedRestricted: false,
        },
      };
    }

    // 3. Wider Africa
    const widerAfricanCountries = [
      "kenya", "nairobi", "nigeria", "lagos", "ghana", "accra", "rwanda", "kigali",
      "uganda", "kampala", "egypt", "cairo", "tanzania", "zambia", "lusaka", "botswana", "namibia"
    ];
    const isWiderAfrica = widerAfricanCountries.some((c) => loc.includes(c));
    if (isWiderAfrica) {
      if (isRemote) {
        return {
          eligible: true,
          score: 95,
          status: "fully_eligible",
          reason: "Wider African market: 100% remote verified.",
          locationDetails: {
            market: "Wider Africa",
            workMode,
            isAfricaFirst: true,
            isGeofencedRestricted: false,
          },
        };
      }
      return {
        eligible: false,
        score: 30,
        status: "ineligible",
        reason: "Wider African market requires remote arrangement for candidate based in South Africa.",
        locationDetails: {
          market: "Wider Africa",
          workMode,
          isAfricaFirst: true,
          isGeofencedRestricted: false,
        },
      };
    }

    // 4. Check for strict geofencing exclusions (US Only, UK Only, EU Citizens Only)
    const strictGeofencePatterns = [
      "us only", "u.s. only", "united states only", "must reside in the us",
      "must be located in the us", "us citizens only", "security clearance required",
      "uk only", "united kingdom only", "must have right to work in the uk",
      "eu only", "european union only", "must reside in europe", "canada only",
    ];

    const hasGeofence = strictGeofencePatterns.some((pattern) => loc.includes(pattern) || desc.includes(pattern));
    if (hasGeofence) {
      return {
        eligible: false,
        score: 20,
        status: "ineligible",
        reason: "Disqualified by geographic restriction (e.g. US/UK/EU residency or domestic citizenship required).",
        locationDetails: {
          market: "Global",
          workMode,
          isAfricaFirst: false,
          isGeofencedRestricted: true,
        },
      };
    }

    // 5. Global Roles: Distinguish Location from Work Eligibility
    // Check for positive international cross-border indicators
    const explicitGlobalAffirmative = [
      "worldwide", "anywhere in the world", "global remote", "all countries",
      "south africa", "africa", "emea", "contractor", "b2b contract",
      "international contractor", "remote across all timezones",
    ];

    const hasGlobalAffirmation = explicitGlobalAffirmative.some((term) => loc.includes(term) || desc.includes(term));

    if (isRemote && hasGlobalAffirmation) {
      return {
        eligible: true,
        score: 90,
        status: "fully_eligible",
        reason: "Global remote vacancy with verified international/contractor eligibility.",
        locationDetails: {
          market: "Global",
          workMode: "Remote",
          isAfricaFirst: false,
          isGeofencedRestricted: false,
        },
      };
    }

    if (isRemote && !hasGlobalAffirmation) {
      // Remote does NOT automatically mean globally eligible. Default to UNKNOWN — VERIFY!
      return {
        eligible: false,
        score: 60,
        status: "unknown_verify",
        reason: "UNKNOWN — VERIFY: Vacancy indicates remote, but international/African candidate eligibility is unverified.",
        locationDetails: {
          market: "Global",
          workMode: "Remote",
          isAfricaFirst: false,
          isGeofencedRestricted: false,
        },
      };
    }

    // 6. On-site/Hybrid International without local residency
    return {
      eligible: false,
      score: 10,
      status: "ineligible",
      reason: "International on-site/hybrid role requires local work authorization and physical relocation.",
      locationDetails: {
        market: "Global",
        workMode,
        isAfricaFirst: false,
        isGeofencedRestricted: true,
      },
    };
  }

  /**
   * Complete eligibility engine producing holistic decision
   */
  static evaluateFullEligibility(job: Partial<JobListing>): DetailedEligibilityResult {
    const locResult = this.evaluateLocationEligibility(job);
    const rolePriority = this.evaluateRolePriority(job.title || "", job.description || "");
    const route = this.classifyApplicationRoute(job);

    // Reject paid application gates immediately
    const desc = (job.description || "").toLowerCase();
    const url = (job.applicationUrl || "").toLowerCase();
    if (desc.includes("application fee") || desc.includes("paid subscription required to apply") || url.includes("paywall")) {
      return {
        decision: "DO_NOT_APPLY",
        eligible: false,
        score: 0,
        status: "ineligible",
        reason: "REJECTED: Vacancy requires paid application fee or paywall subscription.",
        roleTier: rolePriority.tier,
        rolePriorityScore: 0,
        applicationRoute: route,
        locationDetails: locResult.locationDetails,
      };
    }

    let decision: EligibilityDecision = "DO_NOT_APPLY";
    if (locResult.status === "fully_eligible") {
      decision = rolePriority.priorityScore >= 75 ? "APPLY" : "CONSIDER";
    } else if (locResult.status === "conditionally_eligible") {
      decision = "CONSIDER";
    } else if (locResult.status === "unknown_verify") {
      decision = "VERIFY";
    } else {
      decision = "DO_NOT_APPLY";
    }

    const compositeScore = Math.round(locResult.score * 0.5 + rolePriority.priorityScore * 0.5);

    return {
      decision,
      eligible: decision === "APPLY" || decision === "CONSIDER",
      score: compositeScore,
      status: locResult.status,
      reason: `${locResult.reason} | Role: ${rolePriority.tier}`,
      roleTier: rolePriority.tier,
      rolePriorityScore: rolePriority.priorityScore,
      applicationRoute: route,
      locationDetails: locResult.locationDetails,
    };
  }
}
