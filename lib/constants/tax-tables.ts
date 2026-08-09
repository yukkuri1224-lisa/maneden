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
  /**
   * 会社員の社会保険料（協会けんぽ・全国平均的な概算）。
   * 率は労使合計。本人負担は原則その半分（雇用保険を除く）。標準報酬月額の上限あり。
   */
  employeeSocialInsurance: {
    healthRate: 0.1, // 健康保険料率（労使合計）
    careRate: 0.016, // 介護保険料率（40〜64歳・労使合計）
    pensionRate: 0.183, // 厚生年金保険料率（労使合計）
    employmentRate: 0.006, // 雇用保険（労働者負担・一般の事業）
    healthMonthlyCap: 1_390_000, // 健保の標準報酬月額の上限
    pensionMonthlyCap: 650_000, // 厚年の標準報酬月額の上限
  },
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
  /**
   * 贈与税（暦年課税）。速算表: 税額 = 課税価格 × rate − deduction。
   * 課税価格 = その年の贈与合計 − 基礎控除(110万円)。
   * special=特例贈与財産（直系尊属→18歳以上の子・孫）、general=一般贈与財産（それ以外）。
   */
  giftTax: {
    basicDeduction: 1_100_000,
    general: [
      { upTo: 2_000_000, rate: 0.1, deduction: 0 },
      { upTo: 3_000_000, rate: 0.15, deduction: 100_000 },
      { upTo: 4_000_000, rate: 0.2, deduction: 250_000 },
      { upTo: 6_000_000, rate: 0.3, deduction: 650_000 },
      { upTo: 10_000_000, rate: 0.4, deduction: 1_250_000 },
      { upTo: 15_000_000, rate: 0.45, deduction: 1_750_000 },
      { upTo: 30_000_000, rate: 0.5, deduction: 2_500_000 },
      { upTo: Number.POSITIVE_INFINITY, rate: 0.55, deduction: 4_000_000 },
    ],
    special: [
      { upTo: 2_000_000, rate: 0.1, deduction: 0 },
      { upTo: 4_000_000, rate: 0.15, deduction: 100_000 },
      { upTo: 6_000_000, rate: 0.2, deduction: 300_000 },
      { upTo: 10_000_000, rate: 0.3, deduction: 900_000 },
      { upTo: 15_000_000, rate: 0.4, deduction: 1_900_000 },
      { upTo: 30_000_000, rate: 0.45, deduction: 2_650_000 },
      { upTo: 45_000_000, rate: 0.5, deduction: 4_150_000 },
      { upTo: Number.POSITIVE_INFINITY, rate: 0.55, deduction: 6_400_000 },
    ],
  },
  /**
   * 相続税。基礎控除 = 3,000万円 + 600万円 × 法定相続人の数。
   * 速算表は「法定相続分に応ずる各人の取得金額」に対して 税額 = 取得金額 × rate − deduction。
   * spouseReliefFloor=配偶者の税額軽減の下限（1.6億円。法定相続分と比べて多い方まで非課税）。
   */
  inheritanceTax: {
    basicDeductionFixed: 30_000_000,
    basicDeductionPerHeir: 6_000_000,
    spouseReliefFloor: 160_000_000,
    brackets: [
      { upTo: 10_000_000, rate: 0.1, deduction: 0 },
      { upTo: 30_000_000, rate: 0.15, deduction: 500_000 },
      { upTo: 50_000_000, rate: 0.2, deduction: 2_000_000 },
      { upTo: 100_000_000, rate: 0.3, deduction: 7_000_000 },
      { upTo: 200_000_000, rate: 0.4, deduction: 17_000_000 },
      { upTo: 300_000_000, rate: 0.45, deduction: 27_000_000 },
      { upTo: 600_000_000, rate: 0.5, deduction: 42_000_000 },
      { upTo: Number.POSITIVE_INFINITY, rate: 0.55, deduction: 72_000_000 },
    ],
  },
} as const;
