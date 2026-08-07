export interface MortgageInput {
  /** 借入額（円） */
  principal: number;
  /** 年利（%） */
  annualRatePercent: number;
  /** 返済期間（年） */
  years: number;
  /** 繰上返済額（円・期間短縮型／0 = なし） */
  prepayment: number;
  /** 繰上返済を実行する時期（何年後） */
  prepaymentAfterYears: number;
}

export interface MortgagePrepaymentEffect {
  /** 繰上返済を行ったか */
  applied: boolean;
  /** 短縮された返済月数 */
  monthsSaved: number;
  /** 軽減された利息（円） */
  interestSaved: number;
  /** 繰上返済後の完済までの月数 */
  newPayoffMonths: number;
  /** 繰上返済後の総支払額（毎月返済＋繰上額・円） */
  newTotalPayment: number;
}

export interface MortgageResult {
  /** 毎月の返済額（円・元利均等） */
  monthlyPayment: number;
  /** 総返済額（円） */
  totalPayment: number;
  /** 総利息（円） */
  totalInterest: number;
  /** 返済回数（月） */
  totalMonths: number;
  /** 繰上返済（期間短縮型）の効果 */
  prepaymentEffect: MortgagePrepaymentEffect;
}
