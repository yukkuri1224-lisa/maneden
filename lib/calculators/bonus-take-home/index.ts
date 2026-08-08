import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { TAX_TABLES } from "@/lib/constants/tax-tables";

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
 * 賞与（ボーナス）の手取りを概算する。
 * 社会保険料は賞与の上限（厚年150万円/回・健保573万円/年度累計）と本人負担率で計算。
 * 所得税は「賞与によって増える年間所得税額」を既存の手取りエンジンで求めた概算で、
 * 実際の給与天引き（源泉徴収税額表による額）とは多少異なる。
 */
export function calculateBonusTakeHome(
  input: BonusTakeHomeInput,
): BonusTakeHomeResult {
  const bonus = Math.max(0, input.bonus);
  const si = TAX_TABLES.employeeSocialInsurance;

  // 社会保険料（標準賞与額 = 1000円未満切捨て）
  const standardBonus = floorTo(bonus, 1000);
  const healthBase = Math.min(standardBonus, BONUS_HEALTH_CAP);
  const pensionBase = Math.min(standardBonus, BONUS_PENSION_CAP);
  const health =
    healthBase * ((si.healthRate + (input.isOver40 ? si.careRate : 0)) / 2);
  const pension = pensionBase * (si.pensionRate / 2);
  const employment = bonus * si.employmentRate;
  const socialInsurance = Math.round(health + pension + employment);

  // 所得税（源泉）＝ 賞与による年間所得税の増加分
  const annualSalary = Math.max(0, input.monthlySalary) * 12;
  const common = {
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
