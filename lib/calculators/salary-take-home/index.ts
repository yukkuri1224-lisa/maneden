import {
  basicDeductionIncomeTax,
  residentBasicDeduction,
  residentSalaryIncome,
  salaryIncomeAfterDeduction,
} from "@/lib/calculators/common/salary-income";
import { calculateSocialInsurance } from "@/lib/calculators/social-insurance";
import { DEFAULT_PREFECTURE_SLUG } from "@/lib/constants/insurance-rates";
import { TAX_TABLES } from "@/lib/constants/tax-tables";

import type { SalaryTakeHomeInput, SalaryTakeHomeResult } from "./types";

function clampMin0(value: number): number {
  return value > 0 ? value : 0;
}

function floorTo(value: number, unit: number): number {
  if (value <= 0) return 0;
  return Math.floor(value / unit) * unit;
}

function incomeTaxAmount(taxableIncome: number): number {
  const income = floorTo(taxableIncome, 1000);
  const bracket = TAX_TABLES.incomeTax.brackets.find((b) => income <= b.upTo);
  if (!bracket) return 0;
  return floorTo(income * bracket.rate - bracket.deduction, 1);
}

/**
 * 会社員（給与所得者）の年間手取りを概算する。
 * 社会保険料（健康保険・厚生年金・雇用保険の本人負担）＋所得税・住民税を差し引く。
 * 所得税は令和8年分、住民税はその収入に対する令和9年度分で計算する（lib/constants/tax-years）。
 */
export function calculateSalaryTakeHome(
  input: SalaryTakeHomeInput,
): SalaryTakeHomeResult {
  const it = TAX_TABLES.incomeTax;
  const rt = TAX_TABLES.residentTax;

  const income = Math.max(0, input.income);
  const dependents = Math.max(0, Math.floor(input.dependents));

  // 社会保険料（本人負担）＝都道府県別料率＋標準報酬月額の等級表で計算（公式と1円一致）
  const social = calculateSocialInsurance({
    annualIncome: income,
    prefectureSlug: input.prefecture ?? DEFAULT_PREFECTURE_SLUG,
    isOver40: input.isOver40,
  });
  const healthInsurance = social.healthInsurance;
  const pensionInsurance = social.pensionInsurance;
  const employmentInsurance = social.employmentInsurance;
  const socialInsurance = social.total;

  // 給与所得（所得税＝令和8年分の別表第五、住民税＝令和9年度分。現行はどちらも最低74万円の控除）
  const salaryIncome = salaryIncomeAfterDeduction(income);
  const salaryIncomeResident = residentSalaryIncome(income);

  const spouseIT = input.hasSpouse ? it.spouseDeduction : 0;
  const spouseRT = input.hasSpouse ? rt.spouseDeduction : 0;

  const deductionsIncomeTax =
    basicDeductionIncomeTax(salaryIncome) +
    dependents * it.dependentDeduction +
    spouseIT +
    socialInsurance;
  const deductionsResident =
    residentBasicDeduction() +
    dependents * rt.dependentDeduction +
    spouseRT +
    socialInsurance;

  const taxableIncomeIncomeTax = floorTo(
    clampMin0(salaryIncome - deductionsIncomeTax),
    1000,
  );
  const taxableIncomeResident = floorTo(
    clampMin0(salaryIncomeResident - deductionsResident),
    1000,
  );

  const itBase = incomeTaxAmount(taxableIncomeIncomeTax);
  const reconstruction = floorTo(itBase * it.reconstructionRate, 1);
  const incomeTax = floorTo(itBase + reconstruction, 100);

  const residentLevy = floorTo(taxableIncomeResident * rt.rate, 100);
  const residentPerCapita =
    taxableIncomeResident > 0 ? rt.perCapita + rt.forestTax : 0;
  const residentTax = residentLevy + residentPerCapita;

  const netIncome = income - socialInsurance - incomeTax - residentTax;
  const netIncomeRate = income > 0 ? (netIncome / income) * 100 : 0;

  return {
    salaryIncome,
    socialInsurance,
    healthInsurance,
    pensionInsurance,
    employmentInsurance,
    taxableIncomeIncomeTax,
    taxableIncomeResident,
    incomeTax,
    residentTax,
    netIncome,
    netIncomeRate,
  };
}

export * from "./types";
