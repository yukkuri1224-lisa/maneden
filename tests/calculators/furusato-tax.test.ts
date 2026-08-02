import { describe, expect, it } from "vitest";

import {
  calculateFurusato,
  selfPayment,
  type FurusatoInput,
} from "@/lib/calculators/furusato-tax";

function baseInput(overrides: Partial<FurusatoInput> = {}): FurusatoInput {
  return {
    incomeType: "salary",
    income: 5_000_000,
    socialInsurance: 750_000,
    hasSpouse: false,
    dependents: 0,
    ...overrides,
  };
}

describe("calculateFurusato（給与・年収500万・単身）", () => {
  const r = calculateFurusato(baseInput());

  it("給与所得（給与所得控除後）", () => {
    expect(r.totalIncome).toBe(3_560_000); // 500万 − 給与所得控除144万
  });

  it("課税所得（所得税ベース）と限界税率", () => {
    expect(r.taxableIncomeIncomeTax).toBe(2_230_000);
    expect(r.incomeTaxRate).toBe(0.1);
  });

  it("住民税所得割", () => {
    expect(r.taxableIncomeResident).toBe(2_380_000);
    expect(r.residentTaxIncomeLevy).toBe(238_000);
  });

  it("控除上限額の目安（年収500万 独身で約6万円台）", () => {
    expect(r.donationLimit).toBe(61_600);
  });

  it("上限額ちょうどの寄付なら実質負担は2,000円", () => {
    expect(
      selfPayment(r.donationLimit, r.residentTaxIncomeLevy, r.incomeTaxRate),
    ).toBe(2_000);
  });

  it("上限を超えると自己負担が増える", () => {
    const over = selfPayment(
      r.donationLimit + 30_000,
      r.residentTaxIncomeLevy,
      r.incomeTaxRate,
    );
    expect(over).toBeGreaterThan(2_000);
  });
});

describe("calculateFurusato（エッジ・区分）", () => {
  it("所得が低く住民税所得割が0なら上限は0", () => {
    const r = calculateFurusato(baseInput({ income: 1_000_000 }));
    expect(r.donationLimit).toBe(0);
  });

  it("事業所得タイプは入力額をそのまま総所得として扱う", () => {
    const salary = calculateFurusato(baseInput());
    const business = calculateFurusato(
      baseInput({ incomeType: "business", income: 3_560_000 }),
    );
    // 給与所得3,560,000 と 事業所得3,560,000 は同じ上限になる
    expect(business.donationLimit).toBe(salary.donationLimit);
  });

  it("扶養が増えると課税所得が下がり上限も下がる", () => {
    const single = calculateFurusato(baseInput());
    const withDeps = calculateFurusato(baseInput({ dependents: 2 }));
    expect(withDeps.donationLimit).toBeLessThan(single.donationLimit);
  });
});
