import { describe, it, expect, beforeAll } from "vitest";
import { ControlPlaneOrchestrator } from "@/lib/control/orchestrator";
import { ToolRegistry } from "@/lib/control/tool-registry";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

describe("Control Plane 10-Step Acceptance Test Sequence (Section 44)", () => {
  beforeAll(() => {
    ToolRegistry.initialize();
  });

  // TEST 1: User says "hi" -> No hallucination, no unsolicited tool execution
  it("TEST 1: User sends 'hi' -> returns natural conversational response without hallucinating or running heavy agents", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({ message: "hi" });
    expect(res.intent).toBe("CONVERSATION");
    expect(res.toolCalls.length).toBe(0);
    expect(res.message).toContain("Hello Whitemore");
    expect(res.message).toContain("control plane");
    expect(res.requiresApproval).toBe(false);
  });

  // TEST 2: User asks "What can you control?" -> Returns capability overview
  it("TEST 2: User asks 'What can you control?' -> returns comprehensive capability response", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({ message: "What can you control?" });
    expect(res.intent).toBe("SYSTEM_STATUS");
    expect(res.message).toContain("Capabilities");
    expect(res.message).toContain("Job Discovery");
    expect(res.message).toContain("Geographic Eligibility");
    expect(res.message).toContain("Candidate Evidence RAG");
    expect(res.message).toContain("Cover Letter");
    expect(res.message).toContain("Cryptographic CV");
  });

  // TEST 3: User asks "What is the current ApplyWise system status?" -> Retrieves real status
  it("TEST 3: User asks 'What is the current ApplyWise system status?' -> executes health and CV tools", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "What is the current ApplyWise system status?",
    });
    expect(res.intent).toBe("SYSTEM_STATUS");
    expect(res.toolCalls.length).toBeGreaterThanOrEqual(2);
    expect(res.message).toContain("HEALTHY");
    expect(res.message).toContain("Supabase");
    expect(res.message).toContain("3994a09c");
  });

  // TEST 4: User asks "What AI model is actually running right now?" -> Honest runtime state
  it("TEST 4: User asks 'What AI model is actually running right now?' -> returns real provider and honest runtime status", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "What AI model is actually running right now?",
    });
    expect(res.intent).toBe("MODEL_STATUS");
    expect(res.toolCalls.some((t) => t.toolName === "get_ai_model_status")).toBe(true);
    expect(res.message).toContain("OpenCode Zen");
    expect(["REAL_AI", "AI_RUNTIME_UNAVAILABLE"]).toContain(res.runtimeStatus);
  });

  // TEST 5: User asks "What are my latest eligible South African AI jobs?" -> Real discovery
  it("TEST 5: User asks 'What are my latest eligible South African AI jobs?' -> runs search_jobs and returns verified vacancies", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "What are my latest eligible South African AI jobs?",
    });
    expect(res.intent).toBe("JOB_DISCOVERY");
    expect(res.toolCalls.some((t) => t.toolName === "search_jobs")).toBe(true);
    expect(res.message).toContain("IQbusiness");
    expect(res.message).toContain("South Africa");
  });

  // TEST 6: User asks "Explain why the top result is eligible." -> Three-way match reasoning
  it("TEST 6: User asks 'Explain why the top result is eligible.' -> uses actual job + candidate evidence", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "Explain why the top result is eligible.",
    });
    expect(res.intent).toBe("JOB_ANALYSIS");
    expect(res.message).toContain("Alignment Score");
    expect(res.message).toContain("EarCodeX");
    expect(res.message).toContain("Supabets");
  });

  // TEST 7: User asks "Prepare the application." -> LangGraph safe preparation mode
  it("TEST 7: User asks 'Prepare the application.' -> generates grounded package and stops at PREPARED/AWAITING_APPROVAL", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "Prepare the application.",
    });
    expect(res.intent).toBe("APPLICATION_PREPARATION");
    expect(res.toolCalls.some((t) => t.toolName === "prepare_application")).toBe(true);
    expect(res.message).toContain("PREPARED");
    expect(res.message).toContain("AWAITING_APPROVAL");
    expect(res.requiresApproval).toBe(true);
    expect(res.pendingAction).toBeDefined();
    expect(res.pendingAction?.actionType).toBe("APPLICATION_SUBMISSION");
  });

  // TEST 8: Verify exact Master CV hash
  it("TEST 8: Verifies exact Master CV hash invariance", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "Verify master CV integrity and SHA-256 hash",
    });
    expect(res.intent).toBe("CV_INTEGRITY");
    expect(res.toolCalls.some((t) => t.toolName === "get_master_cv_integrity")).toBe(true);
    expect(res.message).toContain(MASTER_CV_SHA256);
    expect(res.message).toContain("VERIFIED_UNTAMPERED");
  });

  // TEST 9: User asks "What is the status of that application?" -> Real persisted pipeline state
  it("TEST 9: User asks 'What is the status of that application?' -> retrieves actual application records", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "What is the status of that application?",
    });
    expect(res.intent).toBe("APPLICATION_REVIEW");
    expect(res.toolCalls.some((t) => t.toolName === "list_applications")).toBe(true);
    expect(res.message).toContain("Application Pipeline State");
    expect(res.message).toContain("IQbusiness");
  });

  // TEST 10: User asks "What happened in the last autonomous cycle?" -> Retrieves actual telemetry
  it("TEST 10: User asks 'What happened in the last autonomous cycle?' -> retrieves scheduler telemetry", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "What happened in the last autonomous cycle?",
    });
    expect(res.intent).toBe("SCHEDULER_CONTROL");
    expect(res.toolCalls.some((t) => t.toolName === "get_scheduler_status")).toBe(true);
    expect(res.message).toContain("Autonomous Cloud Scheduler Status");
    expect(res.message).toContain("0 6 * * *");
    expect(res.message).toContain("ZERO");
  });

  // TEST 11: Acceptance Prompt: "What do you know about my professional systems architecture background?"
  it("TEST 11: Acceptance Prompt -> executes query_rag, synthesizes evidence with formatted citation badges", async () => {
    const res = await ControlPlaneOrchestrator.processMessage({
      message: "What do you know about my professional systems architecture background?",
    });
    expect(res.intent).toBe("RAG_QUERY");
    expect(res.toolCalls.some((t) => t.toolName === "query_rag")).toBe(true);
    expect(res.message).not.toContain("I am not entirely certain how to interpret your request");
    expect(res.message).toContain("[Source 1: Master CV]");
    expect(res.message).toContain("[Source 2: N.White Systems]");
    expect(res.message).toContain("EarCodeX");
    expect(res.message).toContain("Supabets");
  });
});
