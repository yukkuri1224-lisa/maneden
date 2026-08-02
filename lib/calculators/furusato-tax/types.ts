export type IncomeType = "salary" | "business";

export interface FurusatoInput {
  /** 収入タイプ（給与＝会社員／事業＝フリーランス等） */
  incomeType: IncomeType;
  /** 給与年収 または 事業所得（円） */
  income: number;
  /** 年間の社会保険料（円） */
  socialInsurance: number;
  /** 配偶者控除の対象か */
  hasSpouse: boolean;
  /** 扶養親族の数（16歳以上の一般扶養） */
  dependents: number;
}

export interface FurusatoResult {
  /** 総所得（給与所得 または 事業所得） */
  totalIncome: number;
  /** 課税所得（所得税ベース） */
  taxableIncomeIncomeTax: number;
  /** 課税所得（住民税ベース） */
  taxableIncomeResident: number;
  /** 住民税所得割額 */
  residentTaxIncomeLevy: number;
  /** 所得税の限界税率（0〜0.45） */
  incomeTaxRate: number;
  /** ふるさと納税 控除上限額の目安（自己負担2,000円で済む上限） */
  donationLimit: number;
}
