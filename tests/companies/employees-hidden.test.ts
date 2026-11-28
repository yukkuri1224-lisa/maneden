import { describe, expect, it } from "vitest";

import { companies, EMPLOYEES_VERIFIED } from "@/lib/companies/data";

describe("企業データ: 未検証の従業員数は表示に使わない", () => {
  it("検証前は全社の employees が undefined になる", () => {
    expect(EMPLOYEES_VERIFIED).toBe(false);
    expect(companies.every((c) => c.employees === undefined)).toBe(true);
  });

  it("従業員数以外の項目（平均年収・年齢・勤続年数）は残る", () => {
    expect(companies.length).toBeGreaterThan(1000);
    expect(companies.every((c) => c.averageSalary > 0)).toBe(true);
    expect(companies.some((c) => c.averageAge != null)).toBe(true);
  });
});
