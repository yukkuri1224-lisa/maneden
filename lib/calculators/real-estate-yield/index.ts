import { USEFUL_LIFE_YEARS } from "@/lib/constants/real-estate";

import type { CashFlowPoint, RealEstateInput, RealEstateResult } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 不動産投資の利回り・キャッシュフロー・デッドクロス発生年を概算する。
 *
 * - 表面利回り = 年間家賃 ÷ 物件価格
 * - 実質利回り = NOI（家賃 − 諸経費）÷ 物件価格
 * - ローンは元利均等返済。年次で元金・利息に分解する。
 * - 減価償却は定額法（建物価格 ÷ 耐用年数）、耐用年数経過後は0。
 * - デッドクロス = 年間元金返済額が年間減価償却費を上回る最初の年。
 */
export function calculateRealEstate(input: RealEstateInput): RealEstateResult {
  const price = Math.max(0, input.propertyPrice);
  const rent = Math.max(0, input.annualRent);
  const expenseRate = clamp(input.expenseRate / 100, 0, 1);
  const buildingRatio = clamp(input.buildingRatio / 100, 0, 1);

  const operatingExpenses = rent * expenseRate;
  const noi = rent - operatingExpenses;
  const grossYield = price > 0 ? (rent / price) * 100 : 0;
  const netYield = price > 0 ? (noi / price) * 100 : 0;

  const usefulLife = USEFUL_LIFE_YEARS[input.structure];
  const buildingValue = price * buildingRatio;
  const annualDepreciation = usefulLife > 0 ? buildingValue / usefulLife : 0;

  // 元利均等返済
  const principalAmount = Math.max(0, input.loanAmount);
  const years = Math.max(1, Math.round(input.loanYears));
  const months = years * 12;
  const monthlyRate = input.interestRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : principalAmount / months;
  const annualDebtService = monthlyPayment * 12;
  const totalRepayment = monthlyPayment * months;
  const beforeTaxCashFlow = noi - annualDebtService;

  // 年次スケジュール（元金・利息の分解）とデッドクロス判定
  const schedule: CashFlowPoint[] = [];
  let balance = principalAmount;
  let deadCrossYear: number | null = null;

  for (let year = 1; year <= years; year++) {
    let principalThisYear = 0;
    let interestThisYear = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate;
      let principal = monthlyPayment - interest;
      if (principal > balance) principal = balance;
      balance = Math.max(0, balance - principal);
      principalThisYear += principal;
      interestThisYear += interest;
    }
    const depreciation = year <= usefulLife ? annualDepreciation : 0;
    schedule.push({
      year,
      principal: Math.round(principalThisYear),
      interest: Math.round(interestThisYear),
      depreciation: Math.round(depreciation),
    });
    if (deadCrossYear === null && principalThisYear > depreciation) {
      deadCrossYear = year;
    }
  }

  return {
    grossYield,
    netYield,
    noi,
    buildingValue,
    annualDepreciation,
    usefulLife,
    monthlyPayment,
    annualDebtService,
    totalRepayment,
    beforeTaxCashFlow,
    deadCrossYear,
    schedule,
  };
}

export * from "./types";
