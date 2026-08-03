export interface SalaryTakeHomeInput {
  /** 年収（額面・円） */
  income: number;
  /** 40〜64歳（介護保険料の対象）か */
  isOver40: boolean;
  /** 配偶者控除の対象か */
  hasSpouse: boolean;
  /** 扶養親族の数（16歳以上の一般扶養） */
  dependents: number;
}

export interface SalaryTakeHomeResult {
  /** 給与所得（給与所得控除後） */
  salaryIncome: number;
  /** 社会保険料（本人負担・合計） */
  socialInsurance: number;
  /** 健康保険料（介護保険含む・本人負担） */
  healthInsurance: number;
  /** 厚生年金保険料（本人負担） */
  pensionInsurance: number;
  /** 雇用保険料（本人負担） */
  employmentInsurance: number;
  /** 課税所得（所得税ベース） */
  taxableIncomeIncomeTax: number;
  /** 課税所得（住民税ベース） */
  taxableIncomeResident: number;
  /** 所得税（復興特別所得税を含む） */
  incomeTax: number;
  /** 住民税 */
  residentTax: number;
  /** 年間手取り額 */
  netIncome: number;
  /** 手取り率（%） */
  netIncomeRate: number;
}
