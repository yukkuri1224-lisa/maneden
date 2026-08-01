import { SUBSIDY_PROGRAMS } from "@/lib/constants/subsidies";

import type { SubsidyInput, SubsidyMatch } from "./types";

/**
 * 入力条件に該当しそうな補助金を抽出し、概算受給額の大きい順に並べる。
 *
 * マッチ条件:
 * - 事業目的が1つ以上一致する
 * - 小規模限定の制度は、従業員数が上限以下である
 *
 * 概算受給額 = min(投資予定額 × 補助率上限, 補助上限額)
 */
export function findSubsidies(input: SubsidyInput): SubsidyMatch[] {
  const investment = Math.max(0, input.investmentAmount);
  const employees = Math.max(0, input.employees);

  return SUBSIDY_PROGRAMS.filter((program) => {
    const purposeMatch = input.purposes.some((purpose) =>
      program.purposes.includes(purpose),
    );
    if (!purposeMatch) return false;

    if (
      program.smallBusinessOnly &&
      program.smallBusinessEmployeeMax !== undefined &&
      employees > program.smallBusinessEmployeeMax
    ) {
      return false;
    }
    return true;
  })
    .map((program) => ({
      program,
      estimatedAmount: Math.min(
        investment * program.subsidyRateMax,
        program.maxAmount,
      ),
      estimatedMin: Math.min(
        investment * program.subsidyRateMin,
        program.maxAmount,
      ),
    }))
    .sort((a, b) => b.estimatedAmount - a.estimatedAmount);
}

export * from "./types";
