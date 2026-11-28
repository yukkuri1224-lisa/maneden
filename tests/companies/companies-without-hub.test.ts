import { describe, expect, it } from "vitest";

import { companies, companiesWithoutHub } from "@/lib/companies/data";
import { hasIndustryHub } from "@/lib/companies/industries";

describe("companiesWithoutHub", () => {
  it("ハブのない業種の企業だけを返し、ハブのある企業は含まない", () => {
    const list = companiesWithoutHub();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((c) => !hasIndustryHub(c.industry))).toBe(true);
    const withHub = companies.filter((c) => hasIndustryHub(c.industry));
    expect(list.length + withHub.length).toBe(companies.length);
  });
});
