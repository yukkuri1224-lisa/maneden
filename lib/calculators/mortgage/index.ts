import type { MortgageInput, MortgageResult } from "./types";

/** 元利均等返済の毎月返済額。r は月利、n は返済回数（月）。 */
function monthlyPaymentAmount(principal: number, r: number, n: number): number {
  if (principal <= 0 || n <= 0) return 0;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

/**
 * 住宅ローン（元利均等返済）の返済額・総利息を計算する。
 * 繰上返済（期間短縮型）を指定した場合、その利息軽減・期間短縮の効果も返す。
 * すべて概算（毎月返済額は円未満を四捨五入せず内部計算し、表示時に丸める）。
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const principal = Math.max(0, input.principal);
  const years = Math.max(0, input.years);
  const n = Math.round(years * 12);
  const r = input.annualRatePercent / 100 / 12;

  const monthly = monthlyPaymentAmount(principal, r, n);
  const totalPayment = monthly * n;
  const totalInterest = totalPayment - principal;

  const prepay = Math.max(0, input.prepayment);
  const prepayMonth = Math.round(Math.max(0, input.prepaymentAfterYears) * 12);

  let prepaymentEffect = {
    applied: false,
    monthsSaved: 0,
    interestSaved: 0,
    newPayoffMonths: n,
    newTotalPayment: Math.round(totalPayment),
  };

  if (prepay > 0 && monthly > 0 && n > 0) {
    let balance = principal;
    let interestPaid = 0;
    let paidOut = 0;
    let months = 0;

    for (let m = 1; m <= n * 2 && balance > 0.005; m++) {
      const interest = balance * r;
      const principalPortion = monthly - interest;
      months = m;

      if (principalPortion >= balance) {
        // 最終月：残高＋利息を支払って完済
        interestPaid += interest;
        paidOut += balance + interest;
        balance = 0;
        break;
      }

      interestPaid += interest;
      balance -= principalPortion;
      paidOut += monthly;

      if (m === prepayMonth && balance > 0) {
        const applied = Math.min(prepay, balance);
        balance -= applied;
        paidOut += applied;
      }
    }

    prepaymentEffect = {
      applied: true,
      monthsSaved: Math.max(0, n - months),
      interestSaved: Math.max(0, Math.round(totalInterest - interestPaid)),
      newPayoffMonths: months,
      newTotalPayment: Math.round(paidOut),
    };
  }

  return {
    monthlyPayment: Math.round(monthly),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    totalMonths: n,
    prepaymentEffect,
  };
}

export * from "./types";
