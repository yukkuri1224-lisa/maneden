export interface RetirementTaxInput {
  /** 退職金の額（円） */
  amount: number;
  /** 勤続年数（年） */
  yearsOfService: number;
  /** 役員等か（勤続5年以下の役員等は1/2課税の対象外） */
  isExecutive: boolean;
}

export interface RetirementTaxResult {
  /** 退職所得控除額（円） */
  deduction: number;
  /** 課税退職所得金額（円・1000円未満切捨て） */
  taxableIncome: number;
  /** 所得税（復興特別所得税を含む・円） */
  incomeTax: number;
  /** 住民税（円） */
  residentTax: number;
  /** 税額合計（円） */
  totalTax: number;
  /** 手取り額（退職金 − 税額・円） */
  netAmount: number;
}
