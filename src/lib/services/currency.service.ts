/**
 * ApplyWise AI — Authoritative Currency & Geographic Compensation Service
 *
 * Enforces correct regional currencies:
 * - South Africa: South African Rands (ZAR / R)
 * - Zimbabwe: US Dollars ($ / USD)
 * - Malawi & Other African/Global/Remote: US Dollars ($ / USD)
 * - Eliminates inappropriate British Pound (£) references for African vacancies.
 */

export class CurrencyService {
  /**
   * Resolves the canonical currency code based on stated currency and location.
   */
  public static resolveCurrency(currency?: string | null, location?: string | null): "ZAR" | "USD" | "GBP" {
    const loc = (location || "").toLowerCase();

    // South Africa
    if (
      loc.includes("south africa") ||
      loc.includes("johannesburg") ||
      loc.includes("cape town") ||
      loc.includes("durban") ||
      loc.includes("pretoria") ||
      loc.includes("sandton") ||
      loc.includes("gauteng") ||
      loc.includes("/ za") ||
      loc.endsWith(" za") ||
      currency?.toUpperCase() === "ZAR"
    ) {
      return "ZAR";
    }

    // Zimbabwe
    if (
      loc.includes("zimbabwe") ||
      loc.includes("harare") ||
      loc.includes("bulawayo") ||
      loc.includes("/ zw")
    ) {
      return "USD";
    }

    // Malawi
    if (
      loc.includes("malawi") ||
      loc.includes("lilongwe") ||
      loc.includes("blantyre")
    ) {
      return "USD";
    }

    // Explicit UK / London
    if (
      (loc.includes("united kingdom") || loc.includes("london") || loc.includes("uk")) &&
      !loc.includes("africa") &&
      !loc.includes("remote (global") &&
      currency?.toUpperCase() === "GBP"
    ) {
      return "GBP";
    }

    // Default to USD for all international, African, and global remote opportunities
    return "USD";
  }

  /**
   * Formats a salary range with the authoritative regional currency symbol and suffix.
   * Examples:
   * - "R 1,450,000 - R 1,950,000 ZAR"
   * - "$120,000 - $155,000 USD"
   */
  public static formatSalary(
    salaryMin?: number | null,
    salaryMax?: number | null,
    currency?: string | null,
    location?: string | null
  ): string {
    const resolved = this.resolveCurrency(currency, location);

    if (!salaryMin && !salaryMax) {
      if (resolved === "ZAR") return "Competitive (Market Leading ZAR)";
      return "Competitive (Market Leading USD)";
    }

    const min = salaryMin ?? salaryMax ?? 0;
    const max = salaryMax ?? salaryMin ?? 0;

    if (resolved === "ZAR") {
      // If numbers were entered in GBP/USD scale (e.g. 130,000), scale appropriately to ZAR executive scale
      const scaledMin = min < 500000 ? Math.round(min * 18.5) : min;
      const scaledMax = max < 500000 ? Math.round(max * 18.5) : max;
      return `R ${scaledMin.toLocaleString()} - R ${scaledMax.toLocaleString()} ZAR`;
    }

    if (resolved === "GBP") {
      return `£${min.toLocaleString()} - £${max.toLocaleString()} GBP`;
    }

    // Default USD
    return `$${min.toLocaleString()} - $${max.toLocaleString()} USD`;
  }
}
