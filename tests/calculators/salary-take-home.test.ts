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

  it("社会保険料（本人負担・東京都・標準報酬月額の等級表ベース）", () => {
    // 年収500万→月収41.67万→標準報酬月額41万等級。公式保険料額表と1円一致
    expect(r.socialInsurance).toBe(723_148);
    expect(r.pensionInsurance).toBe(450_180); // 41万×18.3%÷2×12
    expect(r.healthInsurance).toBe(247_968); // 41万×(9.85%+0.23%子育て)÷2×12
    expect(r.employmentInsurance).toBe(25_000); // 年収×0.5%
  });

  it("給与所得（給与所得控除後）", () => {
    expect(r.salaryIncome).toBe(3_560_000);
  });

  it("所得税・住民税", () => {
    expect(r.incomeTax).toBe(130_700);
    expect(r.residentTax).toBe(245_600);
  });

  it("手取りと手取り率（年収500万・東京は約390万・78%）", () => {
    expect(r.netIncome).toBe(3_900_552);
    expect(r.netIncomeRate).toBeCloseTo(78.01, 2);
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
