import { describe, expect, it } from "vitest";

import {
  basicDeductionIncomeTax,
  residentBasicDeduction,
  residentSalaryIncome,
  salaryIncomeAfterDeduction,
} from "@/lib/calculators/common/salary-income";
import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import {
  CURRENT_INCOME_TAX_YEAR,
  CURRENT_RESIDENT_TAX_FISCAL_YEAR,
} from "@/lib/constants/tax-years";

describe("対象年分・年度", () => {
  it("所得税は令和8年分、住民税は令和9年度分", () => {
    expect(CURRENT_INCOME_TAX_YEAR).toBe(2026);
    expect(CURRENT_RESIDENT_TAX_FISCAL_YEAR).toBe(2027);
  });
});

describe("給与所得（所得税法別表第五・令和8年分）", () => {
  // 国税庁「令和8年分の年末調整等のための給与所得控除後の給与等の金額の表」の行
  it.each([
    [0, 0],
    [740_999, 0],
    [741_000, 1_000],
    [1_500_000, 760_000],
    [2_190_999, 1_450_999],
    [2_191_000, 1_451_000],
    [2_192_999, 1_451_000],
    [2_193_000, 1_453_000],
    [2_195_999, 1_453_000],
    [2_196_000, 1_456_000],
    [2_199_999, 1_456_000],
    [2_200_000, 1_460_000],
    [2_203_999, 1_460_000],
    [3_599_999, 2_437_200], // 3,596,000行: 3,596,000×70% − 80,000
    [3_600_000, 2_440_000],
    [3_603_999, 2_440_000],
    [6_596_000, 4_836_800],
    [6_599_999, 4_836_800],
    [6_600_000, 4_840_000],
    [8_499_999, 6_549_999], // 8,499,999×90% − 1,100,000（1円未満切捨て）
    [8_500_000, 6_550_000],
    [20_000_000, 18_050_000],
  ])("給与等の金額 %i 円 → %i 円", (income, expected) => {
    expect(salaryIncomeAfterDeduction(income)).toBe(expected);
  });

  it("220万〜660万円未満は4,000円刻み（同じ行の中では同じ額）", () => {
    expect(salaryIncomeAfterDeduction(2_624_000)).toBe(
      salaryIncomeAfterDeduction(2_627_999),
    );
    // 浮動小数点の誤差で1円ずれないこと（2,624,000×0.7 は小数計算だと 1,836,799.99…）
    expect(salaryIncomeAfterDeduction(2_624_000)).toBe(1_756_800);
  });

  it("4,000円の倍数の収入では速算式（No.1410の控除額の表）と一致する", () => {
    for (let x = 2_200_000; x < 6_600_000; x += 4_000) {
      const deduction =
        x <= 3_600_000 ? (x * 3) / 10 + 80_000 : (x * 2) / 10 + 440_000;
      expect(salaryIncomeAfterDeduction(x)).toBe(x - deduction);
    }
  });
});

describe("所得税の基礎控除（年分別）", () => {
  it.each([
    [1_320_000, 1_040_000],
    [3_360_000, 1_040_000],
    [4_890_000, 1_040_000],
    [4_890_001, 670_000],
    [6_550_000, 670_000],
    [6_550_001, 620_000],
    [23_500_000, 620_000],
    [23_500_001, 480_000],
    [24_000_000, 480_000],
    [24_000_001, 320_000],
    [24_500_000, 320_000],
    [24_500_001, 160_000],
    [25_000_000, 160_000],
    [25_000_001, 0],
  ])("令和8年分: 合計所得 %i 円 → %i 円", (income, expected) => {
    expect(basicDeductionIncomeTax(income)).toBe(expected);
    expect(basicDeductionIncomeTax(income, 2026)).toBe(expected);
  });

  it("令和9年分は令和8年分と同じ", () => {
    for (const g of [1_000_000, 4_890_001, 6_550_001, 24_000_001]) {
      expect(basicDeductionIncomeTax(g, 2027)).toBe(
        basicDeductionIncomeTax(g, 2026),
      );
    }
  });

  it.each([
    [1_320_000, 950_000],
    [1_320_001, 880_000],
    [3_360_000, 880_000],
    [3_360_001, 680_000],
    [4_890_000, 680_000],
    [4_890_001, 630_000],
    [6_550_000, 630_000],
    [6_550_001, 580_000],
    [23_500_000, 580_000],
    [23_500_001, 480_000],
  ])("令和7年分: 合計所得 %i 円 → %i 円", (income, expected) => {
    expect(basicDeductionIncomeTax(income, 2025)).toBe(expected);
  });

  it.each([
    [1_320_000, 990_000],
    [1_320_001, 620_000],
    [23_500_000, 620_000],
    [23_500_001, 480_000],
  ])("令和10年分以後: 合計所得 %i 円 → %i 円", (income, expected) => {
    expect(basicDeductionIncomeTax(income, 2028)).toBe(expected);
  });
});

describe("住民税（令和9年度分）", () => {
  it("給与所得は最低74万円の控除（所得税の令和8年分と同じ表）", () => {
    expect(residentSalaryIncome(740_999)).toBe(0);
    expect(residentSalaryIncome(1_500_000)).toBe(760_000);
    expect(residentSalaryIncome(5_000_000)).toBe(3_560_000);
  });

  it("基礎控除は43万円のまま", () => {
    expect(residentBasicDeduction()).toBe(430_000);
  });
});

describe("手計算との照合（年収500万円・東京都・扶養なし・40歳未満）", () => {
  const r = calculateSalaryTakeHome({
    income: 5_000_000,
    isOver40: false,
    hasSpouse: false,
    dependents: 0,
  });

  it("給与所得 = 5,000,000×80% − 440,000 = 3,560,000", () => {
    expect(r.salaryIncome).toBe(3_560_000);
  });

  it("所得税: 課税所得1,796,000×5% = 89,800 ＋ 復興税1,885 → 91,600", () => {
    // 3,560,000 − 基礎控除1,040,000 − 社保723,148 = 1,796,852 → 1,796,000
    expect(r.taxableIncomeIncomeTax).toBe(1_796_000);
    expect(r.incomeTax).toBe(91_600);
  });

  it("住民税: 課税所得2,406,000×10% = 240,600 ＋ 均等割等5,000 → 245,600（変化なし）", () => {
    // 3,560,000 − 基礎控除430,000 − 社保723,148 = 2,406,852 → 2,406,000
    expect(r.taxableIncomeResident).toBe(2_406_000);
    expect(r.residentTax).toBe(245_600);
  });
});
