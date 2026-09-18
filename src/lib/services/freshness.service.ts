/**
 * ApplyWise AI — Job Freshness & Provenance Evaluation Service
 *
 * Implements Section 5 of the Authoritative Launch Directive:
 * - Preferred: <= 7 days
 * - Acceptable: <= 14 days
 * - Review: 15 - 30 days (requires active confirmation)
 * - Stale / Rejected: > 30 days or missing unverified posting date
 */

export type FreshnessTier = "PREFERRED" | "ACCEPTABLE" | "REVIEW" | "REJECTED";

export interface FreshnessEvaluation {
  isFresh: boolean;
  tier: FreshnessTier;
  ageDays: number;
  postedAt: string;
  evaluatedAt: string;
  statusText: string;
  allowsAutonomousApplication: boolean;
}

export class FreshnessService {
  /**
   * Evaluate a job's posting age against the authoritative freshness policy.
   *
   * @param postedAt ISO string or date string of job publication
   * @param referenceDate Optional reference date (defaults to now)
   */
  public static evaluateFreshness(postedAt?: string | null, referenceDate?: Date): FreshnessEvaluation {
    const now = referenceDate || new Date();
    const evaluatedAt = now.toISOString();

    if (!postedAt) {
      return {
        isFresh: false,
        tier: "REJECTED",
        ageDays: -1,
        postedAt: "UNKNOWN",
        evaluatedAt,
        statusText: "Missing posted date. Unestablished freshness cannot be autonomously queued.",
        allowsAutonomousApplication: false,
      };
    }

    const postedDate = new Date(postedAt);
    if (isNaN(postedDate.getTime())) {
      return {
        isFresh: false,
        tier: "REJECTED",
        ageDays: -1,
        postedAt,
        evaluatedAt,
        statusText: "Invalid date format. Freshness cannot be verified.",
        allowsAutonomousApplication: false,
      };
    }

    const diffMs = now.getTime() - postedDate.getTime();
    // Allow small clock skew (e.g. up to 1 hour in future)
    const ageDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (ageDays <= 7) {
      return {
        isFresh: true,
        tier: "PREFERRED",
        ageDays,
        postedAt,
        evaluatedAt,
        statusText: `Preferred: Posted ${ageDays} day(s) ago (<= 7 days). Highest priority.`,
        allowsAutonomousApplication: true,
      };
    }

    if (ageDays <= 14) {
      return {
        isFresh: true,
        tier: "ACCEPTABLE",
        ageDays,
        postedAt,
        evaluatedAt,
        statusText: `Acceptable: Posted ${ageDays} day(s) ago (<= 14 days). Vacancy active.`,
        allowsAutonomousApplication: true,
      };
    }

    if (ageDays <= 30) {
      return {
        isFresh: false,
        tier: "REVIEW",
        ageDays,
        postedAt,
        evaluatedAt,
        statusText: `Review: Posted ${ageDays} days ago (> 14 days). Requires manual verification that vacancy is open.`,
        allowsAutonomousApplication: false,
      };
    }

    return {
      isFresh: false,
      tier: "REJECTED",
      ageDays,
      postedAt,
      evaluatedAt,
      statusText: `Rejected: Posted ${ageDays} days ago (> 30 days). Classified as stale.`,
      allowsAutonomousApplication: false,
    };
  }

  /**
   * Checks whether a job is considered stale (> 30 days or invalid date).
   */
  public static isStale(postedAt?: string | null, referenceDate?: Date, maxAgeDays = 30): boolean {
    const evaluation = this.evaluateFreshness(postedAt, referenceDate);
    return evaluation.tier === "REJECTED" || evaluation.ageDays > maxAgeDays;
  }

  /**
   * Filters a list of jobs, removing any stale vacancies older than maxAgeDays (default 30).
   */
  public static filterFreshJobs<T extends { postedAt?: string }>(
    jobs: T[],
    referenceDate?: Date,
    maxAgeDays = 30
  ): T[] {
    return jobs.filter((job) => !this.isStale(job.postedAt, referenceDate, maxAgeDays));
  }

  /**
   * Formats posting age into a clean, human-readable relative label with calendar date context.
   */
  public static formatPostingAge(postedAt?: string | null, referenceDate?: Date): string {
    if (!postedAt) return "Recently posted";
    const evaluation = this.evaluateFreshness(postedAt, referenceDate);
    if (evaluation.ageDays < 0) return "Recently posted";
    if (evaluation.ageDays === 0) return "Posted today";
    if (evaluation.ageDays === 1) return "Posted 1 day ago";
    if (evaluation.ageDays <= 7) return `Posted ${evaluation.ageDays} days ago`;
    if (evaluation.ageDays <= 14) return "Posted 1 week ago";
    if (evaluation.ageDays <= 30) return `Posted ${Math.floor(evaluation.ageDays / 7)} weeks ago`;
    return `Posted ${evaluation.ageDays} days ago (Stale)`;
  }

  /**
   * Generates a canonical fingerprint to prevent applying twice to duplicate listings.
   */
  public static generateCanonicalFingerprint(title: string, company: string, location: string): string {
    const norm = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    return `${norm(title)}__${norm(company)}__${norm(location)}`;
  }
}
