import { TAX_TABLES } from "@/lib/constants/tax-tables";

import { floorTo } from "./helpers";

/**
 * 課税所得から所得税額（復興特別所得税を除く）を速算表で算出する。
 * 課税所得は 1000 円未満を切り捨てる。
 */
export function incomeTaxBase(taxableIncome: number): number {
  const income = floorTo(taxableIncome, 1000);
  const bracket = TAX_TABLES.incomeTax.brackets.find((b) => income <= b.upTo);
  if (!bracket) return 0;
  return floorTo(income * bracket.rate - bracket.deduction, 1);
}

/** 復興特別所得税（所得税額 × 2.1%） */
export function reconstructionTax(incomeTaxBaseAmount: number): number {
  return floorTo(
    incomeTaxBaseAmount * TAX_TABLES.incomeTax.reconstructionRate,
    1,
  );
}
