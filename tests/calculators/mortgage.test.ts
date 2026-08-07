import { describe, expect, it } from "vitest";

import {
  calculateMortgage,
  type MortgageInput,
} from "@/lib/calculators/mortgage";

function base(overrides: Partial<MortgageInput> = {}): MortgageInput {
  return {
    principal: 30_000_000,
    annualRatePercent: 1.0,
    years: 35,
    prepayment: 0,
    prepaymentAfterYears: 5,
    ...overrides,
  };
}

describe("calculateMortgage（元利均等）", () => {
  it("金利0%は元金を均等割り（利息ゼロ）", () => {
    const r = calculateMortgage(
      base({ principal: 12_000_000, annualRatePercent: 0, years: 10 }),
    );
    expect(r.monthlyPayment).toBe(100_000);
    expect(r.totalPayment).toBe(12_000_000);
    expect(r.totalInterest).toBe(0);
    expect(r.totalMonths).toBe(120);
  });

  it("借入3,000万・年1%・35年 → 毎月約8.5万・総利息は正", () => {
    const r = calculateMortgage(base());
    expect(r.monthlyPayment).toBeGreaterThan(80_000);
    expect(r.monthlyPayment).toBeLessThan(90_000);
    expect(r.totalInterest).toBeGreaterThan(0);
    expect(r.totalPayment).toBe(r.totalInterest + 30_000_000);
  });

  it("金利が高いほど総利息が増える", () => {
    const low = calculateMortgage(base({ annualRatePercent: 0.5 }));
    const high = calculateMortgage(base({ annualRatePercent: 2.0 }));
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest);
  });
});

describe("calculateMortgage（繰上返済・期間短縮型）", () => {
  it("繰上返済で総利息と返済期間が減る", () => {
    const pre = calculateMortgage(
      base({
        annualRatePercent: 1.5,
        prepayment: 3_000_000,
        prepaymentAfterYears: 5,
      }),
    );
    expect(pre.prepaymentEffect.applied).toBe(true);
    expect(pre.prepaymentEffect.interestSaved).toBeGreaterThan(0);
    expect(pre.prepaymentEffect.monthsSaved).toBeGreaterThan(0);
    expect(pre.prepaymentEffect.newPayoffMonths).toBeLessThan(pre.totalMonths);
  });

  it("繰上返済なしなら applied=false", () => {
    const r = calculateMortgage(base({ prepayment: 0 }));
    expect(r.prepaymentEffect.applied).toBe(false);
    expect(r.prepaymentEffect.monthsSaved).toBe(0);
  });
});
