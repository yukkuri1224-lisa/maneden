/**
 * 全国の平均給与（国税庁「民間給与実態統計調査」）。
 * 企業の平均年収を全国平均と比較するための基準値。
 * 最新の公表値に合わせて value / year を更新すること。
 */
export const NATIONAL_AVERAGE_SALARY = {
  /** 平均給与（円）。令和5年分＝約460万円 */
  value: 4_600_000,
  /** 対象年（公表区分） */
  year: "令和5年分",
  source: "国税庁「民間給与実態統計調査」",
  sourceUrl:
    "https://www.nta.go.jp/publication/statistics/kokuzeicho/minkan/top.htm",
} as const;
