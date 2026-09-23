import { describe, it, expect } from "vitest";
import { OpenCodeModelRegistryService } from "@/lib/services/opencode-model-registry.service";

describe("Phase G: OpenCode Zen Model Registry & Privacy Routing", () => {
  it("includes MiMo-V2.6-Flash Free, Big Pickle, and Jev 1.13 Free in dynamic catalog", () => {
    const models = OpenCodeModelRegistryService.getModels(true);
    const ids = models.map((m) => m.id);

    expect(ids).toContain("mimo-v2.6-flash-free");
    expect(ids).toContain("big-pickle-free");
    expect(ids).toContain("jev-1.13-free");
    expect(ids).toContain("nemotron-3-ultra-free");
    expect(ids).toContain("ling-3.0-flash-fin-free");
  });

  it("verifies privacy tier tagging across models", () => {
    const mimoV26 = OpenCodeModelRegistryService.getModel("mimo-v2.6-flash-free");
    expect(mimoV26).toBeDefined();
    expect(mimoV26?.privacyTier).toBe("ZERO_RETENTION");

    const bigPickle = OpenCodeModelRegistryService.getModel("big-pickle-free");
    expect(bigPickle).toBeDefined();
    expect(bigPickle?.privacyTier).toBe("ZERO_RETENTION");

    const nemotron = OpenCodeModelRegistryService.getModel("nemotron-3-ultra-free");
    expect(nemotron).toBeDefined();
    expect(nemotron?.privacyTier).toBe("RESTRICTED_PERSONAL_DATA");
  });

  it("leaves prompts unmodified for ZERO_RETENTION models", () => {
    const prompt = "Candidate Whitemore Ngwira (+27 82 123 4567) whitemore.personal@gmail.com";
    const result = OpenCodeModelRegistryService.preparePromptForModel(
      prompt,
      "mimo-v2.6-flash-free"
    );

    expect(result.piiScrubbed).toBe(false);
    expect(result.sanitizedPrompt).toBe(prompt);
  });

  it("redacts personal telephone and external email for RESTRICTED_PERSONAL_DATA models", () => {
    const prompt = "Contact candidate at +27 82 123 4567 or via applicant@personal-inbox.com for scheduling.";
    const result = OpenCodeModelRegistryService.preparePromptForModel(
      prompt,
      "nemotron-3-ultra-free"
    );

    expect(result.piiScrubbed).toBe(true);
    expect(result.sanitizedPrompt).toContain("[REDACTED_TELEPHONE]");
    expect(result.sanitizedPrompt).toContain("[REDACTED_CONTACT_EMAIL]");
    expect(result.sanitizedPrompt).not.toContain("+27 82 123 4567");
    expect(result.sanitizedPrompt).not.toContain("applicant@personal-inbox.com");
  });

  it("syncs catalog cleanly from remote or fallback", async () => {
    const syncResult = await OpenCodeModelRegistryService.syncCatalog();
    expect(syncResult.syncedCount).toBeGreaterThanOrEqual(5);
    expect(["remote_api", "canonical_fallback"]).toContain(syncResult.source);
  });
});
