import { TAX_TABLES } from "@/lib/constants/tax-tables";

import { consumptionTax } from "./consumptionTax";
import {
  basicDeductionIncomeTax,
  dependentDeduction,
  spouseDeductionAmount,
} from "./deductions";
import { clampMin0, floorTo } from "./helpers";
import { incomeTaxBase, reconstructionTax } from "./incomeTax";
import { nationalHealthInsurance } from "./nationalHealthInsurance";
import { residentTax } from "./residentTax";
import { nationalPension } from "./socialInsurance";
import type {
  FreelanceTaxInput,
  FreelanceTaxResult,
  InvoiceStatus,
} from "./types";

/**
 * フリーランス・副業の手取り＆税金を統合的に概算する。
 *
 * 依存関係（一方向）:
 *   事業所得 → 国保・国民年金 → 社会保険料控除 → 課税所得 → 所得税/住民税
 * 消費税はインボイス区分から独立に算出する。
 */
export function calculateFreelanceTax(
  input: FreelanceTaxInput,
): FreelanceTaxResult {
  const {
    revenue,
    expenses,
    blueReturnDeduction,
    dependents,
    hasSpouse,
    spouseIncome,
    invoiceStatus,
    businessCategory,
    isOver40,
  } = input;

  // 1. 事業所得
  const businessIncome = clampMin0(revenue - expenses - blueReturnDeduction);

  // 2. 社会保険料（国保・国民年金）＝ 所得控除にもなる
  const nhi = nationalHealthInsurance(businessIncome, isOver40);
  const pension = nationalPension();
  const socialInsuranceDeduction = nhi + pension;

  // 3. 所得控除（所得税ベース）
  const itTable = TAX_TABLES.incomeTax;
  const rtTable = TAX_TABLES.residentTax;

  const totalDeductions =
    basicDeductionIncomeTax(businessIncome) +
    dependentDeduction(dependents, itTable.dependentDeduction) +
    spouseDeductionAmount(hasSpouse, spouseIncome, itTable.spouseDeduction) +
    socialInsuranceDeduction;

  // 4. 所得税（復興特別所得税を含む）
  const taxableIncome = floorTo(
    clampMin0(businessIncome - totalDeductions),
    1000,
  );
  const itBase = incomeTaxBase(taxableIncome);
  const reconstruction = reconstructionTax(itBase);
  const incomeTax = floorTo(itBase + reconstruction, 100);

  // 5. 住民税（控除額が所得税と異なる）
  const taxableResident = clampMin0(
    businessIncome -
      rtTable.basicDeduction -
      dependentDeduction(dependents, rtTable.dependentDeduction) -
      spouseDeductionAmount(hasSpouse, spouseIncome, rtTable.spouseDeduction) -
      socialInsuranceDeduction,
  );
  const resident = residentTax(taxableResident);

  // 6. 消費税（インボイス）。免税のままなら0、登録時の負担額を invoiceImpact として提示
  const registeredStatus: InvoiceStatus =
    invoiceStatus === "exempt" ? "simplified-2wari" : invoiceStatus;
  const consumptionIfRegistered = consumptionTax(
    revenue,
    expenses,
    registeredStatus,
    businessCategory,
  );
  const consumption = invoiceStatus === "exempt" ? 0 : consumptionIfRegistered;

  // 7. 集計
  const totalBurden = incomeTax + resident + nhi + pension + consumption;
  const netIncome = revenue - expenses - totalBurden;
  const netIncomeRate = revenue > 0 ? (netIncome / revenue) * 100 : 0;

  return {
    businessIncome,
    totalDeductions,
    taxableIncome,
    incomeTax,
    reconstructionTax: reconstruction,
    residentTax: resident,
    nationalHealthInsurance: nhi,
    nationalPension: pension,
    consumptionTax: consumption,
    totalBurden,
    netIncome,
    netIncomeRate,
    invoiceImpact: consumptionIfRegistered,
  };
}

export * from "./types";
