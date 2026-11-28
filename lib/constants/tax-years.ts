/**
 * 年分（所得税）・年度（住民税）ごとの控除額テーブル。
 *
 * 令和7年度税制改正（2025年）と令和8年度税制改正（2026年3月31日成立、
 * 2026年12月1日施行）で、基礎控除と給与所得控除が年分ごとに変わるため、
 * 値を年分ごとに分けて持つ。計算コードはここを唯一の情報源とする。
 *
 * - 所得税は「年分」（その年1〜12月の所得）で区切る。
 * - 住民税は「年度」（前年の所得に対して翌年6月から課税）で区切る。
 *   例: 2026年（令和8年）の収入 → 所得税は令和8年分、住民税は令和9年度分。
 *
 * 出典（確認日: 2026年11月27日）
 * - 国税庁 No.1199 基礎控除: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
 * - 国税庁 No.1410 給与所得控除: https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
 * - 国税庁 令和8年分 年末調整のしかた（給与所得控除後の給与等の金額の表＝所得税法別表第五）:
 *   https://www.nta.go.jp/publication/pamph/gensen/nencho2026/01.htm
 *   https://www.nta.go.jp/publication/pamph/gensen/nencho2026/pdf/114.pdf
 * - 財務省 令和8年度税制改正の大綱の概要: https://www.mof.go.jp/tax_policy/tax_reform/outline/fy2026/08taikou_gaiyou.pdf
 */

/** 所得税の年分（西暦）。2028 は「令和10年分以後」を表す。 */
export type IncomeTaxYear = 2025 | 2026 | 2027 | 2028;

/** 給与所得の表（別表第五）を実装済みの年分 */
export type SalaryIncomeTableYear = 2026 | 2027;

/** ツールが計算対象とする所得税の年分（令和8年分＝2026年1〜12月の収入） */
export const CURRENT_INCOME_TAX_YEAR = 2026 satisfies SalaryIncomeTableYear;

/** 上の年分の収入に対して課される住民税の年度（令和9年度分＝2027年6月から納付） */
export const CURRENT_RESIDENT_TAX_FISCAL_YEAR = 2027;

/** 令和8年度税制改正の施行日（基礎控除・給与所得控除の引き上げ） */
export const R8_REFORM_EFFECTIVE_DATE = "2026-12-01";

/** 西暦 → 令和 */
export function toReiwa(year: number): number {
  return year - 2018;
}

interface Bracket {
  /** 合計所得金額がこの金額以下なら amount を適用 */
  upTo: number;
  amount: number;
}

/**
 * 所得税の基礎控除（合計所得金額に応じた額）。単位: 円。
 * 令和7年分: 令和7年度改正（58万円＋低所得者への加算）。
 * 令和8・9年分: 令和8年度改正（62万円、489万円以下は104万円 等）。
 * 令和10年分以後: 令和8年度改正後の恒久分。
 */
export const BASIC_DEDUCTION_INCOME_TAX: Record<IncomeTaxYear, Bracket[]> = {
  2025: [
    { upTo: 1_320_000, amount: 950_000 },
    { upTo: 3_360_000, amount: 880_000 },
    { upTo: 4_890_000, amount: 680_000 },
    { upTo: 6_550_000, amount: 630_000 },
    { upTo: 23_500_000, amount: 580_000 },
    { upTo: 24_000_000, amount: 480_000 },
    { upTo: 24_500_000, amount: 320_000 },
    { upTo: 25_000_000, amount: 160_000 },
  ],
  2026: [
    { upTo: 4_890_000, amount: 1_040_000 },
    { upTo: 6_550_000, amount: 670_000 },
    { upTo: 23_500_000, amount: 620_000 },
    { upTo: 24_000_000, amount: 480_000 },
    { upTo: 24_500_000, amount: 320_000 },
    { upTo: 25_000_000, amount: 160_000 },
  ],
  2027: [
    { upTo: 4_890_000, amount: 1_040_000 },
    { upTo: 6_550_000, amount: 670_000 },
    { upTo: 23_500_000, amount: 620_000 },
    { upTo: 24_000_000, amount: 480_000 },
    { upTo: 24_500_000, amount: 320_000 },
    { upTo: 25_000_000, amount: 160_000 },
  ],
  2028: [
    { upTo: 1_320_000, amount: 990_000 },
    { upTo: 23_500_000, amount: 620_000 },
    { upTo: 24_000_000, amount: 480_000 },
    { upTo: 24_500_000, amount: 320_000 },
    { upTo: 25_000_000, amount: 160_000 },
  ],
};

/**
 * 住民税（年度ごと）の控除の前提。
 * 令和9年度分（2026年の収入が対象）: 給与所得控除の最低額は74万円
 * （69万円＋令和9・10年度の特例5万円）で、所得税の令和8年分と同じ表を使う。
 * 基礎控除は43万円のまま（合計所得2,400万円以下）。
 * 出典: 内閣府 税制調査会資料 https://www.cao.go.jp/zei-cho/content/8life4kai2.pdf
 */
export const RESIDENT_TAX_YEARS = {
  2027: {
    /** 給与所得の計算に使う所得税の年分の表 */
    salaryIncomeTableYear: 2026 as SalaryIncomeTableYear,
    basicDeduction: 430_000,
  },
} as const;

export type ResidentTaxFiscalYear = keyof typeof RESIDENT_TAX_YEARS;
