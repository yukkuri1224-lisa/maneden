import { TAX_TABLES } from "@/lib/constants/tax-tables";

import type { FurusatoInput, FurusatoResult } from "./types";

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

/** 所得税の限界税率（課税所得が属するブラケットの税率） */
function marginalIncomeTaxRate(taxableIncome: number): number {
  const income = floorTo(taxableIncome, 1000);
  const bracket = TAX_TABLES.incomeTax.brackets.find((b) => income <= b.upTo);
  return bracket ? bracket.rate : 0;
}

/**
 * ふるさと納税の控除上限額（目安）を算出する。
 *
 * 控除上限額 ≒ 住民税所得割額 × 20% ÷ (90% − 所得税率 × 1.021) + 2,000
 * （住民税の特例控除が「所得割の20%」の上限に達する寄付額）
 */
export function calculateFurusato(input: FurusatoInput): FurusatoResult {
  const it = TAX_TABLES.incomeTax;
  const rt = TAX_TABLES.residentTax;

  const income = Math.max(0, input.income);
  const socialInsurance = Math.max(0, input.socialInsurance);
  const dependents = Math.max(0, Math.floor(input.dependents));

  // 総所得（給与→給与所得、事業→事業所得そのまま）
  const totalIncome =
    input.incomeType === "salary"
      ? clampMin0(income - salaryIncomeDeduction(income))
      : income;

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
    clampMin0(totalIncome - deductionsIncomeTax),
    1000,
  );
  const taxableIncomeResident = floorTo(
    clampMin0(totalIncome - deductionsResident),
    1000,
  );

  const incomeTaxRate = marginalIncomeTaxRate(taxableIncomeIncomeTax);
  const residentTaxIncomeLevy = Math.floor(taxableIncomeResident * rt.rate);

  const denominator = 0.9 - incomeTaxRate * 1.021;
  const rawLimit =
    residentTaxIncomeLevy > 0
      ? (residentTaxIncomeLevy * 0.2) / denominator + 2000
      : 0;

  return {
    totalIncome,
    taxableIncomeIncomeTax,
    taxableIncomeResident,
    residentTaxIncomeLevy,
    incomeTaxRate,
    donationLimit: floorTo(rawLimit, 100),
  };
}

/**
 * 指定した寄付額に対する実質自己負担額。
 * 上限額までは 2,000 円で一定、超えると自己負担が増えていく。
 */
export function selfPayment(
  donation: number,
  residentTaxIncomeLevy: number,
  incomeTaxRate: number,
): number {
  if (donation <= 2000) return donation;
  const base = donation - 2000;
  const incomeTaxCredit = base * incomeTaxRate * 1.021;
  const residentBasic = base * 0.1;
  const residentSpecial = Math.min(
    base * (0.9 - incomeTaxRate * 1.021),
    residentTaxIncomeLevy * 0.2,
  );
  return Math.round(
    donation - (incomeTaxCredit + residentBasic + residentSpecial),
  );
}

export * from "./types";
