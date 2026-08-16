/**
 * 社会保険の料率・標準報酬月額 等級表（令和8年度）へのアクセサ。
 * 元データは config/rates/reiwa8.json（協会けんぽ 公式保険料額表 由来・検証済み）。
 * 年度更新は JSON の差し替えだけで完結する。
 *
 * 「1円一致」の根拠：折半額 = 標準報酬月額 × 料率 ÷ 2。
 * 令和8年度の公式保険料額表（東京・大阪・沖縄×全50等級×健保/介護込/子育て/厚年＝546件）と
 * 突き合わせ、不一致0・最大差0.0000円を確認済み（tests/calculators/social-insurance.test.ts）。
 */
import rates from "@/config/rates/reiwa8.json";

export interface HealthGrade {
  grade: number;
  standard: number;
  /** 報酬月額の下限（円以上）。null は下限なし（最下等級）。 */
  low: number | null;
  /** 報酬月額の上限（円未満）。null は上限なし（最上等級）。 */
  high: number | null;
}

export interface PrefectureRate {
  name: string;
  slug: string;
  /** 健康保険料率（労使合計） */
  rate: number;
}

export const INSURANCE_FISCAL_YEAR: string = rates._meta.fiscalYear;

export const PREFECTURES: PrefectureRate[] = rates.healthInsurance.prefectures;
export const DEFAULT_PREFECTURE_SLUG = "tokyo";

/** 全国一律の料率（労使合計） */
export const CARE_RATE = rates.careInsurance.rate; // 介護（40〜64歳）
export const PENSION_RATE = rates.pensionInsurance.rate; // 厚生年金
export const CHILDCARE_SUPPORT_RATE = rates.childCareSupport.rate; // 子ども・子育て支援金（令和8〜）
export const EMPLOYMENT_EMPLOYEE_RATE = rates.employmentInsurance.rate; // 雇用（本人・一般の事業）

export const HEALTH_GRADES: HealthGrade[] = rates.standardMonthlyRemuneration
  .healthGrades as HealthGrade[];
export const PENSION_STANDARD_MIN = rates.standardMonthlyRemuneration
  .pensionStandardMin as number;
export const PENSION_STANDARD_MAX = rates.standardMonthlyRemuneration
  .pensionStandardMax as number;

const PREF_BY_SLUG = new Map(PREFECTURES.map((p) => [p.slug, p]));

/** 都道府県スラッグ→料率（未知なら既定＝東京） */
export function getPrefectureRate(slug: string): PrefectureRate {
  return PREF_BY_SLUG.get(slug) ?? PREF_BY_SLUG.get(DEFAULT_PREFECTURE_SLUG)!;
}

/**
 * 報酬月額 → 健康保険の標準報酬月額（等級表ルックアップ）。
 * 等級は昇順。high が null の最上等級が catch-all。
 */
export function standardHealthRemuneration(monthlyIncome: number): number {
  const m = Math.max(0, monthlyIncome);
  for (const g of HEALTH_GRADES) {
    if (g.high === null || m < g.high) return g.standard;
  }
  return HEALTH_GRADES[HEALTH_GRADES.length - 1].standard;
}

/**
 * 報酬月額 → 厚生年金の標準報酬月額。
 * 健康保険の標準報酬月額を [88,000, 650,000] にクランプした値と一致する（公式表で確認済み）。
 */
export function standardPensionRemuneration(monthlyIncome: number): number {
  const h = standardHealthRemuneration(monthlyIncome);
  return Math.min(Math.max(h, PENSION_STANDARD_MIN), PENSION_STANDARD_MAX);
}
