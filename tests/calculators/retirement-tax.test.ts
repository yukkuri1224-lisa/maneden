import { describe, expect, it } from "vitest";

import {
  calculateRetirementTax,
  retirementDeduction,
} from "@/lib/calculators/retirement-tax";

describe("retirementDeduction（退職所得控除）", () => {
  it("勤続30年 → 1,500万円（800万＋70万×10）", () => {
    expect(retirementDeduction(30)).toBe(15_000_000);
  });
  it("勤続10年 → 400万円 / 最低80万円", () => {
    expect(retirementDeduction(10)).toBe(4_000_000);
    expect(retirementDeduction(1)).toBe(800_000);
  });
  it("勤続年数は1年未満を切り上げる（20.5年→21年）", () => {
    expect(retirementDeduction(20.5)).toBe(8_700_000);
  });
});

describe("calculateRetirementTax", () => {
  it("退職金が控除以下なら非課税（手取り＝退職金）", () => {
    const r = calculateRetirementTax({
      amount: 10_000_000,
      yearsOfService: 30,
      isExecutive: false,
    });
    expect(r.taxableIncome).toBe(0);
    expect(r.totalTax).toBe(0);
    expect(r.netAmount).toBe(10_000_000);
  });

  it("退職金2,000万・勤続30年・非役員", () => {
    const r = calculateRetirementTax({
      amount: 20_000_000,
      yearsOfService: 30,
      isExecutive: false,
    });
    expect(r.deduction).toBe(15_000_000);
    // （2000万 − 1500万）× 1/2 = 250万
    expect(r.taxableIncome).toBe(2_500_000);
    expect(r.residentTax).toBe(250_000);
    expect(r.incomeTax).toBe(155_702);
  });

  it("勤続5年以下の役員は1/2課税なしで課税所得が大きくなる", () => {
    const exec = calculateRetirementTax({
      amount: 10_000_000,
      yearsOfService: 4,
      isExecutive: true,
    });
    const normal = calculateRetirementTax({
      amount: 10_000_000,
      yearsOfService: 4,
      isExecutive: false,
    });
    expect(exec.taxableIncome).toBeGreaterThan(normal.taxableIncome);
  });
});
