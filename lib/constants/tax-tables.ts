/**
 * 年度別 税率・控除テーブル（2026年度＝令和8年度 想定の概算値）。
 *
 * 注意:
 * - 税制は毎年改定される。ここの値はすべて「概算」であり、最新の公式値を要確認。
 * - 所得税の基礎控除は2025年度税制改正の58万円を反映。低所得層の時限的加算・高所得の逓減詳細、住民税の調整控除は簡略化/未反映。
 * - 国民健康保険・住民税均等割は自治体差が大きく、ここでは全国平均的な単身世帯モデルを採用。
 *
 * 税額計算のロジックはこのテーブルを唯一の情報源とし、UI/計算コードに数値を直書きしない。
 */
export const TAX_YEAR = 2026;

export const TAX_TABLES = {
  incomeTax: {
    /** 所得税の速算表（2015年分以降・据え置き）。税額 = 課税所得 × rate − deduction */
    brackets: [
      { upTo: 1_949_000, rate: 0.05, deduction: 0 },
      { upTo: 3_299_000, rate: 0.1, deduction: 97_500 },
      { upTo: 6_949_000, rate: 0.2, deduction: 427_500 },
      { upTo: 8_999_000, rate: 0.23, deduction: 636_000 },
      { upTo: 17_999_000, rate: 0.33, deduction: 1_536_000 },
      { upTo: 39_999_000, rate: 0.4, deduction: 2_796_000 },
      { upTo: Number.POSITIVE_INFINITY, rate: 0.45, deduction: 4_796_000 },
    ],
    /** 基礎控除（2025年度改正で58万円。合計所得2400万円超は逓減。低所得層の時限的加算は簡略化） */
    basicDeduction: { base: 580_000, tier1: 320_000, tier2: 160_000 },
    /** 一般扶養控除（概算・16歳以上） */
    dependentDeduction: 380_000,
    /** 配偶者控除（納税者の所得900万円以下・概算） */
    spouseDeduction: 380_000,
    /** 復興特別所得税率（所得税額 × 2.1%、2037年まで） */
    reconstructionRate: 0.021,
  },
  residentTax: {
    /** 所得割（都道府県4% ＋ 市区町村6%） */
    rate: 0.1,
    /** 均等割（市町村3,000＋道府県1,000＝標準額4,000円。2024年度〜） */
    perCapita: 4_000,
    /** 森林環境税（均等割と併せて徴収・年1,000円） */
    forestTax: 1_000,
    basicDeduction: 430_000,
    dependentDeduction: 330_000,
    spouseDeduction: 330_000,
  },
  /**
   * 国民健康保険（単身世帯・全国平均的な概算モデル）。
   * 賦課基準額 = 総所得金額等 − basisDeduction。
   * 各区分ごとに（賦課基準額 × rate ＋ 均等割）を上限（cap）まで課す。
   */
  nationalHealthInsurance: {
    basisDeduction: 430_000,
    medical: { rate: 0.075, perCapita: 45_000, cap: 660_000 },
    support: { rate: 0.026, perCapita: 15_000, cap: 260_000 },
    /** 介護分（40〜64歳のみ） */
    longTermCare: { rate: 0.02, perCapita: 16_000, cap: 170_000 },
  },
  /** 国民年金保険料（2026年度想定・年額の概算） */
  nationalPension: { annual: 210_000 },
  consumptionTax: {
    /** 標準税率 */
    standardRate: 0.1,
    /** 2割特例（売上税額の20%を納付） */
    specialRate: 0.2,
    /** 簡易課税のみなし仕入率（第1種〜第6種） */
    deemedPurchaseRates: {
      1: 0.9,
      2: 0.8,
      3: 0.7,
      4: 0.6,
      5: 0.5,
      6: 0.4,
    },
  },
} as const;
