import {
  UserProfile,
  WorkExperience,
  SkillItem,
  EducationItem,
  JobListing,
  JobApplication,
  MatchAnalysis,
  TailoredDocument,
  AIOperationLog,
} from "@/types";
import {
  SEED_PROFILE,
  SEED_EXPERIENCES,
  SEED_SKILLS,
  SEED_EDUCATIONS,
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_MATCH_ANALYSES,
} from "./seed-data";

// In-memory state store for reliable demo & local development
class AppRepository {
  private profile: UserProfile = { ...SEED_PROFILE };
  private experiences: WorkExperience[] = [...SEED_EXPERIENCES];
  private skills: SkillItem[] = [...SEED_SKILLS];
  private educations: EducationItem[] = [...SEED_EDUCATIONS];
  private jobs: JobListing[] = [...SEED_JOBS];
  private applications: JobApplication[] = [...SEED_APPLICATIONS];
  private matchAnalyses: Record<string, MatchAnalysis> = { ...SEED_MATCH_ANALYSES };
  private tailoredDocuments: TailoredDocument[] = [];
  private auditLogs: AIOperationLog[] = [];

  // Profile methods
  getProfile(): UserProfile {
    return this.profile;
  }

  updateProfile(data: Partial<UserProfile>): UserProfile {
    this.profile = { ...this.profile, ...data, updatedAt: new Date().toISOString() };
    return this.profile;
  }

  getExperiences(): WorkExperience[] {
    return this.experiences;
  }

  addExperience(exp: Omit<WorkExperience, "id">): WorkExperience {
    const newExp: WorkExperience = { ...exp, id: `exp-${Date.now()}` };
    this.experiences.unshift(newExp);
    return newExp;
  }

  getSkills(): SkillItem[] {
    return this.skills;
  }

  getEducations(): EducationItem[] {
    return this.educations;
  }

  // Jobs methods
  getJobs(query?: string, remoteOnly?: boolean): JobListing[] {
    let list = this.jobs;
    if (remoteOnly) {
      list = list.filter((j) => j.remoteType === "Remote");
    }
    if (query && query.trim() !== "") {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getJobById(id: string): JobListing | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  addJob(job: Omit<JobListing, "id" | "createdAt">): JobListing {
    const newJob: JobListing = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  // Applications CRM
  getApplications(): JobApplication[] {
    return this.applications.map((app) => ({
      ...app,
      job: this.getJobById(app.jobId),
      matchAnalysis: this.matchAnalyses[app.jobId],
    }));
  }

  getApplicationById(id: string): JobApplication | undefined {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return undefined;
    return {
      ...app,
      job: this.getJobById(app.jobId),
      matchAnalysis: this.matchAnalyses[app.jobId],
    };
  }

  updateApplicationStatus(id: string, status: JobApplication["status"], notes?: string): JobApplication | null {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index === -1) return null;

    this.applications[index] = {
      ...this.applications[index],
      status,
      notes: notes !== undefined ? notes : this.applications[index].notes,
      updatedAt: new Date().toISOString(),
    };
    return this.getApplicationById(id) || null;
  }

  createApplication(jobId: string): JobApplication {
    const existing = this.applications.find((a) => a.jobId === jobId);
    if (existing) return existing;

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      profileId: this.profile.id,
      jobId,
      status: "saved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      job: this.getJobById(jobId),
      matchAnalysis: this.matchAnalyses[jobId],
    };
    this.applications.unshift(newApp);
    return newApp;
  }

  // Match Analyses
  getMatchAnalysis(jobId: string): MatchAnalysis | undefined {
    return this.matchAnalyses[jobId];
  }

  saveMatchAnalysis(analysis: MatchAnalysis): void {
    this.matchAnalyses[analysis.jobId] = analysis;
  }

  // Tailored Documents
  getTailoredDocuments(applicationId?: string): TailoredDocument[] {
    if (applicationId) {
      return this.tailoredDocuments.filter((d) => d.applicationId === applicationId);
    }
    return this.tailoredDocuments;
  }

  saveTailoredDocument(doc: Omit<TailoredDocument, "id" | "createdAt">): TailoredDocument {
    const newDoc: TailoredDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.tailoredDocuments.unshift(newDoc);
    return newDoc;
  }

  // AI Audit Logging
  recordAILog(log: AIOperationLog): void {
    this.auditLogs.unshift(log);
  }

  getAuditLogs(): AIOperationLog[] {
    return this.auditLogs;
  }
}

export const repository = new AppRepository();
