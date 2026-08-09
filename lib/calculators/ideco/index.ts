import { calculateSalaryTakeHome } from "@/lib/calculators/salary-take-home";
import { TAX_TABLES } from "@/lib/constants/tax-tables";

import type { IdecoCategory, IdecoInput, IdecoResult } from "./types";

/**
 * 加入区分ごとの iDeCo 毎月の掛金上限（円）。本ツールは給与所得者（会社員・公務員）を対象とする。
 * （自営業＝第1号や専業主婦＝第3号は所得の計算方法が異なるため対象外）
 */
export const IDECO_MONTHLY_CAPS: Record<IdecoCategory, number> = {
  "company-no-pension": 23_000,
  "company-dc": 20_000,
  "company-db": 12_000,
};

const RETIREMENT_AGE = 60;

function floorTo(value: number, unit: number): number {
  if (value <= 0) return 0;
  return Math.floor(value / unit) * unit;
}

/** 課税所得に対する所得税額（速算表・復興特別所得税は含まない）。 */
function incomeTaxAmount(taxableIncome: number): number {
  const income = floorTo(taxableIncome, 1000);
  const bracket = TAX_TABLES.incomeTax.brackets.find((b) => income <= b.upTo);
  if (!bracket) return 0;
  return floorTo(income * bracket.rate - bracket.deduction, 1);
}

/** 課税所得に対応する所得税の限界税率（0〜0.45）。 */
function marginalRate(taxableIncome: number): number {
  const income = floorTo(taxableIncome, 1000);
  const bracket = TAX_TABLES.incomeTax.brackets.find((b) => income <= b.upTo);
  return bracket ? bracket.rate : 0;
}

/**
 * iDeCo（個人型確定拠出年金）の掛金による年間・累計の節税額を概算する。
 *
 * iDeCo の掛金は全額が「小規模企業共済等掛金控除」として所得控除になるため、
 * 課税所得が掛金の分だけ下がり、所得税（＋復興特別所得税）と住民税（概ね一律10%）が軽くなる。
 * 対象は給与所得者（会社員・公務員）。配偶者控除・扶養控除等は考慮しない標準ケースの概算。
 */
export function calculateIdeco(input: IdecoInput): IdecoResult {
  const income = Math.max(0, input.income);
  const age = Math.max(0, Math.floor(input.age));

  const monthlyCap = IDECO_MONTHLY_CAPS[input.category];
  const appliedMonthlyContribution = Math.min(
    Math.max(0, input.monthlyContribution),
    monthlyCap,
  );
  const annualContribution = appliedMonthlyContribution * 12;

  // 標準的な給与所得者として課税所得を求める（介護保険の有無は年齢から判定）。
  const base = calculateSalaryTakeHome({
    income,
    isOver40: age >= 40,
    hasSpouse: false,
    dependents: 0,
  });

  const taxableIT = base.taxableIncomeIncomeTax;
  const taxableRT = base.taxableIncomeResident;

  // 所得税：掛金の分だけ課税所得が下がる差額（復興特別所得税 2.1% を上乗せ）。
  const deltaBase =
    incomeTaxAmount(taxableIT) -
    incomeTaxAmount(Math.max(0, taxableIT - annualContribution));
  const incomeTaxSaved = Math.round(
    deltaBase * (1 + TAX_TABLES.incomeTax.reconstructionRate),
  );

  // 住民税：掛金の分 × 10%（課税所得を超えない範囲）。
  const residentBaseReduction = Math.min(annualContribution, taxableRT);
  const residentTaxSaved = Math.round(
    residentBaseReduction * TAX_TABLES.residentTax.rate,
  );

  const annualTaxSaved = incomeTaxSaved + residentTaxSaved;
  const savingRate =
    annualContribution > 0 ? (annualTaxSaved / annualContribution) * 100 : 0;
  const annualNetCost = annualContribution - annualTaxSaved;

  const yearsToSixty = Math.max(0, RETIREMENT_AGE - age);
  const totalContribution = annualContribution * yearsToSixty;
  const totalTaxSaved = annualTaxSaved * yearsToSixty;

  return {
    monthlyCap,
    appliedMonthlyContribution,
    annualContribution,
    marginalIncomeTaxRate: marginalRate(taxableIT) * 100,
    incomeTaxSaved,
    residentTaxSaved,
    annualTaxSaved,
    savingRate,
    annualNetCost,
    yearsToSixty,
    totalContribution,
    totalTaxSaved,
  };
}

export * from "./types";
