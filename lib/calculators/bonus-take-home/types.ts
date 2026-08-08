export interface BonusTakeHomeInput {
  /** 賞与（額面・円） */
  bonus: number;
  /** 前月の給与（額面・円）— 所得税の概算に使用 */
  monthlySalary: number;
  /** 40〜64歳（介護保険料の対象）か */
  isOver40: boolean;
  /** 扶養親族の数（16歳以上の一般扶養） */
  dependents: number;
}

export interface BonusTakeHomeResult {
  /** 社会保険料（本人負担・合計・円） */
  socialInsurance: number;
  /** 所得税（源泉・概算・円） */
  incomeTax: number;
  /** 控除合計（社会保険料＋所得税・円） */
  totalDeduction: number;
  /** 手取りの賞与（円） */
  netBonus: number;
  /** 手取り率（%） */
  netRate: number;
}
