import { describe, it, expect, beforeAll } from "vitest";
import { ToolRegistry } from "@/lib/control/tool-registry";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

describe("Control Plane Tool Registry (Sections 11, 12, 16)", () => {
  beforeAll(() => {
    ToolRegistry.initialize();
  });

  it("registers at least 20 real backend tools", () => {
    const allTools = ToolRegistry.getAllTools();
    expect(allTools.length).toBeGreaterThanOrEqual(20);
  });

  it("executes get_candidate_profile with verified credentials", async () => {
    const res = await ToolRegistry.executeTool("get_candidate_profile");
    expect(res.success).toBe(true);
    const data = res.data as Record<string, unknown>;
    expect(data.name).toContain("Whitemore Ngwira");
    expect(data.experienceYears).toBe("14+");
  });

  it("executes get_master_cv_integrity with exact SHA-256 and byte size", async () => {
    const res = await ToolRegistry.executeTool("get_master_cv_integrity");
    expect(res.success).toBe(true);
    const data = res.data as Record<string, unknown>;
    expect(data.expectedHash).toBe(MASTER_CV_SHA256);
    expect(data.actualHash).toBe(MASTER_CV_SHA256);
    expect(data.fileSizeBytes).toBe(42135);
    expect(data.status).toBe("VERIFIED_UNTAMPERED");
  });

  it("executes search_jobs and returns verified South African roles", async () => {
    const res = await ToolRegistry.executeTool("search_jobs", { location: "South Africa" });
    expect(res.success).toBe(true);
    const data = res.data as { jobs: Array<Record<string, unknown>> };
    expect(data.jobs.length).toBeGreaterThan(0);
    const saJob = data.jobs.find((j) => String(j.location ?? "").includes("South Africa"));
    expect(saJob).toBeDefined();
  });

  it("executes check_job_eligibility applying SA Remote/Hybrid/On-site rules", async () => {
    const res = await ToolRegistry.executeTool("check_job_eligibility", { jobId: "job-sa-real-iqbusiness" });
    expect(res.success).toBe(true);
    const data = res.data as Record<string, unknown>;
    expect(data.decision).toBe("APPLY");
    expect(data.workModeEligibility).toContain("Eligible");
  });

  it("executes get_ai_model_status with truthful runtime mode", async () => {
    const res = await ToolRegistry.executeTool("get_ai_model_status");
    expect(res.success).toBe(true);
    const data = res.data as Record<string, unknown>;
    expect(data.provider).toContain("OpenCode Zen");
    expect(["REAL_AI", "AI_RUNTIME_UNAVAILABLE"]).toContain(data.runtimeStatus);
  });

  it("executes get_system_health with all services healthy", async () => {
    const res = await ToolRegistry.executeTool("get_system_health");
    expect(res.success).toBe(true);
    const data = res.data as Record<string, unknown>;
    expect(data.status).toBe("HEALTHY");
  });

  it("executes get_scheduler_status with zero laptop dependency", async () => {
    const res = await ToolRegistry.executeTool("get_scheduler_status");
    expect(res.success).toBe(true);
    const data = res.data as Record<string, unknown>;
    expect(data.schedulerState).toBe("ACTIVE");
    expect(data.laptopDependency).toContain("ZERO");
  });

  it("identifies mutating tools and enforces approval requirement", () => {
    const submitTool = ToolRegistry.getTool("submit_application");
    expect(submitTool).toBeDefined();
    expect(submitTool?.isMutating).toBe(true);
    expect(submitTool?.requiresApproval).toBe(true);

    const cycleTool = ToolRegistry.getTool("run_autonomous_cycle");
    expect(cycleTool).toBeDefined();
    expect(cycleTool?.isMutating).toBe(true);
    expect(cycleTool?.requiresApproval).toBe(true);
  });
});
