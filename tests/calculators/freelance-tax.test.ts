import { describe, expect, it } from "vitest";

import {
  calculateFreelanceTax,
  type FreelanceTaxInput,
} from "@/lib/calculators/freelance-tax";
import { consumptionTax } from "@/lib/calculators/freelance-tax/consumptionTax";
import {
  incomeTaxBase,
  reconstructionTax,
} from "@/lib/calculators/freelance-tax/incomeTax";

/** 標準的な入力（テスト用ベース） */
function baseInput(
  overrides: Partial<FreelanceTaxInput> = {},
): FreelanceTaxInput {
  return {
    revenue: 5_000_000,
    expenses: 1_000_000,
    blueReturnDeduction: 650_000,
    dependents: 0,
    hasSpouse: false,
    spouseIncome: 0,
    invoiceStatus: "exempt",
    businessCategory: 5,
    isOver40: false,
    ...overrides,
  };
}

describe("incomeTaxBase（所得税速算表）", () => {
  it("最下段（5%）の境界", () => {
    expect(incomeTaxBase(1_949_000)).toBe(97_450); // 1,949,000 × 5%
  });

  it("10% ブラケットに入る境界", () => {
    // 1,950,000 × 10% − 97,500 = 97,500
    expect(incomeTaxBase(1_950_000)).toBe(97_500);
  });

  it("20% ブラケット", () => {
    // 5,000,000 × 20% − 427,500 = 572,500
    expect(incomeTaxBase(5_000_000)).toBe(572_500);
  });

  it("課税所得0は0", () => {
    expect(incomeTaxBase(0)).toBe(0);
  });

  it("1000円未満は切り捨てて計算する", () => {
    expect(incomeTaxBase(1_949_999)).toBe(97_450);
  });
});

describe("reconstructionTax（復興特別所得税）", () => {
  it("所得税額 × 2.1% を切り捨て", () => {
    expect(reconstructionTax(133_000)).toBe(2_793);
  });
});

describe("consumptionTax（インボイス区分）", () => {
  const revenue = 5_000_000;
  const expenses = 1_000_000;

  it("免税は0", () => {
    expect(consumptionTax(revenue, expenses, "exempt", 5)).toBe(0);
  });

  it("2割特例＝売上税額 × 20%（百円未満切り捨て）", () => {
    // 売上税額 = 5,000,000 × 10/110 = 454,545.45 → ×20% = 90,909 → 90,900
    expect(consumptionTax(revenue, expenses, "simplified-2wari", 5)).toBe(
      90_900,
    );
  });

  it("簡易課税（第5種・みなし50%）", () => {
    // 454,545.45 × (1 − 0.5) = 227,272 → 227,200
    expect(consumptionTax(revenue, expenses, "simplified", 5)).toBe(227_200);
  });

  it("本則課税（経費を全額課税仕入とみなす概算）", () => {
    // 売上税額454,545.45 − 仕入税額90,909.09 = 363,636 → 363,600
    expect(consumptionTax(revenue, expenses, "general", 5)).toBe(363_600);
  });
});

describe("calculateFreelanceTax（統合・標準シナリオ）", () => {
  const result = calculateFreelanceTax(baseInput());

  it("事業所得＝売上−経費−青色控除", () => {
    expect(result.businessIncome).toBe(3_350_000);
  });

  it("国民健康保険（40歳未満・単身概算）", () => {
    expect(result.nationalHealthInsurance).toBe(354_900);
  });

  it("国民年金は年額固定の概算", () => {
    expect(result.nationalPension).toBe(210_000);
  });

  it("課税所得（所得税ベース）", () => {
    expect(result.taxableIncome).toBe(2_305_000);
  });

  it("所得税（復興特別所得税込み）", () => {
    expect(result.incomeTax).toBe(135_700);
  });

  it("住民税（所得割＋均等割＋森林環境税）", () => {
    expect(result.residentTax).toBe(241_500);
  });

  it("免税なので消費税は0、登録時の負担額を invoiceImpact に持つ", () => {
    expect(result.consumptionTax).toBe(0);
    expect(result.invoiceImpact).toBe(90_900);
  });

  it("負担合計・手取り・手取り率", () => {
    expect(result.totalBurden).toBe(942_100);
    expect(result.netIncome).toBe(3_057_900);
    expect(result.netIncomeRate).toBeCloseTo(61.158, 2);
  });
});

describe("calculateFreelanceTax（エッジケース）", () => {
  it("低所得では所得税・住民税が発生しない", () => {
    const result = calculateFreelanceTax(
      baseInput({ revenue: 1_000_000, expenses: 0 }),
    );
    expect(result.taxableIncome).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.residentTax).toBe(0);
    expect(result.netIncome).toBeGreaterThan(0);
  });

  it("課税事業者（2割特例）を選ぶと手取りが消費税分だけ減る", () => {
    const exempt = calculateFreelanceTax(baseInput());
    const taxable = calculateFreelanceTax(
      baseInput({ invoiceStatus: "simplified-2wari" }),
    );
    expect(taxable.consumptionTax).toBe(90_900);
    expect(exempt.netIncome - taxable.netIncome).toBe(90_900);
  });

  it("扶養が増えると課税所得が減り所得税が下がる", () => {
    const noDep = calculateFreelanceTax(baseInput());
    const withDep = calculateFreelanceTax(baseInput({ dependents: 2 }));
    expect(withDep.taxableIncome).toBeLessThan(noDep.taxableIncome);
    expect(withDep.incomeTax).toBeLessThan(noDep.incomeTax);
  });

  it("経費が売上を上回っても負値にならない", () => {
    const result = calculateFreelanceTax(
      baseInput({ revenue: 2_000_000, expenses: 3_000_000 }),
    );
    expect(result.businessIncome).toBe(0);
    expect(result.taxableIncome).toBe(0);
    expect(result.incomeTax).toBe(0);
  });
});
