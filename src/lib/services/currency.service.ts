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
   * Strict regional policy:
   * - South Africa => "ZAR"
   * - All other regions (Zimbabwe, Malawi, Global, UK, Europe, Remote) => "USD"
   */
  public static resolveCurrency(currency?: string | null, location?: string | null): "ZAR" | "USD" {
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

    // Default to USD for all international, Zimbabwe, African, and global remote opportunities
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
      // If numbers were entered in lower scale (e.g. 130,000), scale appropriately to ZAR executive scale
      const scaledMin = min < 500000 ? Math.round(min * 18.5) : min;
      const scaledMax = max < 500000 ? Math.round(max * 18.5) : max;
      return `R ${scaledMin.toLocaleString()} - R ${scaledMax.toLocaleString()} ZAR`;
    }

    // Default USD for all other regions
    return `$${min.toLocaleString()} - $${max.toLocaleString()} USD`;
  }
}
