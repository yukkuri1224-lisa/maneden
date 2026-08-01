export interface SaasMetricsInput {
  /** 月次解約率（%） */
  monthlyChurnRate: number;
  /** 顧客あたり月間売上 ARPU（円） */
  arpu: number;
  /** 粗利率（%） */
  grossMarginRate: number;
  /** 顧客獲得コスト CAC（円） */
  cac: number;
  /** 現在の顧客数（MRR/ARR とコホート推移の算定用） */
  customers: number;
}

export type HealthLevel = "good" | "warning" | "bad";

export interface SaasMetricsResult {
  /** 平均継続月数 = 1 / 月次解約率 */
  avgLifetimeMonths: number;
  /** 顧客生涯価値 LTV（粗利ベース） */
  ltv: number;
  /** LTV / CAC 比率（3以上が健全の目安） */
  ltvCacRatio: number;
  /** CAC 回収期間（月・12ヶ月以内が目安） */
  cacPaybackMonths: number;
  /** 月間経常収益 MRR */
  mrr: number;
  /** 年間経常収益 ARR */
  arr: number;
  /** 年換算の解約率（%） */
  annualChurnRate: number;
  /** 顧客あたり月間粗利 */
  monthlyGrossProfitPerUser: number;
  /** LTV/CAC の健全性 */
  ltvCacHealth: HealthLevel;
  /** 回収期間の健全性 */
  paybackHealth: HealthLevel;
}

export interface CohortPoint {
  /** 経過月数 */
  month: number;
  /** コホートからの累積粗利 */
  cumulativeGrossProfit: number;
  /** 総獲得コスト（顧客数 × CAC・一定） */
  totalCac: number;
}
