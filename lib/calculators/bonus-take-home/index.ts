import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import {
  CARE_RATE,
  CHILDCARE_SUPPORT_RATE,
  DEFAULT_PREFECTURE_SLUG,
  EMPLOYMENT_EMPLOYEE_RATE,
  getPrefectureRate,
  PENSION_RATE,
} from "@/lib/constants/insurance-rates";

import type { BonusTakeHomeInput, BonusTakeHomeResult } from "./types";

/** 厚生年金の標準賞与額（1回あたり）の上限 */
const BONUS_PENSION_CAP = 1_500_000;
/** 健康保険の標準賞与額（年度累計）の上限の目安 */
const BONUS_HEALTH_CAP = 5_730_000;

function floorTo(value: number, unit: number): number {
  if (value <= 0) return 0;
  return Math.floor(value / unit) * unit;
}

/**
 * 給与から控除する本人負担の端数処理（50銭以下切捨て・50銭超切上げ）。
 * 浮動小数点の誤差で 0.5000…01 となるのを避けるため、銭単位に丸めてから判定する。
 */
function roundEmployeeShare(value: number): number {
  if (value <= 0) return 0;
  const sen = Math.round(value * 100);
  const yen = Math.floor(sen / 100);
  return sen % 100 > 50 ? yen + 1 : yen;
}

/**
 * 賞与（ボーナス）の手取りを概算する。
 * 社会保険料は令和8年度の料率（config/rates/reiwa8.json）で計算する。
 * - 健康保険＝標準賞与額 ×（都道府県別の健康保険料率＋子ども・子育て支援金率＋40〜64歳は介護保険料率）÷ 2
 * - 厚生年金＝標準賞与額 × 18.3% ÷ 2
 * - 雇用保険＝賞与額 × 本人負担率（一般の事業）
 * 標準賞与額は1,000円未満切捨て。上限は厚年150万円/回・健保573万円/年度累計（本ツールは1回分のみで判定）。
 * 所得税は「賞与によって増える年間所得税額」を既存の手取りエンジンで求めた概算で、
 * 実際の給与天引き（源泉徴収税額表による額）とは多少異なる。
 */
export function calculateBonusTakeHome(
  input: BonusTakeHomeInput,
): BonusTakeHomeResult {
  const bonus = Math.max(0, input.bonus);
  const prefecture = input.prefecture ?? DEFAULT_PREFECTURE_SLUG;
  const healthRate = getPrefectureRate(prefecture).rate;

  // 社会保険料（標準賞与額 = 1000円未満切捨て）
  const standardBonus = floorTo(bonus, 1000);
  const healthBase = Math.min(standardBonus, BONUS_HEALTH_CAP);
  const pensionBase = Math.min(standardBonus, BONUS_PENSION_CAP);
  const healthTotalRate =
    healthRate + CHILDCARE_SUPPORT_RATE + (input.isOver40 ? CARE_RATE : 0);
  const health = roundEmployeeShare((healthBase * healthTotalRate) / 2);
  const pension = roundEmployeeShare((pensionBase * PENSION_RATE) / 2);
  const employment = roundEmployeeShare(bonus * EMPLOYMENT_EMPLOYEE_RATE);
  const socialInsurance = health + pension + employment;

  // 所得税（源泉）＝ 賞与による年間所得税の増加分
  const annualSalary = Math.max(0, input.monthlySalary) * 12;
  const common = {
    prefecture,
    isOver40: input.isOver40,
    hasSpouse: false,
    dependents: input.dependents,
  };
  const baseTax = calculateSalaryTakeHome({
    income: annualSalary,
    ...common,
  }).incomeTax;
  const withBonusTax = calculateSalaryTakeHome({
    income: annualSalary + bonus,
    ...common,
  }).incomeTax;
  const incomeTax = Math.max(0, withBonusTax - baseTax);

  const totalDeduction = socialInsurance + incomeTax;
  const netBonus = bonus - totalDeduction;
  const netRate = bonus > 0 ? (netBonus / bonus) * 100 : 0;

  return { socialInsurance, incomeTax, totalDeduction, netBonus, netRate };
}

export * from "./types";
