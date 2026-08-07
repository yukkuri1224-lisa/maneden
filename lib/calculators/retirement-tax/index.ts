import { TAX_TABLES } from "@/lib/constants/tax-tables";

import type { RetirementTaxInput, RetirementTaxResult } from "./types";

function floorTo(value: number, unit: number): number {
  if (value <= 0) return 0;
  return Math.floor(value / unit) * unit;
}

/**
 * 退職所得控除額。
 * 勤続20年まで：40万円 × 年数（最低80万円）。20年超：800万円 ＋ 70万円 ×（年数 − 20）。
 * 勤続年数は1年未満を切り上げる。
 */
export function retirementDeduction(yearsOfService: number): number {
  const years = Math.max(1, Math.ceil(yearsOfService));
  if (years <= 20) return Math.max(800_000, 400_000 * years);
  return 8_000_000 + 700_000 * (years - 20);
}

/** 課税退職所得金額（分離課税）に対する所得税額（復興特別所得税込み）。 */
function retirementIncomeTax(taxableIncome: number): number {
  const income = floorTo(taxableIncome, 1000);
  const bracket = TAX_TABLES.incomeTax.brackets.find((b) => income <= b.upTo);
  if (!bracket) return 0;
  const base = income * bracket.rate - bracket.deduction;
  if (base <= 0) return 0;
  return Math.floor(base * (1 + TAX_TABLES.incomeTax.reconstructionRate));
}

/**
 * 退職金にかかる所得税・住民税（分離課税）と手取りを概算する。
 * 退職所得 =（退職金 − 退職所得控除）× 1/2 が原則。
 * ただし勤続5年以下は、役員等は1/2なし、非役員（短期退職手当等）は300万円超部分を1/2しない。
 */
export function calculateRetirementTax(
  input: RetirementTaxInput,
): RetirementTaxResult {
  const amount = Math.max(0, input.amount);
  const deduction = retirementDeduction(input.yearsOfService);
  const base = Math.max(0, amount - deduction);
  const years = Math.max(1, Math.ceil(input.yearsOfService));

  let taxableRaw: number;
  if (input.isExecutive && years <= 5) {
    // 特定役員退職手当等：1/2 課税なし
    taxableRaw = base;
  } else if (years <= 5) {
    // 短期退職手当等（非役員）：300万円を超える部分は1/2しない
    taxableRaw = base <= 3_000_000 ? base / 2 : 1_500_000 + (base - 3_000_000);
  } else {
    taxableRaw = base / 2;
  }

  const taxableIncome = floorTo(taxableRaw, 1000);
  const incomeTax = retirementIncomeTax(taxableIncome);
  const residentTax = Math.floor(taxableIncome * TAX_TABLES.residentTax.rate);
  const totalTax = incomeTax + residentTax;

  return {
    deduction,
    taxableIncome,
    incomeTax,
    residentTax,
    totalTax,
    netAmount: amount - totalTax,
  };
}

export * from "./types";
