import { describe, expect, it } from "vitest";

import {
  calculateSalaryTakeHome,
  type SalaryTakeHomeInput,
} from "@/lib/calculators/salary-take-home";

function baseInput(
  overrides: Partial<SalaryTakeHomeInput> = {},
): SalaryTakeHomeInput {
  return {
    income: 5_000_000,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
    ...overrides,
  };
}

describe("calculateSalaryTakeHome（年収500万・単身・40歳未満）", () => {
  const r = calculateSalaryTakeHome(baseInput());

  it("社会保険料（本人負担・約14.75%）", () => {
    expect(r.socialInsurance).toBe(737_500);
    expect(r.pensionInsurance).toBe(457_500); // 厚生年金 9.15%
    expect(r.healthInsurance).toBe(250_000); // 健保 5%
    expect(r.employmentInsurance).toBe(30_000); // 雇用 0.6%
  });

  it("給与所得（給与所得控除後）", () => {
    expect(r.salaryIncome).toBe(3_560_000);
  });

  it("所得税・住民税", () => {
    expect(r.incomeTax).toBe(129_300);
    expect(r.residentTax).toBe(244_200);
  });

  it("手取りと手取り率（年収500万は約389万・78%）", () => {
    expect(r.netIncome).toBe(3_889_000);
    expect(r.netIncomeRate).toBeCloseTo(77.78, 2);
  });
});

describe("calculateSalaryTakeHome（バリエーション）", () => {
  it("40歳以上は介護保険で社会保険料が増える", () => {
    const under = calculateSalaryTakeHome(baseInput());
    const over = calculateSalaryTakeHome(baseInput({ isOver40: true }));
    expect(over.socialInsurance).toBeGreaterThan(under.socialInsurance);
  });

  it("扶養が増えると所得税が下がる", () => {
    const single = calculateSalaryTakeHome(baseInput());
    const withDeps = calculateSalaryTakeHome(baseInput({ dependents: 2 }));
    expect(withDeps.incomeTax).toBeLessThan(single.incomeTax);
  });

  it("高年収では厚生年金の上限（標準報酬月額65万）が効く", () => {
    // 年収2000万でも厚年は月65万上限ベースなので、率どおりには増えない
    const r = calculateSalaryTakeHome(baseInput({ income: 20_000_000 }));
    // 厚生年金の本人負担 = 65万 × 12 × 18.3% ÷ 2 = 713,700
    expect(r.pensionInsurance).toBe(713_700);
  });

  it("手取りは年収を超えない・正の値", () => {
    const r = calculateSalaryTakeHome(baseInput({ income: 3_000_000 }));
    expect(r.netIncome).toBeGreaterThan(0);
    expect(r.netIncome).toBeLessThan(3_000_000);
  });
});
