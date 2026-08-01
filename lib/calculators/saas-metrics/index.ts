import type {
  CohortPoint,
  HealthLevel,
  SaasMetricsInput,
  SaasMetricsResult,
} from "./types";

/** 解約率0のときに継続月数が無限大になるのを防ぐ上限 */
const MAX_LIFETIME_MONTHS = 600;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * SaaS の主要指標（LTV・LTV/CAC・回収期間・MRR/ARR 等）を算出する。
 */
export function calculateSaasMetrics(
  input: SaasMetricsInput,
): SaasMetricsResult {
  const churn = clamp(input.monthlyChurnRate / 100, 0, 1);
  const grossMargin = clamp(input.grossMarginRate / 100, 0, 1);
  const arpu = Math.max(0, input.arpu);
  const cac = Math.max(0, input.cac);
  const customers = Math.max(0, input.customers);

  const avgLifetimeMonths =
    churn > 0 ? Math.min(1 / churn, MAX_LIFETIME_MONTHS) : MAX_LIFETIME_MONTHS;
  const monthlyGrossProfitPerUser = arpu * grossMargin;
  const ltv = monthlyGrossProfitPerUser * avgLifetimeMonths;

  const ltvCacRatio = cac > 0 ? ltv / cac : Number.POSITIVE_INFINITY;
  const cacPaybackMonths =
    monthlyGrossProfitPerUser > 0
      ? cac / monthlyGrossProfitPerUser
      : Number.POSITIVE_INFINITY;

  const mrr = customers * arpu;
  const arr = mrr * 12;
  const annualChurnRate = (1 - Math.pow(1 - churn, 12)) * 100;

  const ltvCacHealth: HealthLevel =
    ltvCacRatio >= 3 ? "good" : ltvCacRatio >= 1 ? "warning" : "bad";
  const paybackHealth: HealthLevel =
    cacPaybackMonths <= 12
      ? "good"
      : cacPaybackMonths <= 18
        ? "warning"
        : "bad";

  return {
    avgLifetimeMonths,
    ltv,
    ltvCacRatio,
    cacPaybackMonths,
    mrr,
    arr,
    annualChurnRate,
    monthlyGrossProfitPerUser,
    ltvCacHealth,
    paybackHealth,
  };
}

/**
 * 1つのコホート（顧客数分）の累積粗利の推移を月次で算出する。
 * 総獲得コスト（一定）との交差が CAC 回収時点の目安になる。
 */
export function projectCohort(
  input: SaasMetricsInput,
  months = 36,
): CohortPoint[] {
  const churn = clamp(input.monthlyChurnRate / 100, 0, 1);
  const grossMargin = clamp(input.grossMarginRate / 100, 0, 1);
  const arpu = Math.max(0, input.arpu);
  const customers = Math.max(0, input.customers);
  const totalCac = customers * Math.max(0, input.cac);

  const points: CohortPoint[] = [];
  let cumulative = 0;
  for (let month = 0; month <= months; month++) {
    if (month >= 1) {
      const retained = customers * Math.pow(1 - churn, month);
      cumulative += retained * arpu * grossMargin;
    }
    points.push({ month, cumulativeGrossProfit: cumulative, totalCac });
  }
  return points;
}

export * from "./types";
