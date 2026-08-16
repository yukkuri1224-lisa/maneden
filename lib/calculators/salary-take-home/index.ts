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

/** 給与所得控除（2020年分以降の標準式） */
function salaryIncomeDeduction(salary: number): number {
  if (salary <= 1_625_000) return 550_000;
  if (salary <= 1_800_000) return salary * 0.4 - 100_000;
  if (salary <= 3_600_000) return salary * 0.3 + 80_000;
  if (salary <= 6_600_000) return salary * 0.2 + 440_000;
  if (salary <= 8_500_000) return salary * 0.1 + 1_100_000;
  return 1_950_000;
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

  // 給与所得
  const salaryIncome = clampMin0(income - salaryIncomeDeduction(income));

  const spouseIT = input.hasSpouse ? it.spouseDeduction : 0;
  const spouseRT = input.hasSpouse ? rt.spouseDeduction : 0;

  const deductionsIncomeTax =
    it.basicDeduction.base +
    dependents * it.dependentDeduction +
    spouseIT +
    socialInsurance;
  const deductionsResident =
    rt.basicDeduction +
    dependents * rt.dependentDeduction +
    spouseRT +
    socialInsurance;

  const taxableIncomeIncomeTax = floorTo(
    clampMin0(salaryIncome - deductionsIncomeTax),
    1000,
  );
  const taxableIncomeResident = floorTo(
    clampMin0(salaryIncome - deductionsResident),
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
