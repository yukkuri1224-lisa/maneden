import { calculateBonusTakeHome } from "./index";

/**
 * ボーナス（賞与）の「額面別 手取り早見表」を、実際の計算関数から生成する。
 * 数値の正確性を担保するため calculateBonusTakeHome を再利用する。
 *
 * 前提:
 * - 所得税（源泉）の概算に必要な月給は「30万円（年収約360万円層）」に固定。
 *   額面ごとに基本給を変えると税率が動いて額面→手取りの関係が読めなくなるため、
 *   代表的な1つの月給に固定して「額面が変わると手取りがどう変わるか」を示す。
 * - 40歳未満（介護保険なし）・扶養なし
 * - 社会保険料は協会けんぽ・全国平均的な料率での概算
 */

/** 早見表で固定する前月給与（円）。年収約360万円層の代表値。 */
export const BONUS_TABLE_MONTHLY_SALARY = 300_000;

/** 早見表の額面行（円） */
export const BONUS_TABLE_AMOUNTS: number[] = [
  200_000, 300_000, 400_000, 500_000, 600_000, 700_000, 800_000, 900_000,
  1_000_000, 1_200_000, 1_500_000, 2_000_000,
];

export interface BonusTableRow {
  /** 額面（円） */
  amount: number;
  /** 社会保険料（円） */
  socialInsurance: number;
  /** 所得税（源泉・概算・円） */
  incomeTax: number;
  /** 手取り（円） */
  netBonus: number;
  /** 手取り率（%・小数1桁想定） */
  netRate: number;
}

/** 指定の額面での手取り内訳を返す */
export function bonusRowFor(amount: number): BonusTableRow {
  const r = calculateBonusTakeHome({
    bonus: amount,
    monthlySalary: BONUS_TABLE_MONTHLY_SALARY,
    isOver40: false,
    dependents: 0,
  });
  return {
    amount,
    socialInsurance: r.socialInsurance,
    incomeTax: r.incomeTax,
    netBonus: r.netBonus,
    netRate: r.netRate,
  };
}

/** 早見表の全行を生成する */
export function buildBonusTable(): BonusTableRow[] {
  return BONUS_TABLE_AMOUNTS.map((amount) => bonusRowFor(amount));
}
