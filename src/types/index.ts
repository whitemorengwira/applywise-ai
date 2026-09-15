// =============================================================================
// ApplyWise AI — Core Domain Types
// =============================================================================

export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  targetTitles: string[];
  targetLocations: string[];
  targetSalaryMin?: number;
  targetSalaryMax?: number;
  yearsExperience: number;
  seniorityLevel: "Junior" | "Mid" | "Senior" | "Lead" | "Principal" | "Staff" | "Executive";
  linkedinUrl?: string;
  portfolioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  profileId: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  summary?: string;
  achievements: string[];
  technologies: string[];
}

export interface SkillItem {
  id: string;
  profileId: string;
  name: string;
  category: "Technical" | "Soft" | "Leadership" | "Tool" | "Domain";
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  verified: boolean;
}

export interface EducationItem {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
}

// -----------------------------------------------------------------------------
// Job Listings & Search
// -----------------------------------------------------------------------------

export type JobSource = "adzuna" | "arbeitnow" | "manual" | "scraped";

export type ApplicationStatus =
  | "saved"
  | "matched"
  | "tailoring"
  | "ready"
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected"
  | "archived";

export interface JobListing {
  id: string;
  externalId?: string;
  source: JobSource;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  remoteType: "Remote" | "Hybrid" | "On-site";
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  applyUrl: string;
  postedAt: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Match Scoring & Gap Analysis
// -----------------------------------------------------------------------------

export interface MatchCategoryScore {
  category: string;
  score: number; // 0 - 100
  weight: number; // 0 - 1
  matchedSkills: string[];
  missingSkills: string[];
  notes: string;
}

export interface MatchAnalysis {
  id: string;
  jobId: string;
  profileId: string;
  overallScore: number; // 0 - 100
  tier: "strong_match" | "moderate_match" | "reach" | "unqualified";
  breakdown: MatchCategoryScore[];
  keyStrengths: string[];
  criticalGaps: string[];
  recommendedAction: string;
  modelUsed: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Applications & Tailoring
// -----------------------------------------------------------------------------

export interface TailoredDocument {
  id: string;
  applicationId: string;
  type: "cv" | "cover_letter" | "portfolio_note";
  documentType?: "cv" | "cover_letter" | "portfolio_note";
  title?: string;
  version: number;
  content: string;
  diffSummary?: string;
  matchScoreBefore?: number;
  matchScoreAfter?: number;
  modelUsed: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  profileId: string;
  jobId: string;
  status: ApplicationStatus;
  notes?: string;
  customCvUrl?: string;
  customCoverLetterUrl?: string;
  appliedDate?: string;
  deadline?: string;
  interviewStages?: {
    stage: string;
    scheduledAt: string;
    notes?: string;
    completed: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  job?: JobListing;
  matchAnalysis?: MatchAnalysis;
}

// -----------------------------------------------------------------------------
// AI Model Routing & Audit
// -----------------------------------------------------------------------------

export type AITaskType =
  | "job_extraction"
  | "match_scoring"
  | "cv_tailoring"
  | "cover_letter_generation"
  | "agentic_rag"
  | "company_research";

export interface AIOperationLog {
  id: string;
  taskType: AITaskType;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
}
