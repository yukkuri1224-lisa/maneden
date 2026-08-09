import { describe, expect, it } from "vitest";

import { calculateIdeco } from "@/lib/calculators/ideco";

describe("calculateIdeco", () => {
  it("年収500万・毎月23,000円・35歳・会社員(企業年金なし)の節税額", () => {
    const r = calculateIdeco({
      income: 5_000_000,
      monthlyContribution: 23_000,
      age: 35,
      category: "company-no-pension",
    });

    expect(r.monthlyCap).toBe(23_000);
    expect(r.appliedMonthlyContribution).toBe(23_000);
    expect(r.annualContribution).toBe(276_000);
    // 課税所得約224万→所得税率10%帯
    expect(r.marginalIncomeTaxRate).toBe(10);
    expect(r.incomeTaxSaved).toBe(28_180); // 所得税差額27,600×1.021
    expect(r.residentTaxSaved).toBe(27_600); // 276,000×10%
    expect(r.annualTaxSaved).toBe(55_780);
    expect(r.savingRate).toBeCloseTo(20.21, 1);
    expect(r.annualNetCost).toBe(220_220);
    expect(r.yearsToSixty).toBe(25);
    expect(r.totalContribution).toBe(6_900_000);
    expect(r.totalTaxSaved).toBe(1_394_500);
  });

  it("加入区分の上限で掛金がクランプされる（DB等・公務員＝月12,000円）", () => {
    const r = calculateIdeco({
      income: 5_000_000,
      monthlyContribution: 23_000, // 上限超過
      age: 35,
      category: "company-db",
    });

    expect(r.monthlyCap).toBe(12_000);
    expect(r.appliedMonthlyContribution).toBe(12_000);
    expect(r.annualContribution).toBe(144_000);
    expect(r.incomeTaxSaved).toBe(14_702); // 差額14,400×1.021
    expect(r.residentTaxSaved).toBe(14_400);
    expect(r.annualTaxSaved).toBe(29_102);
  });

  it("課税所得がゼロになる低所得では節税額もゼロ", () => {
    const r = calculateIdeco({
      income: 1_000_000,
      monthlyContribution: 23_000,
      age: 30,
      category: "company-no-pension",
    });

    expect(r.annualContribution).toBe(276_000);
    expect(r.incomeTaxSaved).toBe(0);
    expect(r.residentTaxSaved).toBe(0);
    expect(r.annualTaxSaved).toBe(0);
  });

  it("掛金ゼロなら節税額もゼロ", () => {
    const r = calculateIdeco({
      income: 5_000_000,
      monthlyContribution: 0,
      age: 35,
      category: "company-no-pension",
    });

    expect(r.annualContribution).toBe(0);
    expect(r.annualTaxSaved).toBe(0);
    expect(r.savingRate).toBe(0);
  });
});
