import {
  BASIC_DEDUCTION_INCOME_TAX,
  CURRENT_INCOME_TAX_YEAR,
  CURRENT_RESIDENT_TAX_FISCAL_YEAR,
  RESIDENT_TAX_YEARS,
  type IncomeTaxYear,
  type ResidentTaxFiscalYear,
  type SalaryIncomeTableYear,
} from "@/lib/constants/tax-years";

/**
 * 給与所得控除後の給与等の金額（給与所得）。
 *
 * 令和8・9年分は所得税法別表第五（国税庁「令和8年分の年末調整等のための
 * 給与所得控除後の給与等の金額の表」）と同じ結果になるよう、表の刻みを再現する。
 * - 741,000円未満: 0円
 * - 741,000〜2,190,999円: 給与等の金額 − 740,000円
 * - 2,191,000〜2,199,999円: 表の3行（1,451,000 / 1,453,000 / 1,456,000円）
 * - 2,200,000〜6,599,999円: 4,000円未満を切り捨てた額に速算式を当てる
 * - 6,600,000〜8,499,999円: 給与等の金額 × 90% − 1,100,000円（1円未満切捨て）
 * - 8,500,000円以上: 給与等の金額 − 1,950,000円
 */
export function salaryIncomeAfterDeduction(
  income: number,
  year: SalaryIncomeTableYear = CURRENT_INCOME_TAX_YEAR,
): number {
  // 令和8年分と令和9年分は同じ表（年分の型で未実装の年を弾く）
  void year;
  // 小数の掛け算（×0.7 等）は浮動小数点の誤差で1円ずれるため、整数演算で求める
  const x = Math.floor(Math.max(0, income));
  if (x < 741_000) return 0;
  if (x < 2_191_000) return x - 740_000;
  if (x < 2_193_000) return 1_451_000;
  if (x < 2_196_000) return 1_453_000;
  if (x < 2_200_000) return 1_456_000;
  if (x < 6_600_000) {
    const rounded = Math.floor(x / 4000) * 4000;
    return x < 3_600_000
      ? (rounded * 7) / 10 - 80_000
      : (rounded * 8) / 10 - 440_000;
  }
  if (x < 8_500_000) return Math.floor((x * 9) / 10) - 1_100_000;
  return x - 1_950_000;
}

/** 所得税の基礎控除（合計所得金額と年分に応じた額） */
export function basicDeductionIncomeTax(
  totalIncome: number,
  year: IncomeTaxYear = CURRENT_INCOME_TAX_YEAR,
): number {
  const bracket = BASIC_DEDUCTION_INCOME_TAX[year].find(
    (b) => totalIncome <= b.upTo,
  );
  return bracket ? bracket.amount : 0;
}

/** 住民税の計算に使う給与所得（年度に応じた表） */
export function residentSalaryIncome(
  income: number,
  fiscalYear: ResidentTaxFiscalYear = CURRENT_RESIDENT_TAX_FISCAL_YEAR,
): number {
  return salaryIncomeAfterDeduction(
    income,
    RESIDENT_TAX_YEARS[fiscalYear].salaryIncomeTableYear,
  );
}

/** 住民税の基礎控除（年度ごと。合計所得2,400万円以下の額） */
export function residentBasicDeduction(
  fiscalYear: ResidentTaxFiscalYear = CURRENT_RESIDENT_TAX_FISCAL_YEAR,
): number {
  return RESIDENT_TAX_YEARS[fiscalYear].basicDeduction;
}
