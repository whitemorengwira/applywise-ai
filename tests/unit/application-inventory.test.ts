import { describe, it, expect } from "vitest";
import { ApplicationInventoryService, DEFAULT_INVENTORY } from "@/lib/services/application-inventory.service";

describe("ApplicationInventoryService (Permanent Applied Jobs Ledger)", () => {
  it("retrieves the default permanent applied inventory with verified proof hashes", () => {
    const inventory = ApplicationInventoryService.getInventory();
    expect(inventory.length).toBeGreaterThanOrEqual(5);

    const enteletApp = inventory.find((i) => i.company === "Entelect");
    expect(enteletApp).toBeDefined();
    expect(enteletApp?.proofHash).toContain("PROOF-AW-");
    expect(enteletApp?.salaryFormatted).toContain("ZAR");
    expect(enteletApp?.salaryFormatted).not.toContain("£");

    const econetApp = inventory.find((i) => i.company === "Econet Wireless");
    expect(econetApp).toBeDefined();
    expect(econetApp?.salaryFormatted).toContain("USD");
    expect(econetApp?.salaryFormatted).not.toContain("£");
  });

  it("records a new application and prepends it to the inventory", () => {
    const recorded = ApplicationInventoryService.recordApplication({
      jobId: "job-test-inv-01",
      jobTitle: "Principal Cloud Systems Engineer",
      company: "Synthesia AI",
      location: "Johannesburg / Remote",
      salaryFormatted: "R 1,750,000 - R 2,300,000 ZAR",
      portalRoute: "DIRECT_PORTAL",
      status: "SUBMITTED",
      proofHash: "PROOF-TEST-INV-12345",
      cvHashLocked: "3994a09c2a71f0088aebe523a677bb0b213fd8b5ae5dd06fe0df8fa2707246ec",
      coverLetterSnippet: "Test letter snippet",
      coverLetterFull: "Full executive test letter",
    });

    expect(recorded.id).toContain("app-inv-");
    expect(recorded.appliedAt).toBeTruthy();
    expect(recorded.proofHash).toBe("PROOF-TEST-INV-12345");
  });

  it("filters inventory by portal route and search query", () => {
    const items = DEFAULT_INVENTORY;
    const pnetOnly = ApplicationInventoryService.filterInventory(items, "PNET");
    expect(pnetOnly.every((i) => i.portalRoute === "PNET")).toBe(true);

    const searchEntelect = ApplicationInventoryService.filterInventory(items, "ALL", "Entelect");
    expect(searchEntelect.length).toBe(1);
    expect(searchEntelect[0].company).toBe("Entelect");
  });
});
