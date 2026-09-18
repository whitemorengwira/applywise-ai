import { describe, it, expect } from "vitest";
import { CurrencyService } from "@/lib/services/currency.service";

describe("Authoritative CurrencyService (Regional Currency Enforcement)", () => {
  it("resolves South African locations to ZAR", () => {
    expect(CurrencyService.resolveCurrency(undefined, "Johannesburg, South Africa")).toBe("ZAR");
    expect(CurrencyService.resolveCurrency(undefined, "Cape Town, South Africa (Hybrid)")).toBe("ZAR");
    expect(CurrencyService.resolveCurrency(undefined, "Sandton, Gauteng / ZA")).toBe("ZAR");
    expect(CurrencyService.resolveCurrency("ZAR", "Remote")).toBe("ZAR");
  });

  it("resolves Zimbabwe locations to USD", () => {
    expect(CurrencyService.resolveCurrency(undefined, "Harare, Zimbabwe / Remote")).toBe("USD");
    expect(CurrencyService.resolveCurrency(undefined, "Bulawayo, Zimbabwe")).toBe("USD");
    expect(CurrencyService.resolveCurrency(undefined, "Harare / ZW")).toBe("USD");
  });

  it("resolves Malawi and global remote locations to USD", () => {
    expect(CurrencyService.resolveCurrency(undefined, "Lilongwe, Malawi")).toBe("USD");
    expect(CurrencyService.resolveCurrency(undefined, "Remote (Worldwide)")).toBe("USD");
    expect(CurrencyService.resolveCurrency(undefined, "Europe / Remote")).toBe("USD");
  });

  it("formats South African executive salaries in Rands (ZAR)", () => {
    const formatted = CurrencyService.formatSalary(1450000, 1950000, "ZAR", "Johannesburg, South Africa");
    expect(formatted).toContain("R ");
    expect(formatted).toContain("ZAR");
    expect(formatted).not.toContain("£");
  });

  it("formats Zimbabwe executive salaries in US Dollars (USD)", () => {
    const formatted = CurrencyService.formatSalary(120000, 155000, "USD", "Harare, Zimbabwe");
    expect(formatted).toContain("$");
    expect(formatted).toContain("USD");
    expect(formatted).not.toContain("£");
    expect(formatted).not.toContain("ZAR");
  });

  it("auto-scales lower numeric inputs for South African jobs into appropriate ZAR bracket", () => {
    // If a job had 135,000 entered without ZAR scale
    const formatted = CurrencyService.formatSalary(135000, 160000, "ZAR", "South Africa");
    expect(formatted).toContain("R ");
    expect(formatted).toContain("ZAR");
  });
});
