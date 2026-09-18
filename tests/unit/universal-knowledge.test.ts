import { describe, it, expect } from "vitest";
import { UniversalKnowledgeEngine } from "@/lib/control/universal-knowledge";
import { ControlPlaneOrchestrator } from "@/lib/control/orchestrator";
import { IntentClassifier } from "@/lib/control/intent-classifier";

describe("Universal Knowledge Engine & General AI Assistant", () => {
  describe("Geography & World Capitals", () => {
    it("accurately answers 'what is the capital city of China'", () => {
      const ans = UniversalKnowledgeEngine.findCapitalAnswer("what is the capital city of China");
      expect(ans).not.toBeNull();
      expect(ans).toContain("Beijing");
      expect(ans).toContain("Forbidden City");
      expect(ans).toContain("Asia");
    });

    it("accurately answers 'what is the capital of South Africa'", () => {
      const ans = UniversalKnowledgeEngine.findCapitalAnswer("what is the capital of South Africa");
      expect(ans).not.toBeNull();
      expect(ans).toContain("Pretoria");
      expect(ans).toContain("Cape Town");
      expect(ans).toContain("Bloemfontein");
    });

    it("accurately answers capitals for Zimbabwe, Malawi, UK, USA, France, Japan", () => {
      expect(UniversalKnowledgeEngine.findCapitalAnswer("capital of Zimbabwe")).toContain("Harare");
      expect(UniversalKnowledgeEngine.findCapitalAnswer("capital of Malawi")).toContain("Lilongwe");
      expect(UniversalKnowledgeEngine.findCapitalAnswer("what is the capital of United Kingdom")).toContain("London");
      expect(UniversalKnowledgeEngine.findCapitalAnswer("capital of USA")).toContain("Washington, D.C.");
      expect(UniversalKnowledgeEngine.findCapitalAnswer("capital city of France")).toContain("Paris");
      expect(UniversalKnowledgeEngine.findCapitalAnswer("what is the capital of Japan")).toContain("Tokyo");
    });
  });

  describe("Mathematics & Arithmetic", () => {
    it("computes basic arithmetic accurately", () => {
      expect(UniversalKnowledgeEngine.solveMath("what is 25 * 4")).toContain("100");
      expect(UniversalKnowledgeEngine.solveMath("calculate 150 / 3")).toContain("50");
      expect(UniversalKnowledgeEngine.solveMath("12 + 38")).toContain("50");
      expect(UniversalKnowledgeEngine.solveMath("100 - 45")).toContain("55");
    });

    it("computes square root and mathematical constants", () => {
      expect(UniversalKnowledgeEngine.solveMath("sqrt of 144")).toContain("12");
      expect(UniversalKnowledgeEngine.solveMath("what is pi")).toContain("3.1415");
    });
  });

  describe("Science & Physics Facts", () => {
    it("answers questions about the speed of light", () => {
      const ans = UniversalKnowledgeEngine.findScienceAnswer("what is the speed of light");
      expect(ans).not.toBeNull();
      expect(ans).toContain("299,792,458");
      expect(ans).toContain("E = mc^2");
    });

    it("answers questions about planets and DNA", () => {
      expect(UniversalKnowledgeEngine.findScienceAnswer("how many planets are there")).toContain("8 recognized planets");
      expect(UniversalKnowledgeEngine.findScienceAnswer("what is DNA")).toContain("Deoxyribonucleic Acid");
    });
  });

  describe("Computer Science & Networking", () => {
    it("explains TCP vs UDP", () => {
      const ans = UniversalKnowledgeEngine.findComputerScienceAnswer("difference between tcp and udp");
      expect(ans).not.toBeNull();
      expect(ans).toContain("Transmission Control Protocol");
      expect(ans).toContain("User Datagram Protocol");
      expect(ans).toContain("3-Way Handshake");
    });

    it("explains DNS resolution and Binary Search", () => {
      expect(UniversalKnowledgeEngine.findComputerScienceAnswer("how dns works")).toContain("Domain Name System");
      expect(UniversalKnowledgeEngine.findComputerScienceAnswer("explain binary search")).toContain("O(log n)");
    });
  });

  describe("Intent Classification for Universal Q&A", () => {
    it("classifies 'what is the capital city of China' as GENERAL_KNOWLEDGE", () => {
      const result = IntentClassifier.classify("what is the capital city of China");
      expect(result.intent).toBe("GENERAL_KNOWLEDGE");
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    });

    it("classifies science and tech questions as GENERAL_KNOWLEDGE", () => {
      expect(IntentClassifier.classify("What is the speed of light?").intent).toBe("GENERAL_KNOWLEDGE");
      expect(IntentClassifier.classify("Explain the difference between TCP and UDP").intent).toBe("GENERAL_KNOWLEDGE");
      expect(IntentClassifier.classify("Calculate 25 * 4").intent).toBe("GENERAL_KNOWLEDGE");
    });
  });

  describe("End-to-End Orchestrator Universal Processing", () => {
    it("handles 'what is the capital city of China' with direct answer, no refusal, and no tool execution", async () => {
      const res = await ControlPlaneOrchestrator.processMessage({
        message: "what is the capital city of China",
      });

      expect(res.intent).toBe("GENERAL_KNOWLEDGE");
      expect(res.toolCalls.length).toBe(0);
      expect(res.message).toContain("The capital city of China is **Beijing**");
      expect(res.message).toContain("Forbidden City");
      expect(res.message).not.toContain("I understand you're inquiring about");
      expect(res.message).not.toContain("As your ApplyWise AI Control Plane Copilot, I'm here to assist across your autonomous job search");
      expect(res.requiresApproval).toBe(false);
    });

    it("handles general programming questions directly without canned refusal", async () => {
      const res = await ControlPlaneOrchestrator.processMessage({
        message: "What is the difference between TCP and UDP?",
      });

      expect(res.intent).toBe("GENERAL_KNOWLEDGE");
      expect(res.toolCalls.length).toBe(0);
      expect(res.message).toContain("Transmission Control Protocol");
      expect(res.message).toContain("User Datagram Protocol");
      expect(res.message).not.toContain("As your ApplyWise AI Control Plane Copilot, I'm here to assist across your autonomous job search");
    });

    it("still strictly grounds candidate inquiries on Whitemore's verified dossier", async () => {
      const res = await ControlPlaneOrchestrator.processMessage({
        message: "What AWS architecture evidence do I have?",
      });

      expect(res.intent).toBe("RAG_QUERY");
      expect(res.message).toContain("EarCodeX");
      expect(res.message).toContain("Terraform");
    });
  });
});
