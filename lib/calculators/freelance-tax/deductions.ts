import { clampMin0 } from "./helpers";

/** 所得税の基礎控除（令和8年分。合計所得金額に応じた額）。共通の年分別テーブルを使う */
export { basicDeductionIncomeTax } from "@/lib/calculators/common/salary-income";

/** 扶養控除（概算：一般扶養のみ） */
export function dependentDeduction(
  dependents: number,
  perPerson: number,
): number {
  return clampMin0(Math.floor(dependents)) * perPerson;
}

/**
 * 配偶者控除＋配偶者特別控除（概算）。
 * - 配偶者所得 48万円以下: 満額（配偶者控除）
 * - 95万円まで: 満額（配偶者特別控除）
 * - 95万〜133万円: 直線的に逓減（1万円単位に丸め）
 * - 133万円以上: 0
 */
export function spouseDeductionAmount(
  hasSpouse: boolean,
  spouseIncome: number,
  fullAmount: number,
): number {
  if (!hasSpouse) return 0;
  const income = clampMin0(spouseIncome);
  if (income <= 950_000) return fullAmount;
  if (income >= 1_330_000) return 0;
  const ratio = (1_330_000 - income) / (1_330_000 - 950_000);
  return Math.round((fullAmount * ratio) / 10_000) * 10_000;
}
