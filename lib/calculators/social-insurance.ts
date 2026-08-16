/**
 * 会社員の社会保険料（本人負担）を、都道府県別料率＋標準報酬月額の等級表で計算する。
 * 令和8年度・協会けんぽ 公式保険料額表に「1円一致」する（折半額＝標準報酬月額×料率÷2）。
 *
 * 前提・注意：
 * - 標準報酬月額は「月々の報酬」で決まる。本ツールは年収入力のため、月収 = 年収 ÷ 12 として概算する
 *   （賞与の標準賞与額を分離しない簡易モデル。この前提はUI・免責で明示する）。
 * - 子ども・子育て支援金（令和8年4月〜・0.23%）は健康保険料に併せて徴収され本人も折半で負担するため含める。
 * - 雇用保険は標準報酬ではなく実際の賃金に対して課される（本人・一般の事業＝0.5%）。
 */
import {
  CARE_RATE,
  CHILDCARE_SUPPORT_RATE,
  EMPLOYMENT_EMPLOYEE_RATE,
  getPrefectureRate,
  PENSION_RATE,
  standardHealthRemuneration,
  standardPensionRemuneration,
} from "@/lib/constants/insurance-rates";

export interface SocialInsuranceInput {
  /** 年収（額面・円） */
  annualIncome: number;
  /** 都道府県スラッグ（既定＝東京） */
  prefectureSlug: string;
  /** 40〜64歳（介護保険第2号被保険者）か */
  isOver40: boolean;
}

export interface SocialInsuranceResult {
  /** 健康保険料（本人・年額）。子ども・子育て支援金を含む */
  healthInsurance: number;
  /** うち介護保険料（本人・年額。40〜64歳のみ） */
  careInsurance: number;
  /** 厚生年金保険料（本人・年額） */
  pensionInsurance: number;
  /** 雇用保険料（本人・年額） */
  employmentInsurance: number;
  /** 合計（本人・年額） */
  total: number;
  /** 使用した健康保険の標準報酬月額 */
  standardHealthMonthly: number;
  /** 使用した厚生年金の標準報酬月額 */
  standardPensionMonthly: number;
}

/**
 * 会社員の社会保険料（本人負担・年額）を算出する。
 * 折半額（月額）＝標準報酬月額 × 料率 ÷ 2 を12倍。雇用保険は年収×0.5%。
 */
export function calculateSocialInsurance(
  input: SocialInsuranceInput,
): SocialInsuranceResult {
  const annualIncome = Math.max(0, input.annualIncome);
  const monthly = annualIncome / 12;
  const healthRate = getPrefectureRate(input.prefectureSlug).rate;

  const stdHealth = standardHealthRemuneration(monthly);
  const stdPension = standardPensionRemuneration(monthly);

  // 月額の本人負担（折半）
  const careRateApplied = input.isOver40 ? CARE_RATE : 0;
  const healthMonthly =
    (stdHealth * (healthRate + CHILDCARE_SUPPORT_RATE + careRateApplied)) / 2;
  const careMonthly = (stdHealth * careRateApplied) / 2;
  const pensionMonthly = (stdPension * PENSION_RATE) / 2;

  const healthInsurance = Math.round(healthMonthly * 12);
  const careInsurance = Math.round(careMonthly * 12);
  const pensionInsurance = Math.round(pensionMonthly * 12);
  const employmentInsurance = Math.round(
    annualIncome * EMPLOYMENT_EMPLOYEE_RATE,
  );

  const total = healthInsurance + pensionInsurance + employmentInsurance;

  return {
    healthInsurance,
    careInsurance,
    pensionInsurance,
    employmentInsurance,
    total,
    standardHealthMonthly: stdHealth,
    standardPensionMonthly: stdPension,
  };
}
