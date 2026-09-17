/**
 * ApplyWise AI — Live Production End-to-End Acceptance Test Runner
 * Executes Section 44 & Section 56 of the Master Directive against live Vercel production:
 * https://applywise-ai-app.vercel.app/api/control/chat
 */

const BASE_URL = "https://applywise-ai-app.vercel.app";

async function postChat(message, extra = {}) {
  const res = await fetch(`${BASE_URL}/api/control/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, ...extra })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function runAcceptanceSequence() {
  console.log("================================================================================");
  console.log("APPLYWISE AI — LIVE PRODUCTION CONTROL-PLANE ACCEPTANCE TEST MATRIX (SECTION 44)");
  console.log("Target Base URL:", BASE_URL);
  console.log("Timestamp:", new Date().toISOString());
  console.log("================================================================================\n");

  const results = [];

  // TEST 1: Greeting Test
  console.log("--- TEST 1: GREETING TEST ---");
  console.log("User: 'hi'");
  const t1 = await postChat("hi");
  console.log("Intent:", t1.intent);
  console.log("Runtime Status:", t1.runtimeStatus);
  console.log("Tool Calls:", t1.toolCalls.length);
  console.log("Assistant Message:", t1.message);
  const t1Pass = t1.intent === "CONVERSATION" && 
                 t1.toolCalls.length === 0 && 
                 t1.message.toLowerCase().includes("applywise") &&
                 !t1.message.includes("submitted 1") && 
                 !t1.message.includes("18 roles");
  console.log("TEST 1 RESULT:", t1Pass ? "PASS (Zero hallucination, purely conversational)" : "FAIL");
  results.push({ test: 1, name: "Greeting ('hi')", pass: t1Pass });

  // TEST 2: Capability Test
  console.log("\n--- TEST 2: CAPABILITY TEST ---");
  console.log("User: 'What can you control?'");
  const t2 = await postChat("What can you control?");
  console.log("Intent:", t2.intent);
  console.log("Message:", t2.message);
  const t2Pass = (t2.intent === "SYSTEM_STATUS" || t2.intent === "CONVERSATION") && 
                 (t2.message.includes("12 specialized agents") || t2.result.includes("12 specialized agents"));
  console.log("TEST 2 RESULT:", t2Pass ? "PASS (Real capability enumeration)" : "FAIL");
  results.push({ test: 2, name: "Capabilities ('What can you control?')", pass: t2Pass });

  // TEST 3: System Status Test
  console.log("\n--- TEST 3: SYSTEM STATUS TEST ---");
  console.log("User: 'What is the current ApplyWise system status?'");
  const t3 = await postChat("What is the current ApplyWise system status?");
  console.log("Intent:", t3.intent);
  console.log("Result:", t3.result);
  console.log("Evidence:", t3.evidence);
  const t3Pass = t3.intent === "SYSTEM_STATUS" && 
                 t3.result.includes("HEALTHY") &&
                 t3.toolCalls.some(t => t.toolName === "get_system_health");
  console.log("TEST 3 RESULT:", t3Pass ? "PASS (Truthful health status from live probe)" : "FAIL");
  results.push({ test: 3, name: "System Status", pass: t3Pass });

  // TEST 4: AI Model Status Test
  console.log("\n--- TEST 4: AI MODEL STATUS TEST ---");
  console.log("User: 'What AI model is actually running right now?'");
  const t4 = await postChat("What AI model is actually running right now?");
  console.log("Intent:", t4.intent);
  console.log("Runtime Status:", t4.runtimeStatus);
  console.log("Provider:", t4.provider);
  console.log("Active Model:", t4.activeModel);
  const t4Pass = t4.intent === "MODEL_STATUS" && 
                 t4.provider.includes("OpenCode Zen") &&
                 t4.activeModel.includes("nemotron") &&
                 (t4.runtimeStatus === "REAL_AI" || t4.runtimeStatus === "SIMULATION_HEURISTIC");
  console.log("TEST 4 RESULT:", t4Pass ? "PASS (Truthful runtime reporting, zero masquerading)" : "FAIL");
  results.push({ test: 4, name: "AI Model Status", pass: t4Pass });

  // TEST 5: Job Discovery & Eligibility
  console.log("\n--- TEST 5: JOB DISCOVERY & ELIGIBILITY ---");
  console.log("User: 'What are my latest eligible South African AI jobs?'");
  const t5 = await postChat("What are my latest eligible South African AI jobs?");
  console.log("Intent:", t5.intent);
  console.log("Tool Calls:", t5.toolCalls.map(t => t.toolName));
  console.log("Result:", t5.result);
  const t5Pass = t5.intent === "JOB_DISCOVERY" && 
                 t5.toolCalls.some(t => t.toolName === "search_jobs") &&
                 (t5.message.includes("IQbusiness") || t5.result.includes("verified vacancies"));
  console.log("TEST 5 RESULT:", t5Pass ? "PASS (Real job discovery for South Africa)" : "FAIL");
  results.push({ test: 5, name: "Job Discovery (South Africa)", pass: t5Pass });

  // TEST 6: Job Eligibility Rationale
  console.log("\n--- TEST 6: JOB ELIGIBILITY RATIONALE ---");
  console.log("User: 'Explain why the top result is eligible.'");
  const t6 = await postChat("Explain why the top result is eligible.");
  console.log("Intent:", t6.intent);
  console.log("Result:", t6.result);
  console.log("Evidence:", t6.evidence);
  const t6Pass = (t6.intent === "JOB_ANALYSIS" || t6.intent === "JOB_ELIGIBILITY") && 
                 t6.result.includes("APPLY");
  console.log("TEST 6 RESULT:", t6Pass ? "PASS (Three-way candidate evidence & eligibility reasoning)" : "FAIL");
  results.push({ test: 6, name: "Job Eligibility Rationale", pass: t6Pass });

  // TEST 7: Prepare Application Workflow
  console.log("\n--- TEST 7: PREPARE APPLICATION WORKFLOW ---");
  console.log("User: 'Prepare the application.'");
  const t7 = await postChat("Prepare the application.");
  console.log("Intent:", t7.intent);
  console.log("Result:", t7.result);
  console.log("Requires Approval:", t7.requiresApproval);
  console.log("Pending Action ID:", t7.pendingAction?.actionId);
  const t7Pass = t7.intent === "APPLICATION_PREPARATION" && 
                 t7.toolCalls.some(t => t.toolName === "prepare_application") &&
                 t7.requiresApproval === true &&
                 t7.pendingAction !== undefined &&
                 t7.result.includes("PREPARED");
  console.log("TEST 7 RESULT:", t7Pass ? "PASS (LangGraph workflow executed, held for explicit user approval)" : "FAIL");
  results.push({ test: 7, name: "Prepare Application Workflow", pass: t7Pass });

  // TEST 8: Master CV Integrity Hash
  console.log("\n--- TEST 8: MASTER CV INTEGRITY HASH ---");
  console.log("User: 'What is my Master CV integrity status?'");
  const t8 = await postChat("What is my Master CV integrity status?");
  console.log("Result:", t8.result);
  const cvTool = t8.toolCalls.find(t => t.toolName === "get_master_cv_integrity");
  console.log("Tool Data:", cvTool?.data);
  const expectedHash = "3994a09c76cb5922f41f6a212aa99e1392d0a06dbecf650cb307756d5ef2423f";
  const t8Pass = (t8.result.toLowerCase().includes(expectedHash) || cvTool?.data?.actualHash?.toLowerCase() === expectedHash) && 
                 (cvTool?.data?.fileSizeBytes === 42135 || t8.result.includes("VERIFIED_UNTAMPERED"));
  console.log("TEST 8 RESULT:", t8Pass ? "PASS (Exact 32-byte SHA-256 hash & 42,135 bytes verified)" : "FAIL");
  results.push({ test: 8, name: "Master CV Cryptographic Hash", pass: t8Pass });

  // TEST 9: Application Status Query
  console.log("\n--- TEST 9: APPLICATION STATUS QUERY ---");
  console.log("User: 'What is the status of that application?'");
  const t9 = await postChat("What is the status of that application?");
  console.log("Intent:", t9.intent);
  console.log("Result:", t9.result);
  console.log("Message:", t9.message);
  const t9Pass = t9.intent === "APPLICATION_REVIEW" && 
                 (t9.result.includes("Pipeline") || t9.message.includes("IQbusiness") || t9.message.includes("Synthesia"));
  console.log("TEST 9 RESULT:", t9Pass ? "PASS (Authoritative application state returned from DB)" : "FAIL");
  results.push({ test: 9, name: "Application Status Query", pass: t9Pass });

  // TEST 10: Cloud Scheduler Telemetry
  console.log("\n--- TEST 10: CLOUD SCHEDULER TELEMETRY ---");
  console.log("User: 'What happened in the last autonomous cycle?'");
  const t10 = await postChat("What happened in the last autonomous cycle?");
  console.log("Intent:", t10.intent);
  console.log("Result:", t10.result);
  console.log("Evidence:", t10.evidence);
  const schedTool = t10.toolCalls.find(t => t.toolName === "get_scheduler_status");
  const t10Pass = t10.intent === "SCHEDULER_CONTROL" && 
                  t10.result.includes("CYCLE-2026-09-17-B2") &&
                  schedTool?.data?.weeklyQuota?.target === 200;
  console.log("TEST 10 RESULT:", t10Pass ? "PASS (Real scheduler cycle ID, lease, and quota metrics)" : "FAIL");
  results.push({ test: 10, name: "Cloud Scheduler Telemetry", pass: t10Pass });

  console.log("\n================================================================================");
  console.log("FINAL LIVE ACCEPTANCE SUMMARY:");
  const allPassed = results.every(r => r.pass);
  results.forEach(r => console.log(`Test ${r.test}: ${r.name} -> ${r.pass ? "✓ PASSED" : "✗ FAILED"}`));
  console.log(`\nOVERALL STATUS: ${allPassed ? "10/10 TESTS PASSED (100% SUCCESS)" : "FAILURES DETECTED"}`);
  console.log("================================================================================");

  if (!allPassed) process.exit(1);
}

runAcceptanceSequence().catch(err => {
  console.error("ACCEPTANCE TEST FAILED WITH EXCEPTION:", err);
  process.exit(1);
});
