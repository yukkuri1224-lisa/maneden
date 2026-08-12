import { describe, expect, it } from "vitest";

import {
  calculateFurusato,
  selfPayment,
  type FurusatoInput,
} from "@/lib/calculators/furusato-tax";
import {
  buildFurusatoTable,
  FURUSATO_TABLE_COLUMNS,
  FURUSATO_TABLE_INCOMES,
} from "@/lib/calculators/furusato-tax/reference";

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

describe("ふるさと納税 早見表（buildFurusatoTable）", () => {
  const rows = buildFurusatoTable();

  it("年収行の数だけ行が生成される", () => {
    expect(rows.length).toBe(FURUSATO_TABLE_INCOMES.length);
  });

  it("各行はカラム数と同じ数の上限額を持つ", () => {
    for (const row of rows) {
      expect(row.limits.length).toBe(FURUSATO_TABLE_COLUMNS.length);
    }
  });

  it("年収500万・独身（社保15%概算）は約6万円台", () => {
    const row = rows.find((r) => r.income === 5_000_000)!;
    // 社保750,000＝年収の15%。単体テストの前提と一致し 61,600 になる
    expect(row.limits[0]).toBe(61_600);
  });

  it("同じ年収では扶養が増えるほど上限は下がる（独身 ≥ 夫婦＋子）", () => {
    const row = rows.find((r) => r.income === 7_000_000)!;
    expect(row.limits[0]).toBeGreaterThanOrEqual(row.limits[3]);
  });

  it("年収が上がるほど独身の上限は単調に増える", () => {
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].limits[0]).toBeGreaterThanOrEqual(rows[i - 1].limits[0]);
    }
  });
});
