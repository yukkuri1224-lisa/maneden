import { TAX_TABLES } from "@/lib/constants/tax-tables";

/**
 * 国民年金保険料（年額）。
 * 実際には所得により免除・猶予があるが、Phase 1 では満額の概算とする。
 */
export function nationalPension(): number {
  return TAX_TABLES.nationalPension.annual;
}
