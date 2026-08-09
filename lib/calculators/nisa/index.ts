import type { NisaInput, NisaResult, NisaYearPoint } from "./types";

/** 新NISA の生涯投資枠（円） */
export const NISA_LIFETIME_CAP = 18_000_000;
/** 新NISA の年間投資枠（つみたて120万＋成長240万・円） */
export const NISA_ANNUAL_CAP = 3_600_000;
/** 上場株式等の譲渡益にかかる税率（所得税15%＋復興0.315%＋住民税5%） */
export const CAPITAL_GAINS_TAX_RATE = 0.20315;

/**
 * 新NISA のつみたて（＋初期一括）の将来評価額と、非課税による節税メリットを概算する。
 *
 * - 毎月の積立は「月末に拠出」する前提の複利（想定年利を12で割った月利で運用）。
 * - 年間投資枠（360万円）と生涯投資枠（1,800万円）の上限を反映し、
 *   枠を超える分は投資されない（既に投資した残高は運用され続ける）。
 * - 非課税メリット＝運用益 × 20.315%（課税口座なら運用益にかかる税額）。
 */
export function calculateNisa(input: NisaInput): NisaResult {
  const years = Math.max(0, Math.floor(input.years));
  const monthlyRate = Math.max(0, input.annualReturnPercent) / 100 / 12;
  const monthly = Math.max(0, input.monthlyContribution);
  const initial = Math.max(0, input.initialLumpSum);

  let balance = 0;
  let principal = 0;
  let capReachedYear: number | null = null;
  const timeline: NisaYearPoint[] = [];

  // 年間枠・生涯枠の空きに収まる範囲で拠出額を決める。
  const investable = (desired: number, investedThisYear: number): number => {
    const roomYear = Math.max(0, NISA_ANNUAL_CAP - investedThisYear);
    const roomLife = Math.max(0, NISA_LIFETIME_CAP - principal);
    return Math.min(desired, roomYear, roomLife);
  };

  for (let y = 1; y <= years; y++) {
    let investedThisYear = 0;
    for (let m = 1; m <= 12; m++) {
      // 先に既存残高を運用（月末拠出のため今月分は運用しない）。
      balance *= 1 + monthlyRate;

      // 初期一括は初月に拠出（年間枠・生涯枠の対象）。
      if (y === 1 && m === 1 && initial > 0) {
        const amount = investable(initial, investedThisYear);
        balance += amount;
        principal += amount;
        investedThisYear += amount;
      }

      // 毎月の積立。
      if (monthly > 0) {
        const amount = investable(monthly, investedThisYear);
        balance += amount;
        principal += amount;
        investedThisYear += amount;
      }

      if (capReachedYear === null && principal >= NISA_LIFETIME_CAP) {
        capReachedYear = y;
      }
    }

    timeline.push({
      year: y,
      principal: Math.round(principal),
      balance: Math.round(balance),
    });
  }

  const futureValue = Math.round(balance);
  const totalPrincipal = Math.round(principal);
  const totalGain = Math.max(0, futureValue - totalPrincipal);
  const taxSaved = Math.round(totalGain * CAPITAL_GAINS_TAX_RATE);

  return {
    totalPrincipal,
    futureValue,
    totalGain,
    taxSaved,
    reachedLifetimeCap: capReachedYear !== null,
    capReachedYear,
    timeline,
  };
}

export * from "./types";
