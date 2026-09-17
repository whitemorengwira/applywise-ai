import { describe, it, expect } from "vitest";
import { IntentClassifier } from "@/lib/control/intent-classifier";

describe("Control Plane Intent Classifier (Sections 6, 7, 18)", () => {
  it("classifies simple conversational greeting 'hi' as CONVERSATION without triggering operational tools", () => {
    const result = IntentClassifier.classify("hi");
    expect(result.intent).toBe("CONVERSATION");
    expect(result.confidence).toBe(1.0);
  });

  it("classifies other conversational greetings as CONVERSATION", () => {
    expect(IntentClassifier.classify("hello").intent).toBe("CONVERSATION");
    expect(IntentClassifier.classify("hey!").intent).toBe("CONVERSATION");
    expect(IntentClassifier.classify("Good morning").intent).toBe("CONVERSATION");
    expect(IntentClassifier.classify("thank you").intent).toBe("CONVERSATION");
    expect(IntentClassifier.classify("thanks").intent).toBe("CONVERSATION");
  });

  it("classifies capability inquiries as SYSTEM_STATUS", () => {
    expect(IntentClassifier.classify("What can you do?").intent).toBe("SYSTEM_STATUS");
    expect(IntentClassifier.classify("What can you control?").intent).toBe("SYSTEM_STATUS");
    expect(IntentClassifier.classify("Who are you?").intent).toBe("SYSTEM_STATUS");
  });

  it("classifies system health inquiries as SYSTEM_STATUS", () => {
    expect(IntentClassifier.classify("Is the system healthy?").intent).toBe("SYSTEM_STATUS");
    expect(IntentClassifier.classify("What is the current system status?").intent).toBe("SYSTEM_STATUS");
  });

  it("classifies AI model inquiries as MODEL_STATUS", () => {
    expect(IntentClassifier.classify("What AI model are you using?").intent).toBe("MODEL_STATUS");
    expect(IntentClassifier.classify("What model is running right now?").intent).toBe("MODEL_STATUS");
    expect(IntentClassifier.classify("Is Nemotron running?").intent).toBe("MODEL_STATUS");
  });

  it("classifies job search inquiries as JOB_DISCOVERY", () => {
    const result = IntentClassifier.classify("Find current AI architect jobs in South Africa");
    expect(result.intent).toBe("JOB_DISCOVERY");
  });

  it("classifies job eligibility inquiries as JOB_ELIGIBILITY", () => {
    const result = IntentClassifier.classify("Is this role eligible for me?");
    expect(result.intent).toBe("JOB_ELIGIBILITY");
  });

  it("classifies match explanation as JOB_ANALYSIS", () => {
    const result = IntentClassifier.classify("Explain why the top result is eligible");
    expect(result.intent).toBe("JOB_ANALYSIS");
  });

  it("classifies candidate evidence inquiries as RAG_QUERY", () => {
    const result = IntentClassifier.classify("What AWS architecture evidence do I have?");
    expect(result.intent).toBe("RAG_QUERY");
  });

  it("classifies application review inquiries as APPLICATION_REVIEW", () => {
    const result = IntentClassifier.classify("How many applications did you submit this week?");
    expect(result.intent).toBe("APPLICATION_REVIEW");
  });

  it("classifies application preparation inquiries as APPLICATION_PREPARATION", () => {
    const result = IntentClassifier.classify("Prepare the application");
    expect(result.intent).toBe("APPLICATION_PREPARATION");
  });

  it("classifies application submission requests as APPLICATION_SUBMISSION", () => {
    const result = IntentClassifier.classify("Submit application now");
    expect(result.intent).toBe("APPLICATION_SUBMISSION");
  });

  it("classifies Master CV integrity inquiries as CV_INTEGRITY", () => {
    const result = IntentClassifier.classify("Verify master CV hash");
    expect(result.intent).toBe("CV_INTEGRITY");
  });

  it("classifies scheduler inquiries as SCHEDULER_CONTROL", () => {
    const result = IntentClassifier.classify("When did the last autonomous cycle run?");
    expect(result.intent).toBe("SCHEDULER_CONTROL");
  });

  it("classifies observability inquiries as OBSERVABILITY", () => {
    const result = IntentClassifier.classify("What is Grafana reporting?");
    expect(result.intent).toBe("OBSERVABILITY");
  });

  it("classifies database inquiries as DATABASE", () => {
    const result = IntentClassifier.classify("What is the Supabase database status?");
    expect(result.intent).toBe("DATABASE");
  });

  it("classifies error inquiries as RECOVERY", () => {
    const result = IntentClassifier.classify("What failed during the last run?");
    expect(result.intent).toBe("RECOVERY");
  });

  it("classifies ambiguous/out-of-domain input as UNKNOWN without inventing", () => {
    const result = IntentClassifier.classify("quantum entanglement of blueberries in 2035");
    expect(result.intent).toBe("UNKNOWN");
    expect(result.confidence).toBeLessThan(0.5);
  });
});
