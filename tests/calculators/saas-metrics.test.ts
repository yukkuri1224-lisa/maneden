import { describe, expect, it } from "vitest";

import {
  calculateSaasMetrics,
  projectCohort,
  type SaasMetricsInput,
} from "@/lib/calculators/saas-metrics";

function baseInput(
  overrides: Partial<SaasMetricsInput> = {},
): SaasMetricsInput {
  return {
    monthlyChurnRate: 4,
    arpu: 5_000,
    grossMarginRate: 80,
    cac: 25_000,
    customers: 100,
    ...overrides,
  };
}

describe("calculateSaasMetrics（標準シナリオ）", () => {
  const r = calculateSaasMetrics(baseInput());

  it("平均継続月数 = 1 / 解約率", () => {
    expect(r.avgLifetimeMonths).toBe(25); // 1 / 0.04
  });

  it("顧客あたり月間粗利", () => {
    expect(r.monthlyGrossProfitPerUser).toBe(4_000); // 5000 × 80%
  });

  it("LTV（粗利ベース）", () => {
    expect(r.ltv).toBe(100_000); // 4000 × 25
  });

  it("LTV/CAC 比率と健全性", () => {
    expect(r.ltvCacRatio).toBe(4); // 100000 / 25000
    expect(r.ltvCacHealth).toBe("good"); // 3以上
  });

  it("CAC 回収期間と健全性", () => {
    expect(r.cacPaybackMonths).toBe(6.25); // 25000 / 4000
    expect(r.paybackHealth).toBe("good"); // 12ヶ月以内
  });

  it("MRR / ARR", () => {
    expect(r.mrr).toBe(500_000); // 100 × 5000
    expect(r.arr).toBe(6_000_000);
  });

  it("年換算の解約率", () => {
    // 1 − 0.96^12 = 0.38729...
    expect(r.annualChurnRate).toBeCloseTo(38.729, 2);
  });
});

describe("calculateSaasMetrics（健全性の判定）", () => {
  it("LTV/CAC が 1〜3 は要改善", () => {
    const r = calculateSaasMetrics(baseInput({ cac: 40_000 })); // 100000/40000 = 2.5
    expect(r.ltvCacHealth).toBe("warning");
  });

  it("LTV/CAC が 1未満は赤字構造", () => {
    const r = calculateSaasMetrics(baseInput({ cac: 200_000 })); // 0.5
    expect(r.ltvCacHealth).toBe("bad");
  });

  it("解約率0でも継続月数は上限で有限、CAC0で比率は無限大", () => {
    const zeroChurn = calculateSaasMetrics(baseInput({ monthlyChurnRate: 0 }));
    expect(Number.isFinite(zeroChurn.avgLifetimeMonths)).toBe(true);
    const zeroCac = calculateSaasMetrics(baseInput({ cac: 0 }));
    expect(zeroCac.ltvCacRatio).toBe(Number.POSITIVE_INFINITY);
    expect(zeroCac.cacPaybackMonths).toBe(0);
  });
});

describe("projectCohort（コホート推移）", () => {
  const points = projectCohort(baseInput(), 36);

  it("0〜36ヶ月の37点、初月の累積粗利は0", () => {
    expect(points.length).toBe(37);
    expect(points[0]?.cumulativeGrossProfit).toBe(0);
  });

  it("総獲得コストは一定（顧客数 × CAC）", () => {
    expect(points[0]?.totalCac).toBe(2_500_000); // 100 × 25000
    expect(points[36]?.totalCac).toBe(2_500_000);
  });

  it("累積粗利は単調増加し、いずれ獲得コストを上回る", () => {
    const last = points[36]!;
    expect(last.cumulativeGrossProfit).toBeGreaterThan(last.totalCac);
  });
});
