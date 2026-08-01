import { TAX_TABLES } from "@/lib/constants/tax-tables";

import { floorTo } from "./helpers";

/**
 * 住民税（所得割 ＋ 均等割）を概算する。
 * - 所得割 = 課税所得（住民税ベース） × 10%
 * - 均等割（＋森林環境税）は課税所得が発生する場合に課す（概算）
 * - 調整控除は概算のため省略
 */
export function residentTax(taxableIncomeForResident: number): number {
  const taxable = floorTo(taxableIncomeForResident, 1000);
  const { rate, perCapita, forestTax } = TAX_TABLES.residentTax;

  const incomeLevy = floorTo(taxable * rate, 100);
  const perCapitaLevy = taxable > 0 ? perCapita + forestTax : 0;

  return incomeLevy + perCapitaLevy;
}
