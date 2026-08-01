import { describe, expect, it } from "vitest";

import {
  calculateRealEstate,
  type RealEstateInput,
} from "@/lib/calculators/real-estate-yield";

function baseInput(overrides: Partial<RealEstateInput> = {}): RealEstateInput {
  return {
    propertyPrice: 30_000_000,
    annualRent: 2_400_000,
    expenseRate: 20,
    buildingRatio: 70,
    loanAmount: 27_000_000,
    interestRate: 2,
    loanYears: 25,
    structure: "rc",
    ...overrides,
  };
}

describe("calculateRealEstate（利回り・NOI）", () => {
  const r = calculateRealEstate(baseInput());

  it("表面利回り = 家賃 ÷ 物件価格", () => {
    expect(r.grossYield).toBe(8); // 2,400,000 / 30,000,000
  });

  it("NOI と実質利回り", () => {
    expect(r.noi).toBe(1_920_000); // 家賃 − 諸経費20%
    expect(r.netYield).toBeCloseTo(6.4, 5);
  });

  it("建物価格・耐用年数・減価償却費", () => {
    expect(r.buildingValue).toBe(21_000_000); // 70%
    expect(r.usefulLife).toBe(47); // RC造
    expect(r.annualDepreciation).toBeCloseTo(21_000_000 / 47, 1);
  });
});

describe("calculateRealEstate（ローン返済）", () => {
  const r = calculateRealEstate(baseInput());

  it("月々返済額（元利均等・27,000,000円 / 2% / 25年）", () => {
    expect(r.monthlyPayment).toBeGreaterThan(114_000);
    expect(r.monthlyPayment).toBeLessThan(115_000);
  });

  it("年間返済額は月額×12、税引前CF = NOI − 年間返済額", () => {
    expect(r.annualDebtService).toBeCloseTo(r.monthlyPayment * 12, 6);
    expect(r.beforeTaxCashFlow).toBeCloseTo(r.noi - r.annualDebtService, 6);
  });

  it("元金の合計は借入額にほぼ一致（完済）", () => {
    const totalPrincipal = r.schedule.reduce((s, p) => s + p.principal, 0);
    expect(Math.abs(totalPrincipal - 27_000_000)).toBeLessThan(100);
  });

  it("元金返済額は年々増加する（元利均等）", () => {
    const first = r.schedule[0]!.principal;
    const last = r.schedule[r.schedule.length - 1]!.principal;
    expect(last).toBeGreaterThan(first);
  });
});

describe("calculateRealEstate（デッドクロス）", () => {
  it("RC造・25年ローンでは早期にデッドクロス（元金 > 減価償却）", () => {
    const r = calculateRealEstate(baseInput());
    expect(r.deadCrossYear).toBe(1);
  });

  it("木造・長期ローンではデッドクロスが後年になる", () => {
    const r = calculateRealEstate(
      baseInput({ structure: "wood", loanYears: 30 }),
    );
    expect(r.deadCrossYear).not.toBeNull();
    expect(r.deadCrossYear!).toBeGreaterThan(1);
  });

  it("スケジュールは返済年数分", () => {
    const r = calculateRealEstate(baseInput({ loanYears: 20 }));
    expect(r.schedule.length).toBe(20);
  });
});
